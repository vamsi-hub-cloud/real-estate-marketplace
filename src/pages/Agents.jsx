import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Star } from 'lucide-react'
import AgentAvatar from '../components/common/AgentAvatar'
import EmptyState from '../components/common/EmptyState'
import { useApp } from '../context/AppContext'
import { agents } from '../data/agents'
import { cityNames } from '../data/cities'
import { useTitle } from '../hooks/useTitle'

export default function Agents() {
  const { properties } = useApp()
  const [q, setQ] = useState('')
  const [city, setCity] = useState('')
  useTitle('Agents')

  const list = useMemo(() => {
    const t = q.trim().toLowerCase()
    return agents.filter(
      (a) => (!city || a.city === city) && (!t || `${a.name} ${a.title} ${a.specialties.join(' ')} ${a.languages.join(' ')}`.toLowerCase().includes(t)),
    )
  }, [q, city])

  return (
    <div className="container-page py-8 sm:py-10">
      <h1 className="text-3xl font-bold text-spruce sm:text-4xl">Our agents</h1>
      <p className="mt-1 max-w-xl text-slate">Each agent works one city and knows its streets, schools and sale prices.</p>

      <div className="my-7 grid gap-3 sm:grid-cols-[1fr_14rem]">
        <div className="relative">
          <label htmlFor="agent-q" className="sr-only">Search agents</label>
          <Search size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-soft" />
          <input id="agent-q" className="input h-12 pl-10" placeholder="Search by name, specialty or language" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <div>
          <label htmlFor="agent-city" className="sr-only">City</label>
          <select id="agent-city" className="input h-12" value={city} onChange={(e) => setCity(e.target.value)}>
            <option value="">All cities</option>
            {cityNames.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {list.length === 0 ? (
        <EmptyState title="No agents match that search">Try a different name, language or city.</EmptyState>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((a) => {
            const count = properties.filter((p) => p.agentId === a.id).length
            return (
              <Link key={a.id} to={`/agents/${a.id}`} className="surface group flex flex-col p-6 transition-shadow hover:shadow-lift">
                <div className="flex items-center gap-4">
                  <AgentAvatar agent={a} size={64} />
                  <div className="min-w-0">
                    <p className="truncate font-display text-xl font-bold text-spruce">{a.name}</p>
                    <p className="text-sm text-slate">{a.title}</p>
                    <p className="mt-0.5 flex items-center gap-1 text-sm font-semibold"><Star size={14} className="fill-marigold text-marigold" /> {a.rating} <span className="font-normal text-slate">({a.reviews})</span></p>
                  </div>
                </div>
                <p className="mt-4 line-clamp-3 text-sm text-slate">{a.bio}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {a.specialties.map((s) => <span key={s} className="chip">{s}</span>)}
                </div>
                <p className="mt-5 border-t border-spruce/10 pt-4 text-sm text-slate">{a.city} · {count} active {count === 1 ? 'listing' : 'listings'} · {a.years} yrs experience</p>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
