import { Link, useParams } from 'react-router-dom'
import { ChevronRight, Languages, Mail, MapPin, Phone, Star, UserX } from 'lucide-react'
import AgentAvatar from '../components/common/AgentAvatar'
import PropertyCard from '../components/property/PropertyCard'
import EmptyState from '../components/common/EmptyState'
import Button from '../components/common/Button'
import { useApp } from '../context/AppContext'
import { getAgent } from '../data/agents'
import { useTitle } from '../hooks/useTitle'
import { useState } from 'react'

function MessageForm({ agent }) {
  const { toast } = useApp()
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [errors, setErrors] = useState({})

  const submit = (e) => {
    e.preventDefault()
    const er = {}
    if (!/^\S+@\S+\.\S+$/.test(email)) er.email = 'Enter a valid email address.'
    if (message.trim().length < 10) er.message = 'Write at least 10 characters.'
    setErrors(er)
    if (Object.keys(er).length) return
    toast(`Message sent to ${agent.name}`)
    setEmail('')
    setMessage('')
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-4">
      <div>
        <label htmlFor="am-email" className="field-label">Your email</label>
        <input id="am-email" type="email" className={errors.email ? 'input input-error' : 'input'} value={email} onChange={(e) => setEmail(e.target.value)} />
        {errors.email && <p className="field-error">{errors.email}</p>}
      </div>
      <div>
        <label htmlFor="am-msg" className="field-label">How can {agent.name.split(' ')[0]} help?</label>
        <textarea id="am-msg" rows="4" className={errors.message ? 'input input-error' : 'input'} value={message} onChange={(e) => setMessage(e.target.value)} />
        {errors.message && <p className="field-error">{errors.message}</p>}
      </div>
      <button type="submit" className="btn btn-primary w-full">Send message</button>
    </form>
  )
}

export default function AgentProfile() {
  const { id } = useParams()
  const { properties } = useApp()
  const agent = getAgent(id)
  useTitle(agent?.name)

  if (!agent) {
    return (
      <div className="container-page py-20">
        <EmptyState icon={UserX} title="We couldn’t find that agent" action={<Button to="/agents">See all agents</Button>}>
          The profile may have moved.
        </EmptyState>
      </div>
    )
  }

  const listings = properties.filter((p) => p.agentId === agent.id)
  const stats = [
    [agent.years, 'Years in the business'],
    [agent.sold, 'Homes sold'],
    [agent.rating, `From ${agent.reviews} reviews`],
    [listings.length, 'Active listings'],
  ]

  return (
    <div className="container-page py-6 sm:py-8">
      <nav aria-label="Breadcrumb" className="mb-5 flex items-center gap-1.5 text-sm text-slate">
        <Link to="/agents" className="hover:text-spruce">Agents</Link><ChevronRight size={14} /><span className="text-ink">{agent.name}</span>
      </nav>

      <div className="grid items-start gap-8 lg:grid-cols-[1fr_22rem]">
        <div className="min-w-0 space-y-10">
          <section className="surface p-6 sm:p-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <AgentAvatar agent={agent} size={96} />
              <div>
                <h1 className="text-3xl font-bold text-spruce sm:text-4xl">{agent.name}</h1>
                <p className="mt-1 text-slate">{agent.title}</p>
                <p className="mt-2 flex items-center gap-1.5 text-sm text-slate"><MapPin size={15} className="text-spruce-500" /> Serving {agent.city}</p>
              </div>
            </div>
            <p className="mt-6 max-w-2xl leading-relaxed text-slate">{agent.bio}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {agent.specialties.map((s) => <span key={s} className="chip">{s}</span>)}
              <span className="chip"><Languages size={14} /> {agent.languages.join(', ')}</span>
            </div>
            <dl className="mt-7 grid grid-cols-2 gap-px overflow-hidden rounded-xl bg-spruce/10 sm:grid-cols-4">
              {stats.map(([v, l]) => (
                <div key={l} className="bg-white px-4 py-4">
                  <dd className="flex items-center gap-1.5 font-display text-2xl font-bold text-spruce">{v}{l.startsWith('From') && <Star size={17} className="fill-marigold text-marigold" />}</dd>
                  <dt className="text-[13px] text-slate">{l}</dt>
                </div>
              ))}
            </dl>
          </section>

          <section>
            <h2 className="mb-5 text-2xl font-bold text-spruce">Listings by {agent.name.split(' ')[0]}</h2>
            {listings.length ? (
              <div className="grid gap-6 sm:grid-cols-2">
                {listings.map((p) => <PropertyCard key={p.id} property={p} />)}
              </div>
            ) : (
              <EmptyState title="No active listings">New homes appear here as soon as they’re listed.</EmptyState>
            )}
          </section>
        </div>

        <aside className="space-y-5 lg:sticky lg:top-24">
          <div className="surface p-6">
            <h2 className="mb-4 text-xl font-bold text-spruce">Contact {agent.name.split(' ')[0]}</h2>
            <div className="mb-5 flex gap-2">
              <a href={`tel:${agent.phone.replace(/[^\d+]/g, '')}`} className="btn btn-outline btn-sm flex-1"><Phone size={15} /> {agent.phone}</a>
            </div>
            <a href={`mailto:${agent.email}`} className="mb-5 flex items-center gap-2 text-sm text-spruce-500 hover:text-spruce"><Mail size={15} /> {agent.email}</a>
            <MessageForm agent={agent} />
          </div>
        </aside>
      </div>
    </div>
  )
}
