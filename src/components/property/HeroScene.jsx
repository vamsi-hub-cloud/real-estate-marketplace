import { motion, useReducedMotion } from 'framer-motion'

// Skyline whose windows switch on one after another when the page loads.
const buildings = [
  { x: 10, w: 90, h: 150, fill: '#0D3532' },
  { x: 108, w: 70, h: 230, fill: '#165A55' },
  { x: 186, w: 110, h: 180, fill: '#0F4642' },
  { x: 304, w: 84, h: 280, fill: '#1B6B64' },
  { x: 396, w: 100, h: 200, fill: '#0D3532' },
  { x: 504, w: 76, h: 250, fill: '#165A55' },
]

function build() {
  const out = []
  let n = 0
  buildings.forEach((b, bi) => {
    const cols = Math.floor((b.w - 12) / 20)
    const rows = Math.floor((b.h - 20) / 28)
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const k = (bi * 31 + r * 17 + c * 7) % 10
        out.push({
          key: `${bi}-${r}-${c}`,
          x: b.x + 10 + c * 20,
          y: 360 - b.h + 14 + r * 28,
          lit: k < 5,
          order: n++,
        })
      }
    }
  })
  return out
}

const windows = build()

export default function HeroScene({ className = '' }) {
  const reduce = useReducedMotion()
  return (
    <svg viewBox="0 0 590 360" className={className} aria-hidden="true" preserveAspectRatio="xMaxYMax meet">
      {buildings.map((b) => (
        <rect key={b.x} x={b.x} y={360 - b.h} width={b.w} height={b.h} fill={b.fill} />
      ))}
      {windows.map((w) =>
        w.lit ? (
          <motion.rect
            key={w.key}
            x={w.x}
            y={w.y}
            width="11"
            height="16"
            rx="1.5"
            fill="#F2A71B"
            initial={{ opacity: reduce ? 0.95 : 0.12 }}
            animate={{ opacity: 0.95 }}
            transition={{ delay: reduce ? 0 : 0.5 + (w.order % 40) * 0.05 + (w.order / 40) * 0.04, duration: 0.35 }}
          />
        ) : (
          <rect key={w.key} x={w.x} y={w.y} width="11" height="16" rx="1.5" fill="#fff" opacity=".1" />
        ),
      )}
      <rect x="0" y="358" width="590" height="2" fill="#F2A71B" opacity=".5" />
    </svg>
  )
}
