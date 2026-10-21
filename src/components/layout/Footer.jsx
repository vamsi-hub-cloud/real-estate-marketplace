import { useState } from 'react'
import { Link } from 'react-router-dom'
import Logo from '../common/Logo'
import { cityNames } from '../../data/cities'
import { useApp } from '../../context/AppContext'

export default function Footer() {
  const { toast } = useApp()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')

  const subscribe = (e) => {
    e.preventDefault()
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError('Enter a valid email address.')
      return
    }
    setError('')
    setEmail('')
    toast('You’re subscribed to new listing alerts')
  }

  const col = 'flex flex-col gap-2.5 text-sm text-white/70'
  const head = 'mb-4 font-display text-base font-semibold text-white'

  return (
    <footer className="mt-24 bg-spruce-800 text-white">
      <div className="container-page grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.3fr]">
        <div>
          <Logo light />
          <p className="mt-4 max-w-xs text-sm text-white/70">
            Browse homes for sale and rent, compare them side by side and book a tour with an agent who knows the street.
          </p>
        </div>
        <div>
          <h3 className={head}>Explore</h3>
          <ul className={col}>
            <li><Link className="hover:text-white" to="/properties?status=buy">Homes for sale</Link></li>
            <li><Link className="hover:text-white" to="/properties?status=rent">Homes for rent</Link></li>
            <li><Link className="hover:text-white" to="/agents">Find an agent</Link></li>
            <li><Link className="hover:text-white" to="/submit">List a property</Link></li>
          </ul>
        </div>
        <div>
          <h3 className={head}>Cities</h3>
          <ul className={col}>
            {cityNames.map((c) => (
              <li key={c}><Link className="hover:text-white" to={`/properties?city=${encodeURIComponent(c)}`}>{c}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className={head}>New listings in your inbox</h3>
          <form onSubmit={subscribe} noValidate>
            <label htmlFor="footer-email" className="sr-only">Email address</label>
            <div className="flex gap-2">
              <input
                id="footer-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-white/15 bg-white/10 px-3.5 py-2.5 text-sm text-white placeholder:text-white/50 focus:border-marigold focus:outline-none"
                aria-invalid={Boolean(error)}
              />
              <button type="submit" className="btn btn-accent shrink-0">Subscribe</button>
            </div>
            {error && <p className="mt-2 text-[13px] text-marigold">{error}</p>}
          </form>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-page flex flex-col gap-2 py-5 text-[13px] text-white/60 sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} Keystead. Sample listings for demonstration.</p>
          <p>Prices in USD. Illustrations are generated, not photographs.</p>
        </div>
      </div>
    </footer>
  )
}
