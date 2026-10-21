export const SORTS = [
  { value: 'newest', label: 'Newest first' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
  { value: 'area-desc', label: 'Largest first' },
  { value: 'beds-desc', label: 'Most bedrooms' },
]

export const PAGE_SIZE = 9

const list = (sp, key) => (sp.get(key) || '').split(',').filter(Boolean)

export function parseFilters(sp) {
  return {
    q: sp.get('q') || '',
    status: sp.get('status') || 'all',
    types: list(sp, 'type'),
    city: sp.get('city') || '',
    min: sp.get('min') || '',
    max: sp.get('max') || '',
    beds: Number(sp.get('beds') || 0),
    baths: Number(sp.get('baths') || 0),
    amenities: list(sp, 'am'),
    sort: sp.get('sort') || 'newest',
    page: Math.max(1, Number(sp.get('page') || 1)),
  }
}

export function filtersToParams(f) {
  const sp = new URLSearchParams()
  if (f.q) sp.set('q', f.q)
  if (f.status && f.status !== 'all') sp.set('status', f.status)
  if (f.types.length) sp.set('type', f.types.join(','))
  if (f.city) sp.set('city', f.city)
  if (f.min) sp.set('min', f.min)
  if (f.max) sp.set('max', f.max)
  if (f.beds) sp.set('beds', String(f.beds))
  if (f.baths) sp.set('baths', String(f.baths))
  if (f.amenities.length) sp.set('am', f.amenities.join(','))
  if (f.sort && f.sort !== 'newest') sp.set('sort', f.sort)
  if (f.page > 1) sp.set('page', String(f.page))
  return sp
}

export function applyFilters(properties, f) {
  const tokens = f.q.toLowerCase().split(/\s+/).filter(Boolean)
  const min = f.min ? Number(f.min) : null
  const max = f.max ? Number(f.max) : null

  const out = properties.filter((p) => {
    if (f.status !== 'all' && p.status !== f.status) return false
    if (f.types.length && !f.types.includes(p.type)) return false
    if (f.city && p.city !== f.city) return false
    if (min !== null && p.price < min) return false
    if (max !== null && p.price > max) return false
    if (f.beds && p.beds < f.beds) return false
    if (f.baths && p.baths < f.baths) return false
    if (f.amenities.length && !f.amenities.every((a) => p.amenities.includes(a))) return false
    if (tokens.length) {
      const hay = `${p.title} ${p.city} ${p.neighborhood} ${p.address} ${p.type} ${p.state}`.toLowerCase()
      if (!tokens.every((t) => hay.includes(t))) return false
    }
    return true
  })

  const sorters = {
    newest: (a, b) => a.daysAgo - b.daysAgo,
    'price-asc': (a, b) => a.price - b.price,
    'price-desc': (a, b) => b.price - a.price,
    'area-desc': (a, b) => b.area - a.area,
    'beds-desc': (a, b) => b.beds - a.beds || b.area - a.area,
  }
  return out.sort(sorters[f.sort] || sorters.newest)
}
