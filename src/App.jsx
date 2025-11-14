import { useState, useEffect } from 'react'

const SERVICE_OPTIONS = [
  'Standard Cleaning',
  'Deep Cleaning',
  'Move In/Out',
  'Office Cleaning',
  'Post-Construction',
  'Carpet Cleaning',
]

function Input({ label, required, ...props }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-gray-700 mb-1">{label}{required && ' *'}</span>
      <input
        {...props}
        className="w-full rounded-md border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 px-3 py-2 outline-none"
      />
    </label>
  )
}

function Select({ label, options, required, ...props }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-gray-700 mb-1">{label}{required && ' *'}</span>
      <select
        {...props}
        className="w-full rounded-md border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 px-3 py-2 outline-none bg-white"
      >
        <option value="">Select...</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </label>
  )
}

function TextArea({ label, required, ...props }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-gray-700 mb-1">{label}{required && ' *'}</span>
      <textarea
        {...props}
        className="w-full rounded-md border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 px-3 py-2 outline-none min-h-[100px]"
      />
    </label>
  )
}

function App() {
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [leads, setLeads] = useState([])

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    service_type: '',
    bedrooms: '',
    bathrooms: '',
    preferred_date: '',
    message: '',
  })

  const onChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSubmitted(false)
    try {
      const res = await fetch(`${baseUrl}/api/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          bedrooms: form.bedrooms ? Number(form.bedrooms) : null,
          bathrooms: form.bathrooms ? Number(form.bathrooms) : null,
        }),
      })
      if (!res.ok) throw new Error('Failed to submit')
      setSubmitted(true)
      setForm({
        name: '', email: '', phone: '', address: '', city: '', service_type: '', bedrooms: '', bathrooms: '', preferred_date: '', message: ''
      })
      await loadLeads()
    } catch (err) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const loadLeads = async () => {
    try {
      const res = await fetch(`${baseUrl}/api/leads?limit=5`)
      if (res.ok) {
        const data = await res.json()
        setLeads(data.items || [])
      }
    } catch {}
  }

  useEffect(() => {
    loadLeads()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <header className="bg-white/80 backdrop-blur border-b border-blue-100">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-blue-600 text-white grid place-items-center font-bold">C</div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">CrystalClean Services</h1>
              <p className="text-sm text-gray-500">Sparkling homes and offices, every time</p>
            </div>
          </div>
          <a href="#lead" className="text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md">Get a Quote</a>
        </div>
      </header>

      <main>
        <section className="max-w-5xl mx-auto px-6 py-14 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 leading-tight">Professional cleaning you can trust</h2>
            <p className="mt-4 text-gray-600">Book reliable cleaners for your home or office. We bring supplies, follow checklists, and leave your space spotless.</p>
            <ul className="mt-6 grid grid-cols-2 gap-3 text-sm text-gray-700">
              <li className="flex items-center gap-2"><span className="h-2 w-2 bg-green-500 rounded-full"/> Vetted & insured pros</li>
              <li className="flex items-center gap-2"><span className="h-2 w-2 bg-green-500 rounded-full"/> Eco-friendly products</li>
              <li className="flex items-center gap-2"><span className="h-2 w-2 bg-green-500 rounded-full"/> Transparent pricing</li>
              <li className="flex items-center gap-2"><span className="h-2 w-2 bg-green-500 rounded-full"/> 100% satisfaction</li>
            </ul>
            <div className="mt-6 flex gap-3">
              <a href="#lead" className="px-5 py-2.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white">Get a free quote</a>
              <a href="#services" className="px-5 py-2.5 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50">Our services</a>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow border border-blue-100 p-6">
            <form onSubmit={submit} id="lead">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Full name" name="name" required value={form.name} onChange={onChange} placeholder="Jane Doe" />
                <Input label="Email" name="email" type="email" required value={form.email} onChange={onChange} placeholder="jane@email.com" />
                <Input label="Phone" name="phone" required value={form.phone} onChange={onChange} placeholder="(555) 555-1234" />
                <Input label="City" name="city" value={form.city} onChange={onChange} placeholder="San Francisco" />
                <Input label="Address" name="address" required className="md:col-span-2" value={form.address} onChange={onChange} placeholder="123 Main St" />
                <Select label="Service type" name="service_type" required value={form.service_type} onChange={onChange} options={SERVICE_OPTIONS} />
                <Input label="Bedrooms" name="bedrooms" type="number" min="0" value={form.bedrooms} onChange={onChange} />
                <Input label="Bathrooms" name="bathrooms" type="number" min="0" value={form.bathrooms} onChange={onChange} />
                <Input label="Preferred date" name="preferred_date" type="date" value={form.preferred_date} onChange={onChange} />
                <TextArea label="Anything else?" name="message" value={form.message} onChange={onChange} className="md:col-span-2" />
              </div>
              <button
                disabled={loading}
                className="mt-5 w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-medium py-2.5 rounded-md"
              >{loading ? 'Submitting...' : 'Request quote'}</button>
              {submitted && <p className="mt-3 text-green-700 bg-green-50 border border-green-200 px-3 py-2 rounded">Thanks! We received your request and will reach out shortly.</p>}
              {error && <p className="mt-3 text-red-700 bg-red-50 border border-red-200 px-3 py-2 rounded">{error}</p>}
            </form>
          </div>
        </section>

        <section id="services" className="bg-blue-50/60 border-y border-blue-100">
          <div className="max-w-5xl mx-auto px-6 py-12 grid md:grid-cols-3 gap-6">
            {SERVICE_OPTIONS.map((s) => (
              <div key={s} className="bg-white rounded-lg p-5 border border-blue-100 shadow-sm">
                <h3 className="font-semibold text-gray-900">{s}</h3>
                <p className="text-sm text-gray-600 mt-2">High-quality {s.toLowerCase()} tailored to your space.</p>
              </div>
            ))}
          </div>
        </section>

        <section className="max-w-5xl mx-auto px-6 py-12">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Recent quote requests</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {leads.length === 0 && (
              <p className="text-gray-600">No recent requests yet. Be the first to request a quote!</p>
            )}
            {leads.map((l) => (
              <div key={l.id} className="bg-white border border-blue-100 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="font-medium text-gray-900">{l.name}</div>
                  <div className="text-xs text-gray-500">{l.service_type}</div>
                </div>
                <div className="text-sm text-gray-600 mt-1">{l.city || ''} {l.city && '•'} {l.preferred_date || 'Flexible'}</div>
                {l.message && <div className="text-sm text-gray-700 mt-2">“{l.message}”</div>}
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-blue-100 py-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} CrystalClean Services. All rights reserved.
      </footer>
    </div>
  )
}

export default App
