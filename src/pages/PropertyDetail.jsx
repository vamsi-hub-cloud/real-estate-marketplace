import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Bath, BedDouble, Calendar, Car, ChevronRight, Home, Mail, MapPin, Maximize2, Phone, Share2, Star } from 'lucide-react'
import Gallery from '../components/property/Gallery'
import NeighborhoodMap from '../components/property/NeighborhoodMap'
import MortgageCalculator from '../components/property/MortgageCalculator'
import ContactForm from '../components/property/ContactForm'
import PropertyCard from '../components/property/PropertyCard'
import WishlistButton from '../components/common/WishlistButton'
import CompareButton from '../components/common/CompareButton'
import AgentAvatar from '../components/common/AgentAvatar'
import EmptyState from '../components/common/EmptyState'
import Button from '../components/common/Button'
import { iconFor } from '../components/property/amenityIcons'
import { useApp } from '../context/AppContext'
import { agents, getAgent } from '../data/agents'
import { money, number, postedLabel, priceLabel } from '../utils/format'
import { useTitle } from '../hooks/useTitle'

function Section({ title, children, id }) {
  return (
    <section id={id} className="border-t border-spruce/10 pt-8">
      <h2 className="mb-5 text-2xl font-bold text-spruce">{title}</h2>
      {children}
    </section>
  )
}

