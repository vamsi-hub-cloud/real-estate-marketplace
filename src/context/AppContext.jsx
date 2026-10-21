import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, AlertCircle } from 'lucide-react'
import { baseProperties } from '../data/properties'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { sha256 } from '../utils/hash'

const Ctx = createContext(null)

export const DEMO_ACCOUNT = { name: 'Demo Buyer', email: 'demo@keystead.com', password: 'Keystead1' }
export const MAX_COMPARE = 3

export function useApp() {
  const value = useContext(Ctx)
  if (!value) throw new Error('useApp must be used inside <AppProvider>')
  return value
}

export function AppProvider({ children }) {
  const [wishlist, setWishlist] = useLocalStorage('keystead:wishlist', [])
  const [compare, setCompare] = useLocalStorage('keystead:compare', [])
  const [userListings, setUserListings] = useLocalStorage('keystead:listings', [])
  const [users, setUsers] = useLocalStorage('keystead:users', [])
  const [user, setUser] = useLocalStorage('keystead:session', null)
  const [toasts, setToasts] = useState([])

  const toast = useCallback((message, type = 'success') => {
    const id = `${Date.now()}-${Math.random()}`
    setToasts((t) => [...t, { id, message, type }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200)
  }, [])

  const properties = useMemo(() => [...userListings, ...baseProperties], [userListings])
  const getProperty = useCallback((id) => properties.find((p) => p.id === id), [properties])

  const toggleWishlist = useCallback(
    (id) => {
      const has = wishlist.includes(id)
      setWishlist((w) => (has ? w.filter((x) => x !== id) : [...w, id]))
      toast(has ? 'Removed from your wishlist' : 'Saved to your wishlist')
    },
    [wishlist, setWishlist, toast],
  )

  const toggleCompare = useCallback(
    (id) => {
      if (compare.includes(id)) {
        setCompare((c) => c.filter((x) => x !== id))
        return
      }
      if (compare.length >= MAX_COMPARE) {
        toast(`You can compare up to ${MAX_COMPARE} homes at a time`, 'error')
        return
      }
      setCompare((c) => [...c, id])
    },
    [compare, setCompare, toast],
  )

  const login = useCallback(
    async (email, password) => {
      const e = email.trim().toLowerCase()
      if (e === DEMO_ACCOUNT.email && password === DEMO_ACCOUNT.password) {
        setUser({ name: DEMO_ACCOUNT.name, email: e })
        return { ok: true }
      }
      const found = users.find((u) => u.email === e)
      if (!found) return { ok: false, error: 'We couldn’t find an account with that email.' }
      if (found.hash !== (await sha256(password))) return { ok: false, error: 'That password doesn’t match. Try again.' }
      setUser({ name: found.name, email: found.email })
      return { ok: true }
    },
    [users, setUser],
  )

  const register = useCallback(
    async ({ name, email, password }) => {
      const e = email.trim().toLowerCase()
      if (e === DEMO_ACCOUNT.email || users.some((u) => u.email === e)) {
        return { ok: false, error: 'An account with this email already exists. Sign in instead.' }
      }
      const hash = await sha256(password)
      setUsers((u) => [...u, { name: name.trim(), email: e, hash }])
      setUser({ name: name.trim(), email: e })
      return { ok: true }
    },
    [users, setUsers, setUser],
  )

  const logout = useCallback(() => {
    setUser(null)
    toast('You’ve been signed out')
  }, [setUser, toast])

  const addProperty = useCallback(
    (data) => {
      const listing = { ...data, id: `u-${Date.now()}`, daysAgo: 0, owner: user?.email || null, userListing: true }
      setUserListings((l) => [listing, ...l])
      return listing
    },
    [setUserListings, user],
  )

  const removeProperty = useCallback(
    (id) => {
      setUserListings((l) => l.filter((p) => p.id !== id))
      setWishlist((w) => w.filter((x) => x !== id))
      setCompare((c) => c.filter((x) => x !== id))
      toast('Listing removed')
    },
    [setUserListings, setWishlist, setCompare, toast],
  )

  const value = {
    properties,
    getProperty,
    wishlist,
    toggleWishlist,
    isWished: (id) => wishlist.includes(id),
    clearWishlist: () => setWishlist([]),
    compare,
    toggleCompare,
    isCompared: (id) => compare.includes(id),
    clearCompare: () => setCompare([]),
    user,
    login,
    register,
    logout,
    addProperty,
    removeProperty,
    toast,
  }

  return (
    <Ctx.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 top-4 z-[100] flex flex-col items-center gap-2 px-4" aria-live="polite">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: -16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              className="pointer-events-auto flex items-center gap-2.5 rounded-xl bg-spruce-800 px-4 py-3 text-sm font-medium text-white shadow-lift"
              role="status"
            >
              {t.type === 'error' ? (
                <AlertCircle size={18} className="text-marigold" />
              ) : (
                <CheckCircle2 size={18} className="text-marigold" />
              )}
              {t.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </Ctx.Provider>
  )
}
