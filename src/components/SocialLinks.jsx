import instagramIcon from '../assets/instagramicon.jpg'
import facebookIcon from '../assets/facebookicon.jpg'
import youtubeIcon from '../assets/youtubeicon.jpg'
import tiktokIcon from '../assets/tiktokicon.jpg'
import { SOCIAL } from '../lib/company'

const items = [
  { href: SOCIAL.instagram, label: 'Instagram', src: instagramIcon },
  { href: SOCIAL.facebook, label: 'Facebook', src: facebookIcon },
  { href: SOCIAL.tiktok, label: 'TikTok', src: tiktokIcon },
  { href: SOCIAL.youtube, label: 'YouTube', src: youtubeIcon },
]

export default function SocialLinks({ className = '' }) {
  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      {items.map(({ href, label, src }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noreferrer"
          aria-label={label}
          className="inline-flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl transition hover:-translate-y-0.5 hover:shadow-lg"
        >
          <img src={src} alt={label} className="h-full w-full object-contain" />
        </a>
      ))}
    </div>
  )
}
