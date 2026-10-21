export default function AgentAvatar({ agent, size = 56, className = '' }) {
  const initials = agent.name.split(' ').map((n) => n[0]).join('').slice(0, 2)
  return (
    <div
      className={`grid shrink-0 place-items-center rounded-full font-display font-bold text-white ${className}`}
      style={{ width: size, height: size, fontSize: size * 0.36, background: `hsl(${agent.hue} 42% 32%)` }}
      aria-hidden="true"
    >
      {initials}
    </div>
  )
}
