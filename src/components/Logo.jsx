import logo from '../assets/ck-logo.webp'

export default function Logo({ className = 'h-10 w-auto', alt = 'Champion Kicks' }) {
  return (
    <span className="ck-logo">
      <img src={logo} alt={alt} className={className} />
    </span>
  )
}
