import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Building2, Star } from 'lucide-react'
import HeroScene from '../components/property/HeroScene'
import HeroSearch from '../components/property/HeroSearch'
import PropertyCard from '../components/property/PropertyCard'
import PropertyArt from '../components/common/PropertyArt'
import SectionHeading from '../components/common/SectionHeading'
import AgentAvatar from '../components/common/AgentAvatar'
import Button from '../components/common/Button'
import { useApp } from '../context/AppContext'
import { agents } from '../data/agents'
import { cities, cityNames } from '../data/cities'
import { PROPERTY_TYPES } from '../data/properties'
import { HERO_IMAGE, TYPE_IMAGES } from '../data/photos'
import { compact } from '../utils/format'
import { useTitle } from '../hooks/useTitle'

function TypeTile({ type, count, seed }) {
  const [failed, setFailed] = useState(false)
  const cls = 'h-full w-full object-cover transition-transform duration-500 group-hover:scale-105'
  return (
    <Link
      to={`/properties?type=${type}`}
      className="group relative aspect-[4/5] overflow-hidden rounded-xl2 bg-spruce-50 shadow-card"
    >
      {TYPE_IMAGES[type] && !failed ? (
        <img src={TYPE_IMAGES[type]} alt={`${type} exterior`} className={cls} loading="lazy" onError={() => setFailed(true)} />
      ) : (
        <PropertyArt type={type} seed={seed} className={cls} />
      )}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-spruce-900/90 via-spruce-900/50 to-transparent p-4 pt-16 text-white">
        <p className="font-display text-xl font-bold">{type === 'Apartment' ? 'Apartments' : `${type}s`}</p>
        <p className="text-sm text-white/80">{count} listings</p>
      </div>
    </Link>
  )
}

export default function Home() {
  useTitle('')
  const { properties } = useApp()

  const stats = useMemo(
    () => [
      { label: 'Homes for sale', value: properties.filter((p) => p.status === 'buy').length },
      { label: 'Homes for rent', value: properties.filter((p) => p.status === 'rent').length },
      { label: 'Cities covered', value: cityNames.length },
      { label: 'Local agents', value: agents.length },
    ],
    [properties],
  )
  const featured = useMemo(() => properties.filter((p) => p.featured).slice(0, 6), [properties])
  const byType = useMemo(
    () => PROPERTY_TYPES.map((t) => ({ type: t, items: properties.filter((p) => p.type === t) })),
    [properties],
  )
  const byCity = useMemo(
    () =>
      cityNames.map((c) => {
        const items = properties.filter((p) => p.city === c)
        const prices = items.filter((p) => p.status === 'buy').map((p) => p.price)
        return { city: c, count: items.length, from: prices.length ? Math.min(...prices) : null }
      }),
    [properties],
  )

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-spruce text-white">
        <img src={HERO_IMAGE} alt="" className="absolute inset-0 h-full w-full object-cover" fetchPriority="high" onError={(e) => { e.currentTarget.style.display = 'none' }} />
        <div className="absolute inset-0 bg-gradient-to-b from-spruce-900/90 via-spruce-800/80 to-spruce-800/70 sm:bg-gradient-to-r sm:from-spruce-900/95 sm:via-spruce-800/80 sm:to-spruce-800/35" aria-hidden="true" />
        <div className="container-page relative z-10 pb-16 pt-14 sm:pb-20 sm:pt-20 lg:pb-24 lg:pt-24">
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl font-display text-4xl font-extrabold leading-[1.05] sm:text-6xl"
          >
            Homes worth turning the lights on for.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-5 max-w-xl text-lg text-white/80"
          >
            Search {properties.length} homes across {cityNames.length} cities, compare your favorites side by side and book a tour with the agent who knows the street.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-9"
          >
            <HeroSearch />
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="container-page -mt-px">
        <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-b-2xl border border-t-0 border-spruce/10 bg-spruce/10 sm:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="bg-white px-5 py-5 text-center">
              <dd className="font-display text-3xl font-bold text-spruce">{s.value}</dd>
              <dt className="mt-0.5 text-sm text-slate">{s.label}</dt>
            </div>
          ))}
        </dl>
      </section>

      {/* Featured */}
      <section className="container-page mt-20">
        <SectionHeading title="Featured homes" subtitle="Hand-picked by our agents this month." to="/properties" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((p) => <PropertyCard key={p.id} property={p} />)}
        </div>
      </section>

      {/* Types */}
      <section className="container-page mt-24">
        <SectionHeading title="Browse by type" subtitle="From a studio loft to a villa with a pool." />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {byType.map(({ type, items }) => (
            <TypeTile key={type} type={type} count={items.length} seed={items[0]?.seed ?? 3} />
          ))}
        </div>
      </section>

      {/* Cities */}
      <section className="container-page mt-24">
        <SectionHeading title="Explore by city" subtitle="Every city has its own local agent." />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {byCity.map(({ city, count, from }) => (
            <Link
              key={city}
              to={`/properties?city=${encodeURIComponent(city)}`}
              className="surface group flex items-center justify-between gap-4 p-5 transition-shadow hover:shadow-lift"
            >
              <div className="flex items-center gap-4">
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-spruce-50 text-spruce-500"><Building2 size={22} /></div>
                <div>
                  <p className="font-display text-xl font-bold text-spruce">{city}, {cities[city].state}</p>
                  <p className="text-sm text-slate">{count} homes{from ? ` · buy from ${compact(from)}` : ''}</p>
                </div>
              </div>
              <ArrowRight size={18} className="text-spruce-500 transition-transform group-hover:translate-x-1" />
            </Link>
          ))}
        </div>
      </section>

      {/* Agents */}
      <section className="container-page mt-24">
        <SectionHeading title="Meet the agents" subtitle="Local experts who answer the phone." to="/agents" linkLabel="All agents" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {agents.slice(0, 4).map((a) => (
            <Link key={a.id} to={`/agents/${a.id}`} className="surface group flex flex-col items-center p-6 text-center transition-shadow hover:shadow-lift">
              <AgentAvatar agent={a} size={72} />
              <p className="mt-4 font-display text-lg font-bold text-spruce">{a.name}</p>
              <p className="text-sm text-slate">{a.title} · {a.city}</p>
              <p className="mt-3 flex items-center gap-1.5 text-sm font-semibold">
                <Star size={15} className="fill-marigold text-marigold" /> {a.rating}
                <span className="font-normal text-slate">({a.reviews} reviews)</span>
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container-page mt-24">
        <div className="relative overflow-hidden rounded-xl2 bg-spruce px-6 py-12 text-white sm:px-12 sm:py-16">
          <div className="relative z-10 max-w-xl">
            <h2 className="text-3xl font-bold sm:text-4xl">Have a place to sell or rent out?</h2>
            <p className="mt-3 text-white/80">Add your listing in four short steps. It appears in search right away, and your local agent can follow up with enquiries.</p>
            <Button to="/submit" variant="accent" size="lg" className="mt-7">List your property <ArrowRight size={18} /></Button>
          </div>
          <HeroScene className="pointer-events-none absolute -bottom-2 right-0 hidden h-full w-[45%] opacity-50 md:block" />
        </div>
      </section>
    </>
  )
}
