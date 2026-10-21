import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { LayoutGrid, List, Search, SearchX, SlidersHorizontal, X } from 'lucide-react'
import FilterPanel from '../components/property/FilterPanel'
import PropertyCard from '../components/property/PropertyCard'
import Pagination from '../components/common/Pagination'
import EmptyState from '../components/common/EmptyState'
import { useApp } from '../context/AppContext'
import { PAGE_SIZE, SORTS, applyFilters, filtersToParams, parseFilters } from '../utils/filters'
import { useTitle } from '../hooks/useTitle'
import { compact, plural } from '../utils/format'

const DEFAULTS = { q: '', status: 'all', types: [], city: '', min: '', max: '', beds: 0, baths: 0, amenities: [], sort: 'newest', page: 1 }

export default function Listings() {
  const { properties } = useApp()
  const [sp, setSp] = useSearchParams()
  const filters = useMemo(() => parseFilters(sp), [sp])
  const [view, setView] = useState('grid')
  const [drawer, setDrawer] = useState(false)
  const [text, setText] = useState(filters.q)
  const resultsRef = useRef(null)

  useTitle('Browse homes')

  const update = useCallback(
    (patch) => setSp(filtersToParams({ ...filters, page: 1, ...patch }), { replace: true }),
    [filters, setSp],
  )

  // Keep the search box in sync with the URL, and push typing to the URL after a short pause.
  useEffect(() => setText(filters.q), [filters.q])
  useEffect(() => {
    if (text === filters.q) return undefined
    const t = setTimeout(() => update({ q: text }), 300)
    return () => clearTimeout(t)
  }, [text, filters.q, update])

  useEffect(() => {
    document.body.style.overflow = drawer ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [drawer])

  const results = useMemo(() => applyFilters(properties, filters), [properties, filters])
  const pages = Math.max(1, Math.ceil(results.length / PAGE_SIZE))
  const page = Math.min(filters.page, pages)
  const slice = results.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const goToPage = (n) => {
    setSp(filtersToParams({ ...filters, page: n }), { replace: false })
    resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const chips = []
  if (filters.status !== 'all') chips.push([filters.status === 'buy' ? 'For sale' : 'For rent', { status: 'all', min: '', max: '' }])
  filters.types.forEach((t) => chips.push([t, { types: filters.types.filter((x) => x !== t) }]))
  if (filters.city) chips.push([filters.city, { city: '' }])
  if (filters.min || filters.max) {
    const lo = filters.min ? compact(Number(filters.min)) : null
    const hi = filters.max ? compact(Number(filters.max)) : null
    chips.push([lo && hi ? `${lo} – ${hi}` : lo ? `From ${lo}` : `Up to ${hi}`, { min: '', max: '' }])
  }
  if (filters.beds) chips.push([`${filters.beds}+ beds`, { beds: 0 }])
  if (filters.baths) chips.push([`${filters.baths}+ baths`, { baths: 0 }])
  filters.amenities.forEach((a) => chips.push([a, { amenities: filters.amenities.filter((x) => x !== a) }]))
  if (filters.q) chips.push([`“${filters.q}”`, { q: '' }])

  const reset = () => setSp(filtersToParams({ ...DEFAULTS, sort: filters.sort }), { replace: true })

  const heading =
    filters.status === 'buy' ? 'Homes for sale' : filters.status === 'rent' ? 'Homes for rent' : 'All homes'

  return (
    <div className="container-page py-8 sm:py-10">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-spruce sm:text-4xl">{filters.city ? `${heading} in ${filters.city}` : heading}</h1>
          <p className="mt-1 text-slate" aria-live="polite">{plural(results.length, 'home')} match your search</p>
        </div>
      </div>

      <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <label htmlFor="q" className="sr-only">Search homes</label>
          <Search size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-soft" />
          <input
            id="q"
            type="search"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Search by neighborhood, street, city or title"
            className="input h-12 pl-10"
          />
        </div>
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => setDrawer(true)} className="btn btn-outline h-12 flex-1 lg:hidden">
            <SlidersHorizontal size={17} /> Filters{chips.length ? ` (${chips.length})` : ''}
          </button>
          <div className="flex-1 lg:flex-none">
            <label htmlFor="sort" className="sr-only">Sort by</label>
            <select id="sort" className="input h-12 lg:w-52" value={filters.sort} onChange={(e) => update({ sort: e.target.value })}>
              {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
          <div className="hidden rounded-xl border border-spruce/20 bg-white p-1 sm:flex" role="group" aria-label="Layout">
            {[['grid', LayoutGrid, 'Grid view'], ['list', List, 'List view']].map(([v, Icon, label]) => (
              <button
                key={v}
                type="button"
                onClick={() => setView(v)}
                aria-label={label}
                aria-pressed={view === v}
                className={`grid h-10 w-10 place-items-center rounded-lg transition-colors ${view === v ? 'bg-spruce text-white' : 'text-spruce hover:bg-spruce-50'}`}
              >
                <Icon size={18} />
              </button>
            ))}
          </div>
        </div>
      </div>

      {chips.length > 0 && (
        <div className="mb-5 flex flex-wrap items-center gap-2">
          {chips.map(([label, patch]) => (
            <button key={label} type="button" onClick={() => update(patch)} className="chip hover:bg-spruce-50" aria-label={`Remove filter ${label}`}>
              {label} <X size={14} />
            </button>
          ))}
          <button type="button" onClick={reset} className="ml-1 text-sm font-semibold text-spruce-500 hover:text-spruce">Clear all</button>
        </div>
      )}

      <div className="grid items-start gap-8 lg:grid-cols-[18.5rem_1fr]">
        <aside className="surface sticky top-24 hidden max-h-[calc(100vh-7rem)] overflow-y-auto p-5 lg:block" aria-label="Filters">
          <FilterPanel filters={filters} onChange={update} onReset={reset} idPrefix="d" />
        </aside>

        <section ref={resultsRef} className="scroll-mt-24" aria-label="Search results">
          {slice.length === 0 ? (
            <EmptyState
              icon={SearchX}
              title="No homes match those filters"
              action={<button type="button" onClick={reset} className="btn btn-primary">Clear all filters</button>}
            >
              Try widening your price range, removing an amenity or choosing a different city.
            </EmptyState>
          ) : (
            <>
              <motion.div
                key={`${page}-${filters.sort}-${results.length}`}
                className={view === 'list' ? 'grid gap-5' : 'grid gap-6 sm:grid-cols-2 xl:grid-cols-3'}
              >
                {slice.map((p) => <PropertyCard key={p.id} property={p} layout={view} />)}
              </motion.div>
              <p className="mt-8 text-center text-sm text-slate">
                Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, results.length)} of {results.length}
              </p>
              <Pagination page={page} pages={pages} onChange={goToPage} />
            </>
          )}
        </section>
      </div>

      <AnimatePresence>
        {drawer && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] bg-ink/50 lg:hidden"
              onClick={() => setDrawer(false)}
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.25 }}
              className="fixed inset-y-0 left-0 z-[70] flex w-[88%] max-w-sm flex-col bg-white lg:hidden"
              role="dialog"
              aria-modal="true"
              aria-label="Filters"
            >
              <div className="flex items-center justify-between border-b border-spruce/10 px-5 py-4">
                <h2 className="text-xl font-bold text-spruce">Filters</h2>
                <button type="button" onClick={() => setDrawer(false)} aria-label="Close filters" className="grid h-9 w-9 place-items-center rounded-full hover:bg-spruce-50"><X size={20} /></button>
              </div>
              <div className="flex-1 overflow-y-auto px-5 py-5">
                <FilterPanel filters={filters} onChange={update} onReset={reset} idPrefix="m" />
              </div>
              <div className="border-t border-spruce/10 p-4">
                <button type="button" onClick={() => setDrawer(false)} className="btn btn-primary w-full">Show {plural(results.length, 'home')}</button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
