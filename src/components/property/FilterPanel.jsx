import { useState } from 'react'
import { cityNames } from '../../data/cities'
import { AMENITIES, PROPERTY_TYPES } from '../../data/properties'

const PRESETS = {
  buy: [['Under $500K', '', '500000'], ['$500K – $1M', '500000', '1000000'], ['$1M+', '1000000', '']],
  rent: [['Under $2,000', '', '2000'], ['$2,000 – $3,500', '2000', '3500'], ['$3,500+', '3500', '']],
}

function Group({ title, children }) {
  return (
    <fieldset className="border-b border-spruce/10 py-5 first:pt-0 last:border-0">
      <legend className="mb-3 font-display text-base font-semibold text-spruce">{title}</legend>
      {children}
    </fieldset>
  )
}

function Pills({ value, onChange, options, label }) {
  return (
    <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={label}>
      {options.map(([v, text]) => (
        <button
          key={v}
          type="button"
          role="radio"
          aria-checked={value === v}
          onClick={() => onChange(v)}
          className={`rounded-lg border px-3.5 py-2 text-sm font-medium transition-colors ${value === v ? 'border-spruce bg-spruce text-white' : 'border-spruce/20 bg-white text-spruce hover:bg-spruce-50'}`}
        >
          {text}
        </button>
      ))}
    </div>
  )
}

export default function FilterPanel({ filters, onChange, onReset, idPrefix = 'f' }) {
  const [showAll, setShowAll] = useState(false)
  const toggle = (key, val) =>
    onChange({ [key]: filters[key].includes(val) ? filters[key].filter((x) => x !== val) : [...filters[key], val] })
  const amenities = showAll ? AMENITIES : AMENITIES.slice(0, 8)
  const presets = PRESETS[filters.status]

  return (
    <div>
      <Group title="Listing type">
        <Pills
          label="Listing type"
          value={filters.status}
          onChange={(v) => onChange({ status: v, min: '', max: '' })}
          options={[['all', 'All'], ['buy', 'Buy'], ['rent', 'Rent']]}
        />
      </Group>

      <Group title="Property type">
        <div className="grid grid-cols-2 gap-2.5">
          {PROPERTY_TYPES.map((t) => (
            <label key={t} className="flex cursor-pointer items-center gap-2.5 text-sm">
              <input type="checkbox" className="h-4 w-4 rounded border-spruce/30 accent-spruce" checked={filters.types.includes(t)} onChange={() => toggle('types', t)} />
              {t}
            </label>
          ))}
        </div>
      </Group>

      <Group title="Location">
        <label htmlFor={`${idPrefix}-city`} className="sr-only">City</label>
        <select id={`${idPrefix}-city`} className="input" value={filters.city} onChange={(e) => onChange({ city: e.target.value })}>
          <option value="">All cities</option>
          {cityNames.map((c) => <option key={c}>{c}</option>)}
        </select>
      </Group>

      <Group title={filters.status === 'rent' ? 'Monthly rent' : 'Price'}>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor={`${idPrefix}-min`} className="mb-1 block text-xs text-slate">Min ($)</label>
            <input id={`${idPrefix}-min`} type="number" min="0" inputMode="numeric" className="input" placeholder="No min" value={filters.min} onChange={(e) => onChange({ min: e.target.value })} />
          </div>
          <div>
            <label htmlFor={`${idPrefix}-max`} className="mb-1 block text-xs text-slate">Max ($)</label>
            <input id={`${idPrefix}-max`} type="number" min="0" inputMode="numeric" className="input" placeholder="No max" value={filters.max} onChange={(e) => onChange({ max: e.target.value })} />
          </div>
        </div>
        {presets ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {presets.map(([label, min, max]) => (
              <button
                key={label}
                type="button"
                onClick={() => onChange({ min, max })}
                className={`chip transition-colors hover:bg-spruce-50 ${filters.min === min && filters.max === max ? 'border-spruce bg-spruce-50' : ''}`}
              >
                {label}
              </button>
            ))}
          </div>
        ) : (
          <p className="mt-3 text-xs text-slate">Choose Buy or Rent to see price presets. Sale prices and monthly rents are on different scales.</p>
        )}
      </Group>

      <Group title="Bedrooms">
        <Pills label="Minimum bedrooms" value={filters.beds} onChange={(v) => onChange({ beds: v })} options={[[0, 'Any'], [1, '1+'], [2, '2+'], [3, '3+'], [4, '4+']]} />
      </Group>

      <Group title="Bathrooms">
        <Pills label="Minimum bathrooms" value={filters.baths} onChange={(v) => onChange({ baths: v })} options={[[0, 'Any'], [1, '1+'], [2, '2+'], [3, '3+']]} />
      </Group>

      <Group title="Amenities">
        <div className="grid grid-cols-2 gap-2.5">
          {amenities.map((a) => (
            <label key={a} className="flex cursor-pointer items-center gap-2.5 text-sm">
              <input type="checkbox" className="h-4 w-4 rounded border-spruce/30 accent-spruce" checked={filters.amenities.includes(a)} onChange={() => toggle('amenities', a)} />
              {a}
            </label>
          ))}
        </div>
        <button type="button" onClick={() => setShowAll((s) => !s)} className="mt-3 text-sm font-semibold text-spruce-500 hover:text-spruce">
          {showAll ? 'Show fewer' : `Show all ${AMENITIES.length}`}
        </button>
      </Group>

      <button type="button" onClick={onReset} className="btn btn-outline mt-2 w-full">Reset all filters</button>
    </div>
  )
}
