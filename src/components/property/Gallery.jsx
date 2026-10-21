import { useCallback, useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Expand, X } from 'lucide-react'
import PropertyImage, { getGallery } from '../common/PropertyImage'

export default function Gallery({ property }) {
  const slides = useMemo(() => getGallery(property), [property])
  const [index, setIndex] = useState(0)
  const [open, setOpen] = useState(false)
  const count = slides.length

  const go = useCallback((d) => setIndex((i) => (i + d + count) % count), [count])

  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false)
      if (e.key === 'ArrowLeft') go(-1)
      if (e.key === 'ArrowRight') go(1)
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, go])

  const slide = slides[index]
  const arrow = 'absolute top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-spruce shadow-card transition-colors hover:bg-white'

  return (
    <div>
      <div className="relative aspect-[16/10] overflow-hidden rounded-xl2 bg-spruce-50 shadow-card sm:aspect-[16/9]">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={slide.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="h-full w-full"
          >
            <PropertyImage property={property} item={slide} />
          </motion.div>
        </AnimatePresence>
        {count > 1 && (
          <>
            <button type="button" onClick={() => go(-1)} className={`${arrow} left-3`} aria-label="Previous image"><ChevronLeft size={22} /></button>
            <button type="button" onClick={() => go(1)} className={`${arrow} right-3`} aria-label="Next image"><ChevronRight size={22} /></button>
          </>
        )}
        <div className="absolute bottom-3 left-3 rounded-full bg-ink/70 px-3 py-1 text-xs font-medium text-white">{slide.label} · {index + 1}/{count}</div>
        <button type="button" onClick={() => setOpen(true)} className="absolute bottom-3 right-3 inline-flex items-center gap-2 rounded-full bg-white/95 px-3.5 py-2 text-sm font-semibold text-spruce shadow-card hover:bg-white">
          <Expand size={16} /> Full screen
        </button>
      </div>

      <ul className="no-scrollbar mt-3 flex gap-3 overflow-x-auto pb-1" aria-label="Image thumbnails">
        {slides.map((s, i) => (
          <li key={s.id} className="shrink-0">
            <button
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Show ${s.label}`}
              aria-current={i === index}
              className={`block h-16 w-24 overflow-hidden rounded-lg border-2 transition-all sm:h-[72px] sm:w-28 ${i === index ? 'border-spruce' : 'border-transparent opacity-70 hover:opacity-100'}`}
            >
              <PropertyImage property={property} item={s} />
            </button>
          </li>
        ))}
      </ul>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] flex flex-col bg-ink/95"
            role="dialog"
            aria-modal="true"
            aria-label={`${property.title} gallery`}
          >
            <div className="flex items-center justify-between px-4 py-3 text-white sm:px-6">
              <p className="text-sm">{slide.label} · {index + 1}/{count}</p>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close gallery" className="grid h-10 w-10 place-items-center rounded-full hover:bg-white/10"><X size={22} /></button>
            </div>
            <div className="relative flex flex-1 items-center justify-center px-4 pb-6 sm:px-16">
              <motion.div key={slide.id} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="aspect-[4/3] max-h-full w-full max-w-5xl overflow-hidden rounded-xl">
                <PropertyImage property={property} item={slide} />
              </motion.div>
              {count > 1 && (
                <>
                  <button type="button" onClick={() => go(-1)} className="absolute left-2 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/15 text-white hover:bg-white/25 sm:left-5" aria-label="Previous image"><ChevronLeft size={24} /></button>
                  <button type="button" onClick={() => go(1)} className="absolute right-2 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/15 text-white hover:bg-white/25 sm:right-5" aria-label="Next image"><ChevronRight size={24} /></button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
