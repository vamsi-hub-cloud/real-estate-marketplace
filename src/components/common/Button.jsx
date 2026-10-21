import { Link } from 'react-router-dom'

const variants = {
  primary: 'btn btn-primary',
  accent: 'btn btn-accent',
  outline: 'btn btn-outline',
  ghost: 'btn btn-ghost',
}
const sizes = { sm: 'btn-sm', md: '', lg: 'btn-lg' }

export default function Button({ to, href, variant = 'primary', size = 'md', className = '', children, ...props }) {
  const cls = `${variants[variant]} ${sizes[size]} ${className}`.trim()
  if (to) return <Link to={to} className={cls} {...props}>{children}</Link>
  if (href) return <a href={href} className={cls} {...props}>{children}</a>
  return <button type="button" className={cls} {...props}>{children}</button>
}
