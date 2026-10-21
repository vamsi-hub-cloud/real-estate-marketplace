import { motion } from 'framer-motion'
import Logo from './Logo'
import HeroScene from '../property/HeroScene'

export default function AuthShell({ title, subtitle, children, footer }) {
  return (
    <div className="grid min-h-[calc(100vh-4rem)] lg:grid-cols-2">
      <div className="flex items-center justify-center px-4 py-10 sm:px-8">
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <h1 className="text-3xl font-bold text-spruce sm:text-4xl">{title}</h1>
          <p className="mt-2 text-slate">{subtitle}</p>
          <div className="mt-8">{children}</div>
          <div className="mt-6 text-center text-sm text-slate">{footer}</div>
        </motion.div>
      </div>
      <div className="relative hidden overflow-hidden bg-spruce lg:block">
        <HeroScene className="absolute inset-x-0 bottom-0 h-3/4 w-full opacity-80" />
        <div className="relative z-10 p-14 text-white">
          <Logo light />
          <p className="mt-16 max-w-sm font-display text-3xl font-bold leading-tight">Save homes, compare them and book tours from one place.</p>
          <p className="mt-4 max-w-sm text-white/75">Your wishlist and listings are kept on this device while you explore the demo.</p>
        </div>
      </div>
    </div>
  )
}