export default function PropertyDetail() {
  const { id } = useParams()
  const { getProperty, properties, toast } = useApp()
  const property = getProperty(id)
  useTitle(property?.title)

  const similar = useMemo(() => {
    if (!property) return []
    return properties
      .filter((p) => p.id !== property.id)
      .map((p) => ({
        p,
        score: (p.city === property.city ? 3 : 0) + (p.type === property.type ? 2 : 0) + (p.status === property.status ? 2 : 0) - Math.min(2, Math.abs(p.price - property.price) / property.price),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map((x) => x.p)
  }, [properties, property])

  if (!property) {
    return (
      <div className="container-page py-20">
        <EmptyState icon={Home} title="That listing isn’t available" action={<Button to="/properties">Browse all homes</Button>}>
          It may have been removed or the link is out of date.
        </EmptyState>
      </div>
    )
  }

  const agent = getAgent(property.agentId) || agents[0]
  const isRent = property.status === 'rent'

  const share = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      toast('Link copied to clipboard')
    } catch {
      toast('Couldn’t copy the link. Copy it from the address bar instead.', 'error')
    }
  }

  const facts = [
    [BedDouble, `${property.beds}`, property.beds === 1 ? 'Bedroom' : 'Bedrooms'],
    [Bath, `${property.baths}`, property.baths === 1 ? 'Bathroom' : 'Bathrooms'],
    [Maximize2, number(property.area), 'sq ft'],
    [Car, `${property.parking}`, 'Parking'],
    [Calendar, `${property.year}`, 'Year built'],
  ]

  const details = [
    ['Property type', property.type],
    ['Status', isRent ? 'For rent' : 'For sale'],
    ['Year built', property.year],
    ['Living area', `${number(property.area)} sq ft`],
    [isRent ? 'Rent per sq ft' : 'Price per sq ft', `$${(property.price / property.area).toFixed(isRent ? 2 : 0)}`],
    ['Parking spaces', property.parking],
    ['Listing ID', `KS-${String(property.id).replace('u-', '').slice(-6).padStart(4, '0')}`],
    ['Listed', postedLabel(property.daysAgo).replace('Listed ', '')],
  ]

  return (
    <div className="container-page py-6 sm:py-8">
      <nav aria-label="Breadcrumb" className="mb-5 flex flex-wrap items-center gap-1.5 text-sm text-slate">
        <Link to="/" className="hover:text-spruce">Home</Link><ChevronRight size={14} />
        <Link to={`/properties?status=${property.status}`} className="hover:text-spruce">{isRent ? 'Rent' : 'Buy'}</Link><ChevronRight size={14} />
        <Link to={`/properties?city=${encodeURIComponent(property.city)}`} className="hover:text-spruce">{property.city}</Link><ChevronRight size={14} />
        <span className="text-ink">{property.neighborhood}</span>
      </nav>

      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${isRent ? 'bg-marigold text-ink' : 'bg-spruce text-white'}`}>{isRent ? 'For rent' : 'For sale'}</span>
            <span className="text-sm text-slate">{property.type} · {postedLabel(property.daysAgo)}</span>
          </div>
          <h1 className="max-w-3xl text-3xl font-bold leading-tight text-spruce sm:text-4xl">{property.title}</h1>
          <p className="mt-2 flex items-center gap-1.5 text-slate"><MapPin size={17} className="text-spruce-500" />{property.address}, {property.neighborhood}, {property.city}, {property.state}</p>
        </div>
        <div className="flex items-center gap-2">
          <WishlistButton id={property.id} label className="border border-spruce/15" />
          <CompareButton id={property.id} label className="border border-spruce/15" />
          <button type="button" onClick={share} aria-label="Copy link" className="grid h-10 w-10 place-items-center rounded-full border border-spruce/15 bg-white/95 text-spruce shadow-card hover:bg-white"><Share2 size={18} /></button>
        </div>
      </div>

      <div className="grid items-start gap-10 lg:grid-cols-[1fr_22rem] xl:grid-cols-[1fr_24rem]">
        <div className="min-w-0 space-y-10">
          <Gallery key={property.id} property={property} />

          <dl className="grid grid-cols-2 gap-3 sm:grid-cols-5">
            {facts.map(([Icon, value, label]) => (
              <div key={label} className="surface flex flex-col items-center px-3 py-4 text-center">
                <Icon size={20} className="text-spruce-500" />
                <dd className="mt-2 font-display text-xl font-bold text-spruce">{value}</dd>
                <dt className="text-[13px] text-slate">{label}</dt>
              </div>
            ))}
          </dl>

          <Section title="About this home">
            <div className="max-w-3xl space-y-4 leading-relaxed text-slate">
              {property.description.map((para, i) => <p key={i}>{para}</p>)}
            </div>
          </Section>

          <Section title="Amenities">
            <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {property.amenities.map((a) => {
                const Icon = iconFor(a)
                return (
                  <li key={a} className="flex items-center gap-3 rounded-xl border border-spruce/10 bg-white px-4 py-3">
                    <span className="grid h-9 w-9 place-items-center rounded-lg bg-spruce-50 text-spruce-500"><Icon size={18} /></span>
                    <span className="text-sm font-medium">{a}</span>
                  </li>
                )
              })}
            </ul>
          </Section>

          <Section title="Property details">
            <dl className="grid gap-x-10 sm:grid-cols-2">
              {details.map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4 border-b border-spruce/10 py-3 text-sm">
                  <dt className="text-slate">{k}</dt>
                  <dd className="font-semibold">{v}</dd>
                </div>
              ))}
            </dl>
          </Section>

          <Section title="Location">
            <NeighborhoodMap property={property} />
          </Section>

          <Section title={isRent ? 'Move-in costs' : 'Monthly payment estimate'}>
            {isRent ? (
              <div className="surface p-5 sm:p-6">
                <ul className="divide-y divide-spruce/10 text-sm">
                  {[['First month’s rent', property.price], ['Security deposit (one month)', property.price], ['Application fee', 50]].map(([k, v]) => (
                    <li key={k} className="flex justify-between py-3"><span className="text-slate">{k}</span><span className="font-semibold">{money(v)}</span></li>
                  ))}
                  <li className="flex justify-between pt-4 text-base"><span className="font-semibold">Due at signing</span><span className="font-display text-2xl font-bold text-spruce">{money(property.price * 2 + 50)}</span></li>
                </ul>
                <p className="mt-4 text-xs text-slate-soft">Typical terms. The landlord confirms the final amounts before you sign.</p>
              </div>
            ) : (
              <MortgageCalculator price={property.price} />
            )}
          </Section>
        </div>

        <aside className="space-y-5 lg:sticky lg:top-24">
          <div className="surface p-5 sm:p-6">
            <p className="text-sm text-slate">{isRent ? 'Monthly rent' : 'Asking price'}</p>
            <p className="font-display text-4xl font-extrabold text-spruce">{priceLabel(property)}</p>
            <div className="mt-5 flex items-center gap-3 border-t border-spruce/10 pt-5">
              <AgentAvatar agent={agent} size={52} />
              <div className="min-w-0">
                <Link to={`/agents/${agent.id}`} className="block truncate font-display text-lg font-bold text-spruce hover:text-spruce-500">{agent.name}</Link>
                <p className="flex items-center gap-1 text-[13px] text-slate"><Star size={13} className="fill-marigold text-marigold" /> {agent.rating} · {agent.reviews} reviews</p>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <a href={`tel:${agent.phone.replace(/[^\d+]/g, '')}`} className="btn btn-outline btn-sm flex-1"><Phone size={15} /> Call</a>
              <a href={`mailto:${agent.email}?subject=${encodeURIComponent(property.title)}`} className="btn btn-outline btn-sm flex-1"><Mail size={15} /> Email</a>
            </div>
          </div>

          <div id="contact" className="surface scroll-mt-24 p-5 sm:p-6">
            <h2 className="mb-4 text-xl font-bold text-spruce">Book a tour</h2>
            <ContactForm property={property} agent={agent} />
          </div>
        </aside>
      </div>

      {similar.length > 0 && (
        <section className="mt-16 border-t border-spruce/10 pt-10">
          <h2 className="mb-6 text-2xl font-bold text-spruce">Similar homes</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {similar.map((p) => <PropertyCard key={p.id} property={p} />)}
          </div>
        </section>
      )}
    </div>
  )
}
