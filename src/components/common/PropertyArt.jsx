import { useId } from 'react'

// Original, self-contained illustrations so listings never depend on remote photos.
// `kind` picks the room/view; `type` picks the building style for exteriors.

const PALETTES = [
  { sky: ['#BFE0EA', '#F3F7F1'], wall: '#EADFCB', wall2: '#D3C4AA', roof: '#2E4E49', trim: '#FFFBF1', ground: '#9BB88E', leaf: '#4B7A58', accent: '#C4562E', floor: '#C9A27A' },
  { sky: ['#C9D9EE', '#F4F6F8'], wall: '#DDE5E8', wall2: '#B9C6CB', roof: '#3B4A5A', trim: '#FFFFFF', ground: '#A6BE96', leaf: '#3F6E5B', accent: '#E0A21F', floor: '#B7936B' },
  { sky: ['#F6D9C0', '#FBF3E8'], wall: '#B96C4F', wall2: '#9A5640', roof: '#3A3330', trim: '#F7EBDD', ground: '#9AAE7E', leaf: '#5B7F4A', accent: '#1F6F78', floor: '#B98E66' },
  { sky: ['#CFE4DB', '#F5F8F3'], wall: '#E7EEE8', wall2: '#C5D3C9', roof: '#274A44', trim: '#FFFFFF', ground: '#8FB38D', leaf: '#356E55', accent: '#D98F0A', floor: '#CDAE86' },
  { sky: ['#D5D3EC', '#F6F4F8'], wall: '#F0EAE4', wall2: '#D6CCC3', roof: '#4A4458', trim: '#FFFFFF', ground: '#A3B891', leaf: '#4D7A63', accent: '#2B7A78', floor: '#BF9B73' },
  { sky: ['#F2C9A8', '#FAEBD9'], wall: '#E3D7C2', wall2: '#C8B89B', roof: '#38504B', trim: '#FFF8EA', ground: '#93AD81', leaf: '#44704F', accent: '#B8452B', floor: '#C29868' },
]

