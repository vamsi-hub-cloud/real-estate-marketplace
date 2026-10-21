import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

export default function SectionHeading({ title, subtitle, to, linkLabel = 'View all' }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div className="max-w-xl">
        <h2 className="text-3xl font-bold text-spruce sm:text-4xl">{title}</h2>
        {subtitle && <p className="mt-2 text-slate">{subtitle}</p>}
      </div>
      {to && (
        <Link to={to} className="inline-flex items-center gap-1.5 text-sm font-semibold text-spruce-500 hover:text-spruce">
          {linkLabel} <ArrowRight size={16} />
        </Link>
      )}
    </div>
  )
}
