import { Link } from 'react-router-dom'

export function LogoMark({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <rect width="64" height="64" rx="14" fill="#0F3D3A" />
      <path d="M12 31 32 14l20 17v19H12z" fill="#F4F7F6" />
      <rect x="26" y="33" width="12" height="17" rx="1" fill="#0F3D3A" />
      <circle cx="32" cy="27" r="3.2" fill="#F2A71B" />
    </svg>
  )
}

export default function Logo({ light = false }) {
  return (
    <Link to="/" className="flex items-center gap-2.5" aria-label="Keystead home">
      <LogoMark />
      <span className={`font-display text-xl font-bold tracking-tight ${light ? 'text-white' : 'text-spruce'}`}>Keystead</span>
    </Link>
  )
}
