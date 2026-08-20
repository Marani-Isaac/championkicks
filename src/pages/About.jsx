import { Link } from 'react-router-dom'
import WhoWeAre from '../components/WhoWeAre'
import VisionMission from '../components/VisionMission'
import { cardTone } from '../lib/ui'
import {
  BRANCHES,
  EMAIL,
  PHONE_DISPLAY,
  PHONE_TEL,
  WHATSAPP_URL,
} from '../lib/company'

export default function About() {
  return (
    <div>
      <section className="border-b border-[var(--ck-line)] bg-[var(--ck-ink)] text-white">
        <div className="ck-container py-16">
          <p className="font-display text-6xl md:text-7xl">About Us</p>
          <p className="mt-4 max-w-2xl text-base font-normal text-white/75">
            Exclusive clothes and sneakers. The biggest. The baddest. Champion Kicks is Kenya&apos;s
            house for verified heat — with branches in Nairobi and Eldoret.
          </p>
        </div>
      </section>

      <WhoWeAre />
      <VisionMission />

      <section className="ck-container grid gap-10 py-14 md:grid-cols-2">
        <div>
          <h2 className="font-display text-4xl">Our story</h2>
          <p className="mt-4 text-sm font-normal leading-relaxed text-[var(--ck-mute)]">
            Born from a love of sneakers and street fashion, Champion Kicks curates footwear and
            apparel for men, women, and kids. Walk into either branch for the drop, or shop online
            and talk to the team on WhatsApp.
          </p>
          <p className="mt-4 text-sm font-normal leading-relaxed text-[var(--ck-mute)]">
            Two doors, one standard: Nairobi at AA Plaza, JKUAT Towers, and Eldoret at Central
            Arcade (Jarde Collection). Call or WhatsApp {PHONE_DISPLAY}.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href={PHONE_TEL} className="ck-btn ck-btn-primary rounded-full px-5 text-sm">
              Call {PHONE_DISPLAY}
            </a>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noreferrer"
              className="ck-btn ck-btn-accent rounded-full px-5 text-sm"
            >
              WhatsApp us
            </a>
          </div>
        </div>
        <div
          className="min-h-[280px] rounded-[1.25rem] bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=1000&q=80')",
          }}
          role="img"
          aria-label="Sneaker lifestyle"
        />
      </section>

      <section className="bg-white/50 py-14">
        <div className="ck-container">
          <h2 className="font-display text-4xl">Our branches</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {BRANCHES.map((branch, i) => (
              <article key={branch.city} className={`ck-premium-card p-6 ${cardTone(i)}`}>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--ck-mute)]">
                  {branch.city}
                </p>
                <h3 className="mt-2 font-display text-3xl">{branch.name}</h3>
                {branch.detail && <p className="mt-1 text-sm text-[var(--ck-mute)]">{branch.detail}</p>}
                <Link to="/contact" className="mt-4 inline-block text-sm font-semibold hover:underline">
                  View map →
                </Link>
              </article>
            ))}
          </div>
          <p className="mt-6 text-sm text-[var(--ck-mute)]">
            Email{' '}
            <a className="font-semibold text-[var(--ck-ink)] underline" href={`mailto:${EMAIL}`}>
              {EMAIL}
            </a>
          </p>
        </div>
      </section>
    </div>
  )
}
