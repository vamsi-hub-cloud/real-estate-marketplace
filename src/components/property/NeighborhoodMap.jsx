import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Coffee, GraduationCap, ShoppingBasket, Stethoscope, TrainFront, Trees } from 'lucide-react'
import { cities } from '../../data/cities'

function hash(str) {
  let h = 7
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) % 100003
  return h
}

const PLACES = [
  { name: 'Elementary school', icon: GraduationCap },
  { name: 'Neighborhood park', icon: Trees },
  { name: 'Transit stop', icon: TrainFront },
  { name: 'Grocery store', icon: ShoppingBasket },
  { name: 'Café', icon: Coffee },
  { name: 'Clinic', icon: Stethoscope },
]

export function nearbyPlaces(property) {
  let s = hash(property.id + property.neighborhood)
  const next = () => {
    s = (s * 1103515245 + 12345) % 2147483648
    return s / 2147483648
  }
  return PLACES.map((p) => {
    const miles = Math.round((0.1 + next() * 1.9) * 10) / 10
    return { ...p, miles, walk: Math.max(2, Math.round(miles * 20)) }
  })
}

export default function NeighborhoodMap({ property }) {
  const city = cities[property.city]
  const { river, roads } = useMemo(() => {
    const h = hash(property.city)
    const y = (n) => 60 + ((h * (n + 3)) % 260)
    return {
      river: `M-20 ${y(1)} C 200 ${y(2)}, 420 ${y(3)}, 820 ${y(4)}`,
      roads: [70, 150, 230, 310, 370].map((v, i) => `M0 ${v + ((h + i * 13) % 14)} Q 400 ${v - 24 + ((h * (i + 2)) % 40)} 800 ${v + ((h + i * 7) % 18)}`),
    }
  }, [property.city])
  const verticals = [110, 250, 390, 530, 670]
  const px = Math.max(30, Math.min(770, (property.pos?.[0] ?? 50) * 8))
  const py = Math.max(50, Math.min(380, (property.pos?.[1] ?? 50) * 4))
  const places = useMemo(() => nearbyPlaces(property), [property])

  return (
    <div>
      <div className="overflow-hidden rounded-xl2 border border-spruce/10 bg-white shadow-card">
        <svg viewBox="0 0 800 420" className="block h-auto w-full" role="img" aria-label={`Schematic map of ${property.city} showing ${property.neighborhood}`}>
          <rect width="800" height="420" fill="#E9F0EC" />
          <path d={river} stroke="#BBDCE6" strokeWidth="44" fill="none" strokeLinecap="round" />
          {[[120, 340, 90, 40], [560, 70, 110, 46], [330, 200, 70, 34]].map(([x, y, rx, ry], i) => (
            <ellipse key={i} cx={x} cy={y} rx={rx} ry={ry} fill="#CFE3CB" />
          ))}
          {roads.map((d, i) => <path key={i} d={d} stroke="#fff" strokeWidth="9" fill="none" />)}
          {verticals.map((x, i) => (
            <path key={x} d={`M${x + (i % 2 ? 10 : -6)} 0 L ${x - (i % 2 ? 14 : -8)} 420`} stroke="#fff" strokeWidth="7" fill="none" />
          ))}
          {Object.entries(city.hoods).map(([name, h]) => {
            const active = name === property.neighborhood
            return (
              <text
                key={name}
                x={h.pos[0] * 8}
                y={h.pos[1] * 4 + (active ? 36 : 4)}
                textAnchor="middle"
                fontSize={active ? 15 : 13}
                fontWeight={active ? 700 : 500}
                fill={active ? '#0F3D3A' : '#6D7C79'}
                fontFamily="ui-sans-serif, system-ui, sans-serif"
                style={{ paintOrder: 'stroke', stroke: '#E9F0EC', strokeWidth: 4 }}
              >
                {name}
              </text>
            )
          })}
          <g transform={`translate(${px} ${py})`}>
            <ellipse cx="0" cy="2" rx="14" ry="5" fill="#0F3D3A" opacity=".2" />
            <motion.g initial={{ y: -40, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }} transition={{ type: 'spring', stiffness: 220, damping: 14 }}>
              <path d="M0 0C-12 -16 -17 -27 -17 -34a17 17 0 1 1 34 0c0 7 -5 18 -17 34z" fill="#F2A71B" stroke="#0F3D3A" strokeWidth="3" />
              <circle cx="0" cy="-34" r="6.5" fill="#fff" />
            </motion.g>
          </g>
        </svg>
      </div>
      <p className="mt-3 text-sm text-slate">Schematic map – streets and distances are illustrative.</p>

      <ul className="mt-5 grid gap-3 sm:grid-cols-2">
        {places.map(({ name, icon: Icon, miles, walk }) => (
          <li key={name} className="flex items-center gap-3 rounded-xl border border-spruce/10 bg-white px-4 py-3">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-spruce-50 text-spruce-500"><Icon size={19} /></span>
            <div className="flex-1">
              <p className="text-sm font-semibold">{name}</p>
              <p className="text-[13px] text-slate">{miles} mi · about {walk} min on foot</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
