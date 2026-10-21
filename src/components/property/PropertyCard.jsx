import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Bath, BedDouble, MapPin, Maximize2 } from 'lucide-react'
import PropertyImage from '../common/PropertyImage'
import WishlistButton from '../common/WishlistButton'
import CompareButton from '../common/CompareButton'
import { number, postedLabel, priceLabel } from '../../utils/format'

function Stats({ property }) {
  return (
    <ul className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate">
      <li className="flex items-center gap-1.5"><BedDouble size={16} className="text-spruce-500" />{property.beds} bd</li>
      <li className="flex items-center gap-1.5"><Bath size={16} className="text-spruce-500" />{property.baths} ba</li>
      <li className="flex items-center gap-1.5"><Maximize2 size={15} className="text-spruce-500" />{number(property.area)} sq ft</li>
    </ul>
  )
}

export default function PropertyCard({ property, layout = 'grid' }) {
  const isList = layout === 'list'
  return (
    <motion.article
      layout="position"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28 }}
      className={`group surface overflow-hidden transition-shadow hover:shadow-lift ${isList ? 'flex flex-col sm:flex-row' : 'flex flex-col'}`}
    >
      <div className={`relative overflow-hidden bg-spruce-50 ${isList ? 'aspect-[16/10] sm:aspect-auto sm:w-72 sm:shrink-0 lg:w-80' : 'aspect-[4/3]'}`}>
        <Link to={`/properties/${property.id}`} tabIndex={-1} aria-hidden="true" className="block h-full w-full">
          <div className="h-full w-full transition-transform duration-500 group-hover:scale-[1.04]">
            <PropertyImage property={property} item={undefined} />
          </div>
        </Link>
        <div className="absolute left-3 top-3 flex gap-2">
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${property.status === 'rent' ? 'bg-marigold text-ink' : 'bg-spruce text-white'}`}>
            {property.status === 'rent' ? 'For rent' : 'For sale'}
          </span>
          {property.userListing && <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-spruce">Your listing</span>}
        </div>
        <div className="absolute right-3 top-3 flex flex-col gap-2">
          <WishlistButton id={property.id} />
          <CompareButton id={property.id} />
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="font-display text-2xl font-bold text-spruce">{priceLabel(property)}</p>
        <h3 className="mt-1 text-lg font-semibold leading-snug text-ink">
          <Link to={`/properties/${property.id}`} className="hover:text-spruce-500">{property.title}</Link>
        </h3>
        <p className="mt-1 flex items-center gap-1.5 text-sm text-slate">
          <MapPin size={15} className="shrink-0 text-spruce-500" />
          {property.neighborhood}, {property.city}
        </p>
        {isList && <p className="mt-3 line-clamp-2 text-sm text-slate">{property.description[0]}</p>}
        <div className="mt-auto pt-4">
          <div className="border-t border-spruce/10 pt-4">
            <Stats property={property} />
          </div>
          <p className="mt-2 text-xs text-slate-soft">{property.type} · {postedLabel(property.daysAgo)}</p>
        </div>
      </div>
    </motion.article>
  )
}
