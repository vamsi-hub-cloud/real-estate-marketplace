import { useState } from 'react'
import PropertyArt, { ART_VIEWS } from './PropertyArt'

// Builds the gallery slides: real photos when a listing has them, otherwise illustrated views.
export function getGallery(property) {
  const photos = (property.photos || []).map((src, i) => ({ id: `photo-${i}`, label: `Photo ${i + 1}`, src }))
  if (photos.length) return photos
  return ART_VIEWS.map((v) => ({ id: v.kind, label: v.label, kind: v.kind }))
}

export default function PropertyImage({ property, item, className = 'h-full w-full object-cover' }) {
  const slide = item || getGallery(property)[0]
  const [failed, setFailed] = useState(false)
  if (slide.src && !failed) {
    return (
      <img
        src={slide.src}
        alt={`${property.title} – ${slide.label}`}
        className={className}
        loading="lazy"
        onError={() => setFailed(true)}
      />
    )
  }
  return (
    <PropertyArt
      type={property.type}
      seed={property.seed}
      kind={slide.kind || 'exterior'}
      className={className}
      title={`${property.title} – ${slide.label}`}
    />
  )
}