function rand(seed) {
  let a = seed | 0
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const LIT = '#FFF1C2'
const GLASS = '#CFE3EA'

function Sky({ id, p }) {
  return (
    <>
      <defs>
        <linearGradient id={`sky-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={p.sky[0]} />
          <stop offset="1" stopColor={p.sky[1]} />
        </linearGradient>
      </defs>
      <rect width="800" height="600" fill={`url(#sky-${id})`} />
    </>
  )
}

function Tree({ x, y, s = 1, p }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x="-5" y="-30" width="10" height="34" fill="#6B4F3A" />
      <circle cx="0" cy="-58" r="34" fill={p.leaf} />
      <circle cx="-22" cy="-40" r="22" fill={p.leaf} opacity=".9" />
      <circle cx="22" cy="-42" r="24" fill={p.leaf} opacity=".95" />
    </g>
  )
}

function Cloud({ x, y, s = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} fill="#fff" opacity=".85">
      <ellipse cx="0" cy="0" rx="46" ry="14" />
      <ellipse cx="-18" cy="-10" rx="22" ry="14" />
      <ellipse cx="14" cy="-14" rx="26" ry="16" />
    </g>
  )
}

function Ground({ p, y = 470 }) {
  return (
    <>
      <rect x="0" y={y} width="800" height={600 - y} fill={p.ground} />
      <rect x="0" y={y} width="800" height="6" fill="#000" opacity=".06" />
    </>
  )
}

function Win({ x, y, w, h, p, lit }) {
  return (
    <g>
      <rect x={x - 4} y={y - 4} width={w + 8} height={h + 8} fill={p.trim} />
      <rect x={x} y={y} width={w} height={h} fill={lit ? LIT : GLASS} />
      <path d={`M${x + w / 2} ${y}V${y + h}M${x} ${y + h / 2}H${x + w}`} stroke={p.trim} strokeWidth="3" />
    </g>
  )
}

function HouseExterior({ p, r }) {
  const flip = r() > 0.5
  const lit = r() > 0.4
  return (
    <g transform={flip ? 'translate(800 0) scale(-1 1)' : undefined}>
      <Tree x={110} y={470} s={1.1} p={p} />
      <Tree x={720} y={470} s={0.9} p={p} />
      <rect x="470" y="190" width="30" height="80" fill={p.wall2} />
      <rect x="230" y="300" width="340" height="170" fill={p.wall} />
      <rect x="230" y="440" width="340" height="30" fill={p.wall2} opacity=".6" />
      <polygon points="205,305 400,185 595,305" fill={p.roof} />
      <polygon points="205,305 400,185 400,205 232,305" fill="#000" opacity=".08" />
      <circle cx="400" cy="262" r="17" fill={lit ? LIT : GLASS} stroke={p.trim} strokeWidth="5" />
      <Win x={266} y={345} w={70} h={62} p={p} lit={lit} />
      <Win x={464} y={345} w={70} h={62} p={p} lit={!lit} />
      <rect x="372" y="368" width="56" height="102" fill={p.accent} />
      <circle cx="416" cy="422" r="3.5" fill={p.trim} />
      <rect x="356" y="470" width="88" height="8" fill={p.wall2} />
      <rect x="346" y="478" width="108" height="8" fill={p.wall2} opacity=".8" />
      <path d="M440 470 Q520 540 640 600H380Z" fill={p.wall2} opacity=".35" />
    </g>
  )
}

function VillaExterior({ p, r }) {
  const lit = r() > 0.35
  return (
    <g>
      <Tree x={90} y={470} s={1.15} p={p} />
      <Tree x={730} y={470} s={1} p={p} />
      <rect x="150" y="340" width="500" height="130" fill={p.wall} />
      <rect x="260" y="238" width="300" height="104" fill={p.wall2} />
      <rect x="236" y="226" width="348" height="16" fill={p.roof} />
      <rect x="126" y="328" width="548" height="16" fill={p.roof} />
      {[0, 1, 2].map((i) => (
        <rect key={i} x={282 + i * 96} y="256" width="82" height="70" fill={i === 1 && lit ? LIT : GLASS} stroke={p.trim} strokeWidth="4" />
      ))}
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={176 + i * 114} y="362" width="94" height="86" fill={(i + (lit ? 0 : 1)) % 2 ? LIT : GLASS} stroke={p.trim} strokeWidth="4" />
      ))}
      <rect x="150" y="448" width="500" height="22" fill={p.wall2} opacity=".7" />
      <rect x="90" y="492" width="620" height="78" rx="10" fill="#8EC7D6" />
      <rect x="90" y="492" width="620" height="78" rx="10" fill="none" stroke={p.trim} strokeWidth="6" />
      {[0, 1, 2, 3, 4].map((i) => (
        <path key={i} d={`M${130 + i * 120} 520q20 -12 40 0t40 0`} stroke="#fff" strokeWidth="3" fill="none" opacity=".7" />
      ))}
    </g>
  )
}

function ApartmentExterior({ p, r }) {
  const cols = 4
  const rows = 9
  return (
    <g>
      <rect x="130" y="260" width="150" height="210" fill={p.wall2} />
      <rect x="530" y="230" width="150" height="240" fill={p.wall2} />
      {Array.from({ length: 3 }).map((_, row) =>
        Array.from({ length: 3 }).map((__, c) => (
          <rect key={`l${row}${c}`} x={148 + c * 44} y={280 + row * 56} width="28" height="36" fill={r() > 0.5 ? LIT : GLASS} />
        )),
      )}
      {Array.from({ length: 4 }).map((_, row) =>
        Array.from({ length: 3 }).map((__, c) => (
          <rect key={`r${row}${c}`} x={548 + c * 44} y={250 + row * 54} width="28" height="34" fill={r() > 0.5 ? LIT : GLASS} />
        )),
      )}
      <rect x="270" y="80" width="260" height="390" fill={p.wall} />
      <rect x="270" y="80" width="260" height="14" fill={p.roof} />
      {Array.from({ length: rows }).map((_, row) =>
        Array.from({ length: cols }).map((__, c) => (
          <g key={`${row}-${c}`}>
            <rect x={288 + c * 60} y={110 + row * 38} width="44" height="26" fill={r() > 0.55 ? LIT : GLASS} />
            {row % 2 === 0 && <rect x={284 + c * 60} y={137 + row * 38} width="52" height="4" fill={p.wall2} />}
          </g>
        )),
      )}
      <rect x="335" y="420" width="130" height="50" fill={p.roof} />
      <rect x="320" y="412" width="160" height="10" fill={p.accent} />
      <rect x="372" y="436" width="56" height="34" fill={GLASS} />
      <Tree x={90} y={470} s={0.9} p={p} />
      <Tree x={730} y={470} s={1} p={p} />
    </g>
  )
}

