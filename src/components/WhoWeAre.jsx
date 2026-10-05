import { Link } from 'react-router-dom'
import Reveal from './Reveal'

const mosaic = [
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=700&q=80',
  'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=700&q=80',
  'https://images.unsplash.com/photo-1515955656352-a1fa3ffc26e3?w=700&q=80',
  'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=700&q=80',
]

export default function WhoWeAre({ showAboutLink = false }) {
  return (
    <section className="ck-container py-12 md:py-16 lg:py-20">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--ck-mute)]">Who we are</p>
          <h2 className="mt-3 font-display text-3xl md:text-5xl">A boutique written in sneakers</h2>
          <p className="mt-4 text-base font-normal leading-relaxed text-[var(--ck-mute)]">
            We started with a simple belief: Kenya deserves a house where the drop feels like an
            event and the fit feels personal. Champion Kicks curates footwear and apparel for
            people who move through the city like it is a runway.
          </p>
          <div className="mt-6 space-y-3 text-sm">
            {[
              ['Nairobi', 'AA Plaza, JKUAT Towers'],
              ['Eldoret', 'Central Arcade · Jarde Collection'],
              ['Reach us', 'Call / WhatsApp 0727 091 597'],
            ].map(([label, value]) => (
              <div key={label} className="flex gap-3 border-b border-[var(--ck-line)] pb-3">
                <strong className="min-w-24">{label}</strong>
                <span className="text-[var(--ck-mute)]">{value}</span>
              </div>
            ))}
          </div>
          {showAboutLink && (
            <Link to="/about" className="mt-6 inline-block text-sm font-semibold hover:underline">
              Learn more about us →
            </Link>
          )}
        </Reveal>
        <Reveal delay={120}>
          <div className="grid grid-cols-2 gap-3">
            {mosaic.map((src, i) => (
              <img
                key={src}
                src={src}
                alt=""
                className={`h-36 w-full rounded-[1.15rem] object-cover shadow-sm sm:h-52 ${i % 2 ? 'sm:translate-y-4' : ''}`}
              />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
