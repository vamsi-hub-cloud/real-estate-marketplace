import { Link, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { MAX_COMPARE, useApp } from '../../context/AppContext'
import PropertyImage from '../common/PropertyImage'

export default function CompareBar() {
  const { compare, getProperty, toggleCompare, clearCompare } = useApp()
  const { pathname } = useLocation()
  const items = compare.map(getProperty).filter(Boolean)
  const visible = items.length > 0 && pathname !== '/compare'

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 120, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 320, damping: 32 }}
          className="fixed inset-x-0 bottom-0 z-40 px-3 pb-3 sm:px-6 sm:pb-5"
        >
          <div className="mx-auto flex max-w-3xl flex-wrap items-center gap-3 rounded-2xl bg-spruce-800 p-3 text-white shadow-lift sm:flex-nowrap sm:p-4">
            <div className="flex flex-1 items-center gap-2.5">
              {items.map((p) => (
                <div key={p.id} className="relative h-14 w-[4.5rem] overflow-hidden rounded-lg bg-spruce-600 sm:h-16 sm:w-24">
                  <PropertyImage property={p} />
                  <button
                    type="button"
                    onClick={() => toggleCompare(p.id)}
                    aria-label={`Remove ${p.title} from comparison`}
                    className="absolute right-1 top-1 grid h-5 w-5 place-items-center rounded-full bg-ink/70 hover:bg-ink"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
              {Array.from({ length: MAX_COMPARE - items.length }).map((_, i) => (
                <div key={i} className="hidden h-16 w-24 rounded-lg border border-dashed border-white/25 sm:block" />
              ))}
            </div>
            <div className="flex w-full items-center justify-between gap-3 sm:w-auto sm:justify-end">
              <button type="button" onClick={clearCompare} className="text-sm text-white/70 hover:text-white">Clear</button>
              <Link
                to="/compare"
                className={`btn btn-accent btn-sm ${items.length < 2 ? 'pointer-events-none opacity-50' : ''}`}
                aria-disabled={items.length < 2}
              >
                {items.length < 2 ? 'Add one more to compare' : `Compare ${items.length} homes`}
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