function TownhouseExterior({ p, r }) {
  const units = [
    { x: 130, h: 250, c: p.wall },
    { x: 310, h: 290, c: p.wall2 },
    { x: 490, h: 262, c: p.wall },
  ]
  return (
    <g>
      {units.map((u, i) => {
        const top = 470 - u.h
        return (
          <g key={i}>
            <rect x={u.x} y={top} width="170" height={u.h} fill={u.c} />
            <rect x={u.x - 4} y={top - 12} width="178" height="14" fill={p.roof} />
            <Win x={u.x + 22} y={top + 32} w={46} h={56} p={p} lit={r() > 0.5} />
            <Win x={u.x + 102} y={top + 32} w={46} h={56} p={p} lit={r() > 0.5} />
            <Win x={u.x + 22} y={top + 120} w={46} h={56} p={p} lit={r() > 0.5} />
            <rect x={u.x + 98} y={top + 120} width="56" height={u.h - 120} fill={i === 1 ? p.accent : p.roof} />
            <circle cx={u.x + 142} cy={top + 120 + (u.h - 120) / 2} r="3" fill={p.trim} />
            <rect x={u.x + 90} y="470" width="72" height="8" fill={p.wall2} />
          </g>
        )
      })}
      <Tree x={92} y={470} s={0.8} p={p} />
      <Tree x={716} y={470} s={0.9} p={p} />
    </g>
  )
}

function Exterior({ type, p, r, id }) {
  return (
    <>
      <Sky id={id} p={p} />
      <circle cx="660" cy="110" r="38" fill="#FFF3C9" opacity=".9" />
      <Cloud x={150} y={110} s={1.1} />
      <Cloud x={470} y={70} s={0.8} />
      <Ground p={p} />
      {type === 'Villa' && <VillaExterior p={p} r={r} />}
      {type === 'Apartment' && <ApartmentExterior p={p} r={r} />}
      {type === 'Townhouse' && <TownhouseExterior p={p} r={r} />}
      {(type === 'House' || !['Villa', 'Apartment', 'Townhouse'].includes(type)) && <HouseExterior p={p} r={r} />}
    </>
  )
}

function Room({ p, id, children }) {
  return (
    <>
      <Sky id={id} p={p} />
      <rect width="800" height="600" fill={p.wall} />
      <rect y="440" width="800" height="160" fill={p.floor} />
      <rect y="432" width="800" height="12" fill={p.trim} />
      <path d="M0 520H800M0 570H800" stroke="#000" opacity=".06" strokeWidth="2" />
      {children}
    </>
  )
}

function WindowView({ id, p, x, y, w, h }) {
  return (
    <g>
      <rect x={x - 10} y={y - 10} width={w + 20} height={h + 20} fill={p.trim} />
      <rect x={x} y={y} width={w} height={h} fill={`url(#sky-${id})`} />
      <circle cx={x + w * 0.75} cy={y + h * 0.3} r="18" fill="#FFF3C9" />
      <path d={`M${x} ${y + h - 36}q${w * 0.2} -30 ${w * 0.4} -6t${w * 0.3} -10 ${w * 0.3} 16V${y + h}H${x}Z`} fill={p.leaf} opacity=".75" />
      <path d={`M${x + w / 2} ${y}V${y + h}M${x} ${y + h / 2}H${x + w}`} stroke={p.trim} strokeWidth="6" />
    </g>
  )
}

