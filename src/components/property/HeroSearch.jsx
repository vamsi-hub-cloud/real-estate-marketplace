import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'
import { cityNames } from '../../data/cities'
import { PROPERTY_TYPES } from '../../data/properties'

const PRICE_OPTIONS = {
  buy: [['', 'Any price'], ['500000', 'Up to $500K'], ['1000000', 'Up to $1M'], ['2000000', 'Up to $2M']],
  rent: [['', 'Any price'], ['2000', 'Up to $2,000/mo'], ['3500', 'Up to $3,500/mo'], ['6000', 'Up to $6,000/mo']],
}

export default function HeroSearch() {
  const navigate = useNavigate()
  const [status, setStatus] = useState('buy')
  const [q, setQ] = useState('')
  const [city, setCity] = useState('')
  const [type, setType] = useState('')
  const [max, setMax] = useState('')

  const submit = (e) => {
    e.preventDefault()
    const sp = new URLSearchParams({ status })
    if (q.trim()) sp.set('q', q.trim())
    if (city) sp.set('city', city)
    if (type) sp.set('type', type)
    if (max) sp.set('max', max)
    navigate(`/properties?${sp.toString()}`)
  }

  return (
    <form onSubmit={submit} className="w-full max-w-4xl rounded-2xl bg-white p-3 shadow-lift sm:p-4" role="search" aria-label="Search homes">
      <div role="tablist" aria-label="Listing type" className="mb-3 inline-flex rounded-xl bg-spruce-50 p-1">
        {['buy', 'rent'].map((s) => (
          <button
            key={s}
            type="button"
            role="tab"
            aria-selected={status === s}
            onClick={() => { setStatus(s); setMax('') }}
            className={`rounded-lg px-5 py-2 text-sm font-semibold capitalize transition-colors ${status === s ? 'bg-spruce text-white' : 'text-spruce hover:bg-white'}`}
          >
            {s}
          </button>
        ))}
      </div>
      <div className="grid gap-3 md:grid-cols-[1.5fr_1fr_1fr_1fr_auto]">
        <div>
          <label htmlFor="hs-q" className="sr-only">Neighborhood, address or keyword</label>
          <input id="hs-q" className="input h-12" placeholder="Neighborhood, street or keyword" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <div>
          <label htmlFor="hs-city" className="sr-only">City</label>
          <select id="hs-city" className="input h-12" value={city} onChange={(e) => setCity(e.target.value)}>
            <option value="">Any city</option>
            {cityNames.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="hs-type" className="sr-only">Property type</label>
          <select id="hs-type" className="input h-12" value={type} onChange={(e) => setType(e.target.value)}>
            <option value="">Any type</option>
            {PROPERTY_TYPES.map((t) => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="hs-price" className="sr-only">Maximum price</label>
          <select id="hs-price" className="input h-12" value={max} onChange={(e) => setMax(e.target.value)}>
            {PRICE_OPTIONS[status].map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </div>
        <button type="submit" className="btn btn-accent h-12 px-6">
          <Search size={18} /> Search
        </button>
      </div>
    </form>
  )
}
