import { Link } from 'react-router-dom'
import { ArrowLeftRight, Check, Minus, X } from 'lucide-react'
import PropertyImage from '../components/common/PropertyImage'
import EmptyState from '../components/common/EmptyState'
import Button from '../components/common/Button'
import { useApp } from '../context/AppContext'
import { AMENITIES } from '../data/properties'
import { number, priceLabel } from '../utils/format'
import { useTitle } from '../hooks/useTitle'

export default function Compare() {
  const { compare, getProperty, toggleCompare, clearCompare } = useApp()
  const items = compare.map(getProperty).filter(Boolean)
  useTitle('Compare homes')

  if (items.length < 2) {
    return (
      <div className="container-page py-16">
        <EmptyState
          icon={ArrowLeftRight}
          title={items.length === 1 ? 'Add one more home to compare' : 'Pick homes to compare'}
          action={<Button to="/properties">Browse homes</Button>}
        >
          Use the compare button on any listing to line up two or three homes side by side.
        </EmptyState>
      </div>
    )
  }

  // Highlight the best value in each numeric row.
  const best = (fn, dir) => {
    const vals = items.map(fn)
    const target = dir === 'min' ? Math.min(...vals) : Math.max(...vals)
    return vals.map((v) => v === target && vals.filter((x) => x === target).length < vals.length)
  }
  const mixedStatus = new Set(items.map((p) => p.status)).size > 1

  const rows = [
    { label: 'Price', cell: (p) => priceLabel(p), best: mixedStatus ? null : best((p) => p.price, 'min') },
    { label: 'Type', cell: (p) => p.type },
    { label: 'Status', cell: (p) => (p.status === 'rent' ? 'For rent' : 'For sale') },
    { label: 'Location', cell: (p) => `${p.neighborhood}, ${p.city}` },
    { label: 'Bedrooms', cell: (p) => p.beds, best: best((p) => p.beds, 'max') },
    { label: 'Bathrooms', cell: (p) => p.baths, best: best((p) => p.baths, 'max') },
    { label: 'Living area', cell: (p) => `${number(p.area)} sq ft`, best: best((p) => p.area, 'max') },
    {
      label: 'Price per sq ft',
      cell: (p) => `$${(p.price / p.area).toFixed(p.status === 'rent' ? 2 : 0)}`,
      best: mixedStatus ? null : best((p) => p.price / p.area, 'min'),
    },
    { label: 'Year built', cell: (p) => p.year, best: best((p) => p.year, 'max') },
    { label: 'Parking spaces', cell: (p) => p.parking, best: best((p) => p.parking, 'max') },
    { label: 'Amenities', cell: (p) => p.amenities.length, best: best((p) => p.amenities.length, 'max') },
  ]

  const allAmenities = AMENITIES.filter((a) => items.some((p) => p.amenities.includes(a)))
  const colW = items.length === 3 ? 'min-w-[14rem]' : 'min-w-[16rem]'
  const labelCell = 'sticky left-0 z-10 w-32 bg-white px-4 py-3 text-left text-sm font-medium text-slate sm:w-44'

  return (
    <div className="container-page py-8 sm:py-10">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-spruce sm:text-4xl">Compare homes</h1>
          <p className="mt-1 text-slate">Highlighted cells show the strongest value in each row.</p>
        </div>
        <button type="button" onClick={clearCompare} className="btn btn-outline btn-sm">Clear comparison</button>
      </div>

      {mixedStatus && (
        <p className="mb-4 rounded-xl bg-marigold-100 px-4 py-3 text-sm text-ink">You’re comparing sale and rental listings, so price rows aren’t highlighted.</p>
      )}

      <div className="surface overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className={`${labelCell} align-bottom`}><span className="sr-only">Feature</span></th>
              {items.map((p) => (
                <th key={p.id} className={`${colW} p-4 text-left align-top font-normal`}>
                  <div className="relative">
                    <div className="aspect-[4/3] overflow-hidden rounded-xl bg-spruce-50"><PropertyImage property={p} /></div>
                    <button type="button" onClick={() => toggleCompare(p.id)} aria-label={`Remove ${p.title}`} className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-white/95 text-spruce shadow-card hover:bg-white"><X size={16} /></button>
                  </div>
                  <Link to={`/properties/${p.id}`} className="mt-3 block font-display text-lg font-bold leading-snug text-spruce hover:text-spruce-500">{p.title}</Link>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label} className="border-t border-spruce/10">
                <th scope="row" className={labelCell}>{row.label}</th>
                {items.map((p, i) => (
                  <td key={p.id} className={`px-4 py-3 text-sm font-semibold ${row.best?.[i] ? 'bg-spruce-50 text-spruce' : ''}`}>
                    {row.cell(p)}
                    {row.best?.[i] && <span className="ml-2 rounded-full bg-marigold px-2 py-0.5 text-[11px] font-bold text-ink">Best</span>}
                  </td>
                ))}
              </tr>
            ))}
            <tr className="border-t-2 border-spruce/15">
              <th scope="row" className={`${labelCell} text-spruce`} colSpan={items.length + 1}>Amenity checklist</th>
            </tr>
            {allAmenities.map((a) => (
              <tr key={a} className="border-t border-spruce/10">
                <th scope="row" className={labelCell}>{a}</th>
                {items.map((p) => (
                  <td key={p.id} className="px-4 py-2.5">
                    {p.amenities.includes(a) ? (
                      <span className="inline-flex items-center gap-1.5 text-sm font-medium text-spruce-500"><Check size={17} /> Included</span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-sm text-slate-soft"><Minus size={17} /> No</span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
            <tr className="border-t border-spruce/10">
              <th scope="row" className={labelCell}><span className="sr-only">View</span></th>
              {items.map((p) => (
                <td key={p.id} className="px-4 py-4"><Link to={`/properties/${p.id}`} className="btn btn-primary btn-sm">View listing</Link></td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
