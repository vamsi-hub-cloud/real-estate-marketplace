import { Home } from 'lucide-react'
import PropertyCard from '../components/property/PropertyCard'
import EmptyState from '../components/common/EmptyState'
import Button from '../components/common/Button'
import { useApp } from '../context/AppContext'
import { useTitle } from '../hooks/useTitle'

export default function MyListings() {
  const { properties, user, removeProperty } = useApp()
  const mine = properties.filter((p) => p.userListing && p.owner === user?.email)
  useTitle('My listings')

  return (
    <div className="container-page py-8 sm:py-10">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-spruce sm:text-4xl">My listings</h1>
          <p className="mt-1 text-slate">Properties you’ve published from this account.</p>
        </div>
        <Button to="/submit" variant="accent">List a property</Button>
      </div>
      {mine.length === 0 ? (
        <EmptyState icon={Home} title="You haven’t listed anything yet" action={<Button to="/submit">Start a listing</Button>}>
          Add a home for sale or rent and it appears in search straight away.
        </EmptyState>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {mine.map((p) => (
            <div key={p.id} className="flex flex-col gap-3">
              <PropertyCard property={p} />
              <button type="button" onClick={() => removeProperty(p.id)} className="btn btn-outline btn-sm self-start text-red-700">Remove listing</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