function Living({ p, id }) {
  return (
    <Room p={p} id={id}>
      <WindowView id={id} p={p} x={470} y={90} w={250} h={230} />
      <rect x="90" y="110" width="150" height="110" fill={p.trim} stroke={p.wall2} strokeWidth="6" />
      <circle cx="150" cy="165" r="26" fill={p.accent} opacity=".85" />
      <rect x="180" y="150" width="40" height="52" fill={p.leaf} opacity=".8" />
      <ellipse cx="330" cy="520" rx="260" ry="48" fill={p.accent} opacity=".35" />
      <rect x="110" y="330" width="360" height="110" rx="26" fill={p.roof} />
      <rect x="90" y="360" width="50" height="86" rx="20" fill={p.roof} />
      <rect x="440" y="360" width="50" height="86" rx="20" fill={p.roof} />
      <rect x="140" y="352" width="140" height="60" rx="18" fill="#fff" opacity=".14" />
      <rect x="290" y="352" width="140" height="60" rx="18" fill="#fff" opacity=".14" />
      <rect x="160" y="320" width="64" height="56" rx="14" fill={p.accent} />
      <rect x="360" y="324" width="60" height="52" rx="14" fill={p.trim} />
      <rect x="260" y="476" width="150" height="14" rx="6" fill="#6B4F3A" />
      <rect x="276" y="490" width="10" height="26" fill="#6B4F3A" />
      <rect x="386" y="490" width="10" height="26" fill="#6B4F3A" />
      <rect x="656" y="360" width="6" height="86" fill="#6B4F3A" />
      <path d="M634 352h50l-10 -42h-30Z" fill={LIT} />
      <rect x="722" y="372" width="40" height="70" fill="#8A6A52" />
      <circle cx="742" cy="350" r="28" fill={p.leaf} />
      <circle cx="722" cy="366" r="18" fill={p.leaf} opacity=".9" />
    </Room>
  )
}

function Kitchen({ p, id }) {
  return (
    <Room p={p} id={id}>
      <rect y="250" width="800" height="14" fill={p.trim} />
      <rect y="264" width="800" height="170" fill={p.trim} opacity=".55" />
      {Array.from({ length: 8 }).map((_, i) =>
        Array.from({ length: 3 }).map((__, j) => (
          <rect key={`${i}${j}`} x={i * 100} y={266 + j * 56} width="100" height="56" fill="none" stroke={p.wall2} strokeWidth="1.5" opacity=".7" />
        )),
      )}
      {Array.from({ length: 4 }).map((_, i) => (
        <g key={i}>
          <rect x={30 + i * 110} y="70" width="102" height="150" fill={p.roof} />
          <rect x={44 + i * 110} y="86" width="74" height="118" fill="none" stroke="#fff" opacity=".2" strokeWidth="2" />
          <rect x={92 + i * 110} y="140" width="4" height="24" fill={p.trim} />
        </g>
      ))}
      <WindowView id={id} p={p} x={540} y={70} w={190} h={150} />
      <rect x="0" y="330" width="500" height="112" fill={p.roof} />
      <rect x="0" y="322" width="500" height="14" fill={p.trim} />
      {Array.from({ length: 4 }).map((_, i) => (
        <rect key={i} x={20 + i * 120} y="350" width="100" height="74" fill="none" stroke="#fff" opacity=".2" strokeWidth="2" />
      ))}
      <rect x="90" y="300" width="70" height="22" rx="6" fill="#B7C2C4" />
      <rect x="120" y="268" width="6" height="34" fill="#B7C2C4" />
      <rect x="320" y="410" width="400" height="120" rx="6" fill={p.wall2} />
      <rect x="306" y="396" width="428" height="22" rx="6" fill={p.trim} />
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect x={366 + i * 120} y="530" width="8" height="52" fill="#4A3B30" />
          <rect x={346 + i * 120} y="516" width="48" height="16" rx="8" fill={p.accent} />
        </g>
      ))}
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <path d={`M${400 + i * 120} 0V${70 + i * 8}`} stroke="#333" strokeWidth="3" />
          <path d={`M${376 + i * 120} ${96 + i * 8}a24 24 0 0 1 48 0Z`} fill={p.accent} />
          <ellipse cx={400 + i * 120} cy={98 + i * 8} rx="16" ry="4" fill={LIT} />
        </g>
      ))}
    </Room>
  )
}

