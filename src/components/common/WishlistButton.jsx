import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'
import { useApp } from '../../context/AppContext'

export default function WishlistButton({ id, className = '', label = false }) {
  const { isWished, toggleWishlist } = useApp()
  const active = isWished(id)
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.86 }}
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        toggleWishlist(id)
      }}
      aria-pressed={active}
      aria-label={active ? 'Remove from wishlist' : 'Save to wishlist'}
      className={`inline-flex items-center gap-2 rounded-full bg-white/95 text-spruce shadow-card transition-colors hover:bg-white ${label ? 'px-4 py-2 text-sm font-semibold' : 'h-10 w-10 justify-center'} ${className}`}
    >
      <motion.span key={String(active)} initial={{ scale: active ? 0.4 : 1 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500, damping: 14 }} className="inline-flex">
        <Heart size={19} className={active ? 'fill-red-500 text-red-500' : ''} />
      </motion.span>
      {label && (active ? 'Saved' : 'Save')}
    </motion.button>
  )
}
