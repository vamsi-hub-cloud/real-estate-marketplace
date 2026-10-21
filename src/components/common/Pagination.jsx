import { ChevronLeft, ChevronRight } from 'lucide-react'

function range(current, total) {
  const set = new Set([1, total, current, current - 1, current + 1])
  const nums = [...set].filter((n) => n >= 1 && n <= total).sort((a, b) => a - b)
  const out = []
  nums.forEach((n, i) => {
    if (i && n - nums[i - 1] > 1) out.push(`gap-${n}`)
    out.push(n)
  })
  return out
}

export default function Pagination({ page, pages, onChange }) {
  if (pages <= 1) return null
  const base = 'grid h-10 min-w-10 place-items-center rounded-xl px-2 text-sm font-semibold transition-colors'
  return (
    <nav aria-label="Pagination" className="mt-10 flex items-center justify-center gap-1.5">
      <button
        type="button"
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
        className={`${base} border border-spruce/20 bg-white text-spruce hover:bg-spruce-50 disabled:opacity-40`}
        aria-label="Previous page"
      >
        <ChevronLeft size={18} />
      </button>
      {range(page, pages).map((item) =>
        typeof item === 'string' ? (
          <span key={item} className="px-1 text-slate-soft" aria-hidden="true">…</span>
        ) : (
          <button
            key={item}
            type="button"
            onClick={() => onChange(item)}
            aria-current={item === page ? 'page' : undefined}
            className={`${base} ${item === page ? 'bg-spruce text-white' : 'border border-spruce/20 bg-white text-spruce hover:bg-spruce-50'}`}
          >
            {item}
          </button>
        ),
      )}
      <button
        type="button"
        disabled={page === pages}
        onClick={() => onChange(page + 1)}
        className={`${base} border border-spruce/20 bg-white text-spruce hover:bg-spruce-50 disabled:opacity-40`}
        aria-label="Next page"
      >
        <ChevronRight size={18} />
      </button>
    </nav>
  )
}
