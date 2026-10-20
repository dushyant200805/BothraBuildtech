import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Button({ to, href, variant = 'primary', children, className = '', ...props }) {
  const classes = `button ${variant === 'outline' ? 'button--outline' : ''} ${variant === 'light' ? 'button--light' : ''} ${className}`.trim()
  const content = <>{children}<ArrowRight size={16} aria-hidden="true" /></>

  if (to) return <Link className={classes} to={to} {...props}>{content}</Link>
  if (href) return <a className={classes} href={href} {...props}>{content}</a>
  return <button className={classes} {...props}>{content}</button>
}