import { Heart } from 'lucide-react'
import PropertyCard from '../components/property/PropertyCard'
import EmptyState from '../components/common/EmptyState'
import Button from '../components/common/Button'
import { useApp } from '../context/AppContext'
import { plural } from '../utils/format'
import { useTitle } from '../hooks/useTitle'

export default function Wishlist() {
  const { wishlist, getProperty, clearWishlist, compare, toggleCompare } = useApp()
  const items = wishlist.map(getProperty).filter(Boolean)
  useTitle('Wishlist')

  return (
    <div className="container-page py-8 sm:py-10">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-spruce sm:text-4xl">Your wishlist</h1>
          <p className="mt-1 text-slate">{items.length ? `${plural(items.length, 'saved home')}, stored on this device.` : 'Homes you save will show up here.'}</p>
        </div>
        {items.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() => items.slice(0, 3).forEach((p) => !compare.includes(p.id) && toggleCompare(p.id))}
            >
              Compare first 3
            </button>
            <button type="button" className="btn btn-ghost btn-sm" onClick={clearWishlist}>Clear all</button>
          </div>
        )}
      </div>

      {items.length === 0 ? (
        <EmptyState icon={Heart} title="Nothing saved yet" action={<Button to="/properties">Browse homes</Button>}>
          Tap the heart on any listing to keep it here for later.
        </EmptyState>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((p) => <PropertyCard key={p.id} property={p} />)}
        </div>
      )}
    </div>
  )
}
