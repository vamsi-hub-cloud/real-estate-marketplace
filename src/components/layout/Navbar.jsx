import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeftRight, Heart, LogOut, Menu, PlusCircle, X, Home, UserRound } from 'lucide-react'
import Logo from '../common/Logo'
import { useApp } from '../../context/AppContext'

const links = [
  { to: '/properties?status=buy', label: 'Buy', match: (s) => s.get('status') === 'buy' },
  { to: '/properties?status=rent', label: 'Rent', match: (s) => s.get('status') === 'rent' },
  { to: '/properties', label: 'All homes', match: (s) => !s.get('status') },
  { to: '/agents', label: 'Agents' },
]

function Badge({ n }) {
  if (!n) return null
  return (
    <span className="absolute -right-1 -top-1 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-marigold px-1 text-[11px] font-bold text-ink">{n}</span>
  )
}

export default function Navbar() {
  const { wishlist, compare, user, logout } = useApp()
  const [open, setOpen] = useState(false)
  const [menu, setMenu] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const menuRef = useRef(null)
  const search = new URLSearchParams(location.search)

  useEffect(() => {
    setOpen(false)
    setMenu(false)
  }, [location.pathname, location.search])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const close = (e) => menuRef.current && !menuRef.current.contains(e.target) && setMenu(false)
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])

  const isActive = (l) => {
    if (l.label === 'Agents') return location.pathname.startsWith('/agents')
    if (location.pathname !== '/properties') return false
    return l.match(search)
  }

  const linkCls = (active) =>
    `rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${active ? 'bg-spruce-50 text-spruce' : 'text-slate hover:bg-spruce-50 hover:text-spruce'}`

  return (
    <header className={`sticky top-0 z-50 border-b transition-all ${scrolled ? 'border-spruce/10 bg-white/90 shadow-sm backdrop-blur' : 'border-transparent bg-chalk'}`}>
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-8">
          <Logo />
          <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
            {links.map((l) => (
              <Link key={l.label} to={l.to} className={linkCls(isActive(l))}>{l.label}</Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <Link to="/compare" className="relative grid h-10 w-10 place-items-center rounded-full text-spruce hover:bg-spruce-50" aria-label={`Compare list, ${compare.length} items`}>
            <ArrowLeftRight size={20} />
            <Badge n={compare.length} />
          </Link>
          <Link to="/wishlist" className="relative grid h-10 w-10 place-items-center rounded-full text-spruce hover:bg-spruce-50" aria-label={`Wishlist, ${wishlist.length} items`}>
            <Heart size={20} />
            <Badge n={wishlist.length} />
          </Link>
          <Link to="/submit" className="btn btn-accent btn-sm ml-1 hidden lg:inline-flex">
            <PlusCircle size={16} /> List a property
          </Link>

          {user ? (
            <div className="relative hidden md:block" ref={menuRef}>
              <button
                type="button"
                onClick={() => setMenu((m) => !m)}
                aria-haspopup="menu"
                aria-expanded={menu}
                className="grid h-10 w-10 place-items-center rounded-full bg-spruce font-display text-sm font-bold text-white"
              >
                {user.name.slice(0, 1).toUpperCase()}
              </button>
              <AnimatePresence>
                {menu && (
                  <motion.div
                    initial={{ opacity: 0, y: -6, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.97 }}
                    transition={{ duration: 0.14 }}
                    role="menu"
                    className="surface absolute right-0 mt-2 w-60 p-2"
                  >
                    <div className="border-b border-spruce/10 px-3 pb-2 pt-1">
                      <p className="truncate text-sm font-semibold">{user.name}</p>
                      <p className="truncate text-xs text-slate">{user.email}</p>
                    </div>
                    <Link role="menuitem" to="/my-listings" className="mt-1 flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-spruce-50"><Home size={16} /> My listings</Link>
                    <Link role="menuitem" to="/wishlist" className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-spruce-50"><Heart size={16} /> Wishlist</Link>
                    <button
                      role="menuitem"
                      type="button"
                      onClick={() => { logout(); navigate('/') }}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-spruce-50"
                    >
                      <LogOut size={16} /> Sign out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="hidden items-center gap-1 md:flex">
              <Link to="/login" className="btn btn-ghost btn-sm">Sign in</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Create account</Link>
            </div>
          )}

          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="grid h-10 w-10 place-items-center rounded-full text-spruce hover:bg-spruce-50 md:hidden"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-spruce/10 bg-white md:hidden"
            aria-label="Mobile"
          >
            <div className="container-page flex flex-col gap-1 py-4">
              {links.map((l) => (
                <Link key={l.label} to={l.to} className={`${linkCls(isActive(l))} py-3 text-base`}>{l.label}</Link>
              ))}
              <Link to="/submit" className="rounded-lg px-3 py-3 text-base font-semibold text-slate hover:bg-spruce-50">List a property</Link>
              <div className="mt-2 border-t border-spruce/10 pt-4">
                {user ? (
                  <div className="flex flex-col gap-1">
                    <p className="flex items-center gap-2 px-3 text-sm text-slate"><UserRound size={16} /> {user.email}</p>
                    <Link to="/my-listings" className="rounded-lg px-3 py-3 text-base font-semibold text-slate hover:bg-spruce-50">My listings</Link>
                    <button type="button" onClick={() => { logout(); navigate('/') }} className="rounded-lg px-3 py-3 text-left text-base font-semibold text-slate hover:bg-spruce-50">Sign out</button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <Link to="/login" className="btn btn-outline">Sign in</Link>
                    <Link to="/register" className="btn btn-primary">Create account</Link>
                  </div>
                )}
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
