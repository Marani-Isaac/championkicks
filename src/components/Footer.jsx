import { Link } from 'react-router-dom'
import Logo from './Logo'
import SocialLinks from './SocialLinks'
import { BRANCHES, EMAIL, PHONE_DISPLAY, PHONE_TEL, WHATSAPP_URL } from '../lib/company'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-auto border-t border-[var(--ck-line)] bg-[var(--ck-ink)] text-[#f5f5f5]">
      <div className="ck-container grid gap-10 py-10 sm:grid-cols-2 sm:py-14 xl:grid-cols-4">
        <div className="sm:col-span-2">
          <Logo className="h-14 w-auto" />
          <p className="mt-3 max-w-md text-sm leading-relaxed text-[#bdbdbd]">
            Exclusive clothes and sneakers — the biggest, the baddest. Visit us in Nairobi and
            Eldoret, or shop the drop online.
          </p>
          <SocialLinks className="mt-5" />
        </div>

        <div>
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-[var(--ck-accent)]">
            Explore
          </p>
          <ul className="space-y-2 text-sm text-[#d6d6d6]">
            <li>
              <Link to="/products">Our Products</Link>
            </li>
            <li>
              <Link to="/about">About Us</Link>
            </li>
            <li>
              <Link to="/contact">Contact Us</Link>
            </li>
            <li>
              <Link to="/cart">Cart</Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-[var(--ck-accent)]">
            Visit &amp; call
          </p>
          <ul className="space-y-2 text-sm text-[#d6d6d6]">
            {BRANCHES.map((branch) => (
              <li key={branch.city}>
                <strong className="text-white">{branch.city}:</strong> {branch.name}
                {branch.detail ? ` · ${branch.detail}` : ''}
              </li>
            ))}
            <li>
              <a href={PHONE_TEL} className="hover:text-[var(--ck-accent)]">
                Call {PHONE_DISPLAY}
              </a>
            </li>
            <li>
              <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="hover:text-[var(--ck-accent)]">
                WhatsApp {PHONE_DISPLAY}
              </a>
            </li>
            <li>
              <a href={`mailto:${EMAIL}`} className="hover:text-[var(--ck-accent)]">
                {EMAIL}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="ck-container flex flex-col gap-2 py-4 text-xs text-[#9a9a9a] sm:flex-row sm:justify-between">
          <span>© {year} Champion Kicks. All rights reserved.</span>
          <span>Nairobi · Eldoret · Kenya</span>
        </div>
      </div>
    </footer>
  )
}
