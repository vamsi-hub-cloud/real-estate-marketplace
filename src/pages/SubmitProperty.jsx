import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Check, CheckCircle2, ImagePlus, X } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { cities, cityNames } from '../data/cities'
import { agentForCity } from '../data/agents'
import { AMENITIES, PROPERTY_TYPES } from '../data/properties'
import { money } from '../utils/format'
import { useTitle } from '../hooks/useTitle'

const STEPS = ['Basics', 'Location & size', 'Details & photos', 'Review']
const MAX_PHOTOS = 4

const initial = {
  title: '', status: 'buy', type: 'House', price: '',
  city: '', neighborhood: '', address: '', beds: '', baths: '', area: '', year: '', parking: '0',
  description: '', amenities: [], photos: [],
}

const readFile = (file) => new Promise((res, rej) => {
  const fr = new FileReader()
  fr.onload = () => res(fr.result)
  fr.onerror = rej
  fr.readAsDataURL(file)
})
const loadImage = (src) => new Promise((res, rej) => {
  const img = new Image()
  img.onload = () => res(img)
  img.onerror = rej
  img.src = src
})
// Shrinks uploads so they fit comfortably in localStorage.
async function compress(file) {
  const img = await loadImage(await readFile(file))
  const scale = Math.min(1, 1000 / Math.max(img.width, img.height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(img.width * scale)
  canvas.height = Math.round(img.height * scale)
  canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)
  return canvas.toDataURL('image/jpeg', 0.72)
}

function validate(step, v) {
  const er = {}
  if (step === 0) {
    if (v.title.trim().length < 8) er.title = 'Give the listing a title of at least 8 characters.'
    const price = Number(v.price)
    if (!v.price || Number.isNaN(price) || price <= 0) er.price = 'Enter a price greater than zero.'
    else if (v.status === 'rent' && price > 100000) er.price = 'Monthly rent looks too high. Enter the amount per month.'
    else if (v.status === 'buy' && price < 10000) er.price = 'Sale price looks too low. Enter the full asking price.'
  }
  if (step === 1) {
    if (!v.city) er.city = 'Choose a city.'
    if (!v.neighborhood) er.neighborhood = 'Choose a neighborhood.'
    if (v.address.trim().length < 5) er.address = 'Enter the street address.'
    if (v.beds === '' || Number(v.beds) < 0 || Number(v.beds) > 20) er.beds = 'Enter 0–20 bedrooms.'
    if (v.baths === '' || Number(v.baths) < 1 || Number(v.baths) > 20) er.baths = 'Enter 1–20 bathrooms.'
    if (!v.area || Number(v.area) < 100 || Number(v.area) > 50000) er.area = 'Enter an area between 100 and 50,000 sq ft.'
    const y = Number(v.year)
    if (!v.year || y < 1800 || y > new Date().getFullYear() + 2) er.year = 'Enter a valid year built.'
  }
  if (step === 2) {
    if (v.description.trim().length < 40) er.description = 'Describe the home in at least 40 characters.'
  }
  return er
}

function Field({ id, label, error, children, hint }) {
  return (
    <div>
      <label htmlFor={id} className="field-label">{label}</label>
      {children}
      {hint && !error && <p className="mt-1.5 text-[13px] text-slate">{hint}</p>}
      {error && <p className="field-error" role="alert">{error}</p>}
    </div>
  )
}

export default function SubmitProperty() {
  const { addProperty, toast } = useApp()
  const [step, setStep] = useState(0)
  const [v, setV] = useState(initial)
  const [errors, setErrors] = useState({})
  const [created, setCreated] = useState(null)
  const [uploading, setUploading] = useState(false)
  useTitle('List a property')

  const set = (k) => (e) => {
    setV((x) => ({ ...x, [k]: e.target.value, ...(k === 'city' ? { neighborhood: '' } : {}) }))
    if (errors[k]) setErrors((er) => ({ ...er, [k]: undefined }))
  }
  const cls = (k) => (errors[k] ? 'input input-error' : 'input')

  const next = () => {
    const er = validate(step, v)
    setErrors(er)
    if (Object.keys(er).length === 0) setStep((s) => s + 1)
  }

  const addPhotos = async (e) => {
    const files = Array.from(e.target.files || [])
    e.target.value = ''
    const room = MAX_PHOTOS - v.photos.length
    if (!files.length) return
    if (room <= 0) return toast(`You can add up to ${MAX_PHOTOS} photos`, 'error')
    setUploading(true)
    try {
      const ok = files.filter((f) => f.type.startsWith('image/')).slice(0, room)
      if (ok.length < files.length) toast('Only image files are added (max 4 photos)', 'error')
      const urls = await Promise.all(ok.map(compress))
      setV((x) => ({ ...x, photos: [...x.photos, ...urls] }))
    } catch {
      toast('One of those images couldn’t be read', 'error')
    } finally {
      setUploading(false)
    }
  }

  const submit = () => {
    for (let s = 0; s < 3; s++) {
      const er = validate(s, v)
      if (Object.keys(er).length) {
        setErrors(er)
        setStep(s)
        return
      }
    }
    const hood = cities[v.city].hoods[v.neighborhood]
    const listing = addProperty({
      title: v.title.trim(),
      status: v.status,
      type: v.type,
      price: Number(v.price),
      city: v.city,
      state: cities[v.city].state,
      neighborhood: v.neighborhood,
      address: v.address.trim(),
      beds: Number(v.beds),
      baths: Number(v.baths),
      area: Number(v.area),
      year: Number(v.year),
      parking: Number(v.parking) || 0,
      featured: false,
      amenities: v.amenities,
      description: v.description.trim().split(/\n{2,}/),
      pos: [hood.pos[0] + (Math.random() - 0.5) * 8, hood.pos[1] + (Math.random() - 0.5) * 8],
      agentId: agentForCity(v.city).id,
      photos: v.photos,
      seed: Math.floor(Math.random() * 90000) + 1,
    })
    setCreated(listing)
    toast('Your listing is live')
  }

  if (created) {
    return (
      <div className="container-page py-16">
        <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="surface mx-auto flex max-w-lg flex-col items-center px-6 py-14 text-center">
          <CheckCircle2 size={56} className="text-spruce-500" />
          <h1 className="mt-4 text-3xl font-bold text-spruce">Your listing is live</h1>
          <p className="mt-2 text-slate">“{created.title}” now appears in search. {agentForCity(created.city).name} will handle enquiries.</p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link to={`/properties/${created.id}`} className="btn btn-primary">View listing</Link>
            <button type="button" className="btn btn-outline" onClick={() => { setV(initial); setStep(0); setCreated(null) }}>Add another</button>
          </div>
        </motion.div>
      </div>
    )
  }

  const hoods = v.city ? Object.keys(cities[v.city].hoods) : []

  return (
    <div className="container-page py-8 sm:py-10">
      <h1 className="text-3xl font-bold text-spruce sm:text-4xl">List a property</h1>
      <p className="mt-1 text-slate">Four short steps. You can review everything before publishing.</p>

      <ol className="my-8 grid grid-cols-4 gap-2 sm:gap-4" aria-label="Progress">
        {STEPS.map((s, i) => (
          <li key={s} aria-current={i === step ? 'step' : undefined}>
            <div className={`h-1.5 rounded-full transition-colors ${i <= step ? 'bg-spruce' : 'bg-spruce-100'}`} />
            <p className={`mt-2 flex items-center gap-1.5 text-xs font-semibold sm:text-sm ${i === step ? 'text-spruce' : 'text-slate'}`}>
              {i < step && <Check size={14} className="text-spruce-500" />}
              <span className="hidden sm:inline">{s}</span>
              <span className="sm:hidden">{i + 1}</span>
            </p>
          </li>
        ))}
      </ol>

      <div className="surface mx-auto max-w-3xl p-5 sm:p-8">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={step} initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -18 }} transition={{ duration: 0.18 }}>
            {step === 0 && (
              <div className="space-y-5">
                <h2 className="text-xl font-bold text-spruce">The basics</h2>
                <Field id="sp-title" label="Listing title" error={errors.title}>
                  <input id="sp-title" className={cls('title')} value={v.title} onChange={set('title')} placeholder="Sunny two-bedroom near the park" />
                </Field>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field id="sp-status" label="Listing type">
                    <select id="sp-status" className="input" value={v.status} onChange={set('status')}>
                      <option value="buy">For sale</option>
                      <option value="rent">For rent</option>
                    </select>
                  </Field>
                  <Field id="sp-type" label="Property type">
                    <select id="sp-type" className="input" value={v.type} onChange={set('type')}>
                      {PROPERTY_TYPES.map((t) => <option key={t}>{t}</option>)}
                    </select>
                  </Field>
                </div>
                <Field id="sp-price" label={v.status === 'rent' ? 'Monthly rent (USD)' : 'Asking price (USD)'} error={errors.price}>
                  <input id="sp-price" type="number" min="0" inputMode="numeric" className={cls('price')} value={v.price} onChange={set('price')} />
                </Field>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-5">
                <h2 className="text-xl font-bold text-spruce">Location and size</h2>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field id="sp-city" label="City" error={errors.city}>
                    <select id="sp-city" className={cls('city')} value={v.city} onChange={set('city')}>
                      <option value="">Select a city</option>
                      {cityNames.map((c) => <option key={c}>{c}</option>)}
                    </select>
                  </Field>
                  <Field id="sp-hood" label="Neighborhood" error={errors.neighborhood}>
                    <select id="sp-hood" className={cls('neighborhood')} value={v.neighborhood} onChange={set('neighborhood')} disabled={!v.city}>
                      <option value="">{v.city ? 'Select a neighborhood' : 'Choose a city first'}</option>
                      {hoods.map((h) => <option key={h}>{h}</option>)}
                    </select>
                  </Field>
                </div>
                <Field id="sp-address" label="Street address" error={errors.address}>
                  <input id="sp-address" className={cls('address')} value={v.address} onChange={set('address')} placeholder="214 Maple St" autoComplete="street-address" />
                </Field>
                <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
                  <Field id="sp-beds" label="Bedrooms" error={errors.beds}><input id="sp-beds" type="number" min="0" className={cls('beds')} value={v.beds} onChange={set('beds')} /></Field>
                  <Field id="sp-baths" label="Bathrooms" error={errors.baths}><input id="sp-baths" type="number" min="1" className={cls('baths')} value={v.baths} onChange={set('baths')} /></Field>
                  <Field id="sp-area" label="Area (sq ft)" error={errors.area}><input id="sp-area" type="number" min="0" className={cls('area')} value={v.area} onChange={set('area')} /></Field>
                  <Field id="sp-year" label="Year built" error={errors.year}><input id="sp-year" type="number" className={cls('year')} value={v.year} onChange={set('year')} /></Field>
                </div>
                <Field id="sp-parking" label="Parking spaces">
                  <select id="sp-parking" className="input sm:max-w-[10rem]" value={v.parking} onChange={set('parking')}>
                    {[0, 1, 2, 3, 4].map((n) => <option key={n}>{n}</option>)}
                  </select>
                </Field>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-spruce">Details and photos</h2>
                <Field id="sp-desc" label="Description" error={errors.description} hint="Separate paragraphs with a blank line.">
                  <textarea id="sp-desc" rows="6" className={cls('description')} value={v.description} onChange={set('description')} placeholder="What makes this home worth a visit?" />
                  <p className="mt-1 text-right text-xs text-slate-soft">{v.description.trim().length} characters</p>
                </Field>
                <fieldset>
                  <legend className="field-label">Amenities</legend>
                  <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                    {AMENITIES.map((a) => (
                      <label key={a} className="flex cursor-pointer items-center gap-2.5 text-sm">
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded accent-spruce"
                          checked={v.amenities.includes(a)}
                          onChange={() => setV((x) => ({ ...x, amenities: x.amenities.includes(a) ? x.amenities.filter((y) => y !== a) : [...x.amenities, a] }))}
                        />
                        {a}
                      </label>
                    ))}
                  </div>
                </fieldset>
                <div>
                  <p className="field-label">Photos <span className="font-normal text-slate">(optional, up to {MAX_PHOTOS})</span></p>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {v.photos.map((src, i) => (
                      <div key={i} className="relative aspect-[4/3] overflow-hidden rounded-xl bg-spruce-50">
                        <img src={src} alt={`Upload ${i + 1}`} className="h-full w-full object-cover" />
                        <button type="button" onClick={() => setV((x) => ({ ...x, photos: x.photos.filter((_, j) => j !== i) }))} aria-label={`Remove photo ${i + 1}`} className="absolute right-1.5 top-1.5 grid h-7 w-7 place-items-center rounded-full bg-ink/70 text-white hover:bg-ink"><X size={14} /></button>
                      </div>
                    ))}
                    {v.photos.length < MAX_PHOTOS && (
                      <label className="flex aspect-[4/3] cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-spruce/25 text-sm font-medium text-spruce transition-colors hover:bg-spruce-50">
                        <ImagePlus size={22} />
                        {uploading ? 'Adding…' : 'Add photos'}
                        <input type="file" accept="image/*" multiple className="sr-only" onChange={addPhotos} />
                      </label>
                    )}
                  </div>
                  <p className="mt-2 text-[13px] text-slate">No photos? We’ll show illustrated views of your home type instead.</p>
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <h2 className="text-xl font-bold text-spruce">Review your listing</h2>
                <dl className="mt-5 divide-y divide-spruce/10 text-sm">
                  {[
                    ['Title', v.title],
                    ['Listing', `${v.type} · ${v.status === 'rent' ? 'For rent' : 'For sale'}`],
                    ['Price', `${money(Number(v.price))}${v.status === 'rent' ? ' / month' : ''}`],
                    ['Address', `${v.address}, ${v.neighborhood}, ${v.city}`],
                    ['Size', `${v.beds} bd · ${v.baths} ba · ${Number(v.area).toLocaleString('en-US')} sq ft · built ${v.year}`],
                    ['Parking', `${v.parking} space${v.parking === '1' ? '' : 's'}`],
                    ['Amenities', v.amenities.length ? v.amenities.join(', ') : 'None selected'],
                    ['Photos', v.photos.length ? `${v.photos.length} uploaded` : 'None – illustrated views will be used'],
                  ].map(([k, val]) => (
                    <div key={k} className="grid gap-1 py-3 sm:grid-cols-[9rem_1fr]">
                      <dt className="text-slate">{k}</dt>
                      <dd className="font-medium">{val}</dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-4 rounded-xl bg-spruce-50 p-4 text-sm leading-relaxed text-slate">{v.description}</p>
                <p className="mt-4 text-xs text-slate-soft">Your listing is saved on this device for the demo and appears alongside the sample listings.</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="mt-8 flex items-center justify-between border-t border-spruce/10 pt-6">
          <button type="button" onClick={() => setStep((s) => s - 1)} disabled={step === 0} className="btn btn-ghost"><ArrowLeft size={17} /> Back</button>
          {step < 3 ? (
            <button type="button" onClick={next} className="btn btn-primary">Continue <ArrowRight size={17} /></button>
          ) : (
            <button type="button" onClick={submit} className="btn btn-accent btn-lg">Publish listing</button>
          )}
        </div>
      </div>
    </div>
  )
}