function Bedroom({ p, id }) {
  return (
    <Room p={p} id={id}>
      <WindowView id={id} p={p} x={80} y={90} w={210} h={220} />
      <rect x="330" y="120" width="390" height="140" fill={p.roof} />
      <rect x="350" y="138" width="350" height="104" fill="none" stroke="#fff" opacity=".18" strokeWidth="2" />
      <rect x="310" y="260" width="430" height="190" rx="14" fill={p.wall2} />
      <rect x="300" y="360" width="450" height="110" rx="16" fill={p.trim} />
      <rect x="300" y="400" width="450" height="70" rx="14" fill={p.accent} opacity=".85" />
      <rect x="330" y="310" width="150" height="60" rx="22" fill="#fff" />
      <rect x="570" y="310" width="150" height="60" rx="22" fill="#fff" />
      <rect x="320" y="470" width="14" height="30" fill="#4A3B30" />
      <rect x="716" y="470" width="14" height="30" fill="#4A3B30" />
      <rect x="196" y="400" width="86" height="76" fill={p.roof} />
      <rect x="204" y="476" width="8" height="26" fill="#4A3B30" />
      <rect x="266" y="476" width="8" height="26" fill="#4A3B30" />
      <path d="M220 400l8 -36h26l8 36Z" fill={LIT} />
      <rect x="236" y="364" width="6" height="36" fill="#333" />
      <ellipse cx="520" cy="540" rx="280" ry="40" fill={p.accent} opacity=".28" />
    </Room>
  )
}

function Plan({ p, id }) {
  const room = (x, y, w, h, label, fill) => (
    <g key={label}>
      <rect x={x} y={y} width={w} height={h} fill={fill} stroke={p.roof} strokeWidth="6" />
      <text x={x + w / 2} y={y + h / 2 + 5} textAnchor="middle" fontSize="20" fontWeight="600" fill={p.roof} fontFamily="ui-sans-serif, system-ui, sans-serif">{label}</text>
    </g>
  )
  return (
    <>
      <rect width="800" height="600" fill="#EEF5F3" />
      <defs>
        <pattern id={`grid-${id}`} width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M40 0H0V40" fill="none" stroke="#B9D6D1" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="800" height="600" fill={`url(#grid-${id})`} />
      {room(120, 90, 290, 250, 'Living', '#fff')}
      {room(410, 90, 270, 170, 'Kitchen', '#FDF6E3')}
      {room(410, 260, 270, 250, 'Bedroom 1', '#fff')}
      {room(260, 340, 150, 170, 'Bath', '#E3F0F4')}
      {room(120, 340, 140, 170, 'Bedroom 2', '#fff')}
      <path d="M300 340a40 40 0 0 1 40 -40" fill="none" stroke={p.accent} strokeWidth="3" />
      <rect x="296" y="334" width="50" height="12" fill="#EEF5F3" />
      <text x="400" y="560" textAnchor="middle" fontSize="18" fill={p.roof} opacity=".7" fontFamily="ui-sans-serif, system-ui, sans-serif">Indicative layout – not to scale</text>
    </>
  )
}

export const ART_VIEWS = [
  { kind: 'exterior', label: 'Exterior' },
  { kind: 'living', label: 'Living room' },
  { kind: 'kitchen', label: 'Kitchen' },
  { kind: 'bedroom', label: 'Bedroom' },
  { kind: 'plan', label: 'Floor plan' },
]

export default function PropertyArt({ type = 'House', seed = 1, kind = 'exterior', className = '', title }) {
  const rawId = useId().replace(/:/g, '')
  const p = PALETTES[Math.abs(seed) % PALETTES.length]
  const r = rand(seed * 31 + kind.length)
  const id = `${rawId}${kind}`
  return (
    <svg
      viewBox="0 0 800 600"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      role="img"
      aria-label={title || `${type} ${kind} illustration`}
    >
      {kind === 'exterior' && <Exterior type={type} p={p} r={r} id={id} />}
      {kind === 'living' && <Living p={p} id={id} />}
      {kind === 'kitchen' && <Kitchen p={p} id={id} />}
      {kind === 'bedroom' && <Bedroom p={p} id={id} />}
      {kind === 'plan' && <Plan p={p} id={id} />}
    </svg>
  )
}
