import { motion } from 'framer-motion'

export default function EmptyState({ icon: Icon, title, children, action }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="surface mx-auto flex max-w-lg flex-col items-center px-6 py-14 text-center"
    >
      {Icon && (
        <div className="mb-4 grid h-14 w-14 place-items-center rounded-full bg-spruce-50 text-spruce-500">
          <Icon size={26} />
        </div>
      )}
      <h2 className="text-2xl font-bold text-spruce">{title}</h2>
      <p className="mt-2 text-slate">{children}</p>
      {action && <div className="mt-6 flex flex-wrap justify-center gap-3">{action}</div>}
    </motion.div>
  )
}
