import { ArrowLeftRight, Check } from 'lucide-react'
import { useApp } from '../../context/AppContext'

export default function CompareButton({ id, className = '', label = false }) {
  const { isCompared, toggleCompare } = useApp()
  const active = isCompared(id)
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        toggleCompare(id)
      }}
      aria-pressed={active}
      aria-label={active ? 'Remove from comparison' : 'Add to comparison'}
      className={`inline-flex items-center gap-2 rounded-full shadow-card transition-colors ${active ? 'bg-spruce text-white' : 'bg-white/95 text-spruce hover:bg-white'} ${label ? 'px-4 py-2 text-sm font-semibold' : 'h-10 w-10 justify-center'} ${className}`}
    >
      {active ? <Check size={18} /> : <ArrowLeftRight size={18} />}
      {label && (active ? 'Comparing' : 'Compare')}
    </button>
  )
}
