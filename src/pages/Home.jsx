import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import Badge from '../components/Badge'
import Reveal from '../components/Reveal'
import WhoWeAre from '../components/WhoWeAre'
import { productsApi, testimonialsApi, normalizeProducts, normalizeTestimonial, unwrapList } from '../lib/api'
import { PRODUCT_CATEGORIES } from '../lib/categories'
import { cardTone } from '../lib/ui'

function lastThreePerCategory(products) {
  const sorted = [...products].sort((a, b) => Number(b.id || 0) - Number(a.id || 0))
  const result = []
  for (const cat of PRODUCT_CATEGORIES) {
    result.push(...sorted.filter((p) => p.category === cat.value).slice(0, 3))
  }
  if (result.length === 0) return sorted.slice(0, 6)
  return result
}

const stats = [
  { value: '2', label: 'Branches' },
  { value: 'NAIROBI', label: 'AA Plaza · JKUAT' },
  { value: 'ELDORET', label: 'Central Arcade' },
  { value: 'Call', label: '0727 091 597' },
]

const values = [
  {
    title: 'Authenticity',
    desc: 'Every pair is curated for real heat — no guesswork, no filler, just verified culture.',
  },
  {
    title: 'Street craft',
    desc: 'Sneakers and fits styled for Nairobi streets, late nights, and first-light sessions.',
  },
  {
    title: 'Community',
    desc: 'Men, women, and kids under one roof. Boutique energy with room for everyone.',
  },
  {
    title: 'Care',
    desc: 'From drop to doorstep, we treat the order like it is walking out of the store with you.',
  },
]

const audiences = [
  { title: 'Men', desc: 'Runners, classics, and statement silhouettes.', href: '/products?section=shoes&gender=men', image: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=900&q=80' },
  { title: 'Women', desc: 'Clean lines and weekend-ready sneakers.', href: '/products?section=shoes&gender=women', image: 'https://images.unsplash.com/photo-1515955656352-a1fa3ffc26e3?w=900&q=80' },
  { title: 'Kids', desc: 'Durable heat for the next generation.', href: '/products?category=kidsshoes', image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=900&q=80' },
  { title: 'Clothing', desc: 'Streetwear layers that complete the fit.', href: '/products?section=clothing', image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=900&q=80' },
  { title: 'New drops', desc: 'The latest arrivals, tagged as they land.', href: '/products', image: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=900&q=80' },
  { title: 'The boutique', desc: 'A Nairobi-rooted house of sneakers & style.', href: '/about', image: 'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=900&q=80' },
]

export default function Home() {
  const [products, setProducts] = useState([])
  const [testimonials, setTestimonials] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    let active = true
    ;(async () => {
      try {
        setLoading(true)
        const [prodRes, testRes] = await Promise.allSettled([
          productsApi.getAll(),
          testimonialsApi.getAll({ approved: 'true' }),
        ])
        if (!active) return
        if (prodRes.status === 'fulfilled') {
          setProducts(normalizeProducts(prodRes.value.data))
        } else {
          setError(prodRes.reason?.message || 'Failed to load products')
        }
        if (testRes.status === 'fulfilled') {
          const list = unwrapList(testRes.value.data, ['testimonials'])
            .map(normalizeTestimonial)
            .filter(Boolean)
            .slice(0, 3)
          setTestimonials(list)
        }
      } finally {
        if (active) setLoading(false)
      }
    })()
    return () => {
      active = false
    }
  }, [])

  const newArrivals = useMemo(() => lastThreePerCategory(products), [products])

  return (
    <div>
      <section className="relative overflow-hidden text-white">
        <div
          className="ck-parallax-layer absolute inset-0 bg-cover bg-center"
          style={{
            transform: `translateY(${scrollY * 0.28}px) scale(1.08)`,
            backgroundImage:
              "linear-gradient(120deg, rgba(11,11,11,0.78) 0%, rgba(11,11,11,0.42) 55%, rgba(11,11,11,0.2) 100%), url('https://images.unsplash.com/photo-1556906781-9a412961c28c?w=1800&q=80')",
          }}
        />
        <div className="ck-container relative grid min-h-[88vh] items-center gap-12 py-20 lg:grid-cols-2">
          <div className="hero-panel max-w-xl">
            <Badge>Est. Nairobi · Street boutique</Badge>
            <h1 className="mt-5 font-display text-5xl leading-[1.05] sm:text-6xl md:text-7xl">
              Exclusive clothes and sneakers
              <br />
              <span className="italic text-[var(--ck-accent)]">The biggest the baddest.</span>
            </h1>
            <p className="mt-5 max-w-md text-base font-normal leading-relaxed text-white/80 sm:text-lg">
              Champion Kicks is Kenya&apos;s sneaker and streetwear house — curated drops, verified
              fits, and a story that starts on Nairobi pavement.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/products" className="ck-btn ck-btn-accent rounded-full px-6">
                Explore Products
              </Link>
              <Link
                to="/about"
                className="ck-btn rounded-full border border-white/40 px-6 text-white hover:bg-white hover:text-[var(--ck-ink)]"
              >
                Our Story
              </Link>
            </div>
          </div>
          <div className="relative hidden min-h-[420px] lg:block" style={{ perspective: '1200px' }}>
            <div className="ck-float-3d absolute inset-8 overflow-hidden rounded-[1.6rem] shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1000&q=80"
                alt="Featured Champion Kicks sneaker"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--ck-accent)]">
                  The chapter
                </p>
                <p className="mt-1 font-display text-3xl">Walk like the city is watching.</p>
              </div>
            </div>
          </div>
        </div>
        <div className="relative border-t border-white/15 bg-black/45 backdrop-blur-sm">
          <div className="ck-container grid grid-cols-2 gap-4 py-6 text-center md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label}>
                <p className="font-display text-xl tracking-tight text-[var(--ck-accent)] sm:text-2xl md:text-3xl">
                  {stat.value}
                </p>
                <p className="mt-1 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-white/70">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="ck-container py-20">
        <div className="mb-10 flex items-end justify-between gap-4">
          <Reveal>
            <Badge>Fresh drops</Badge>
            <h2 className="mt-3 font-display text-4xl md:text-5xl">New arrivals</h2>
            <p className="mt-2 text-sm font-normal text-[var(--ck-mute)]">
              Latest additions per collection — hover to feel the pair in 3D.
            </p>
          </Reveal>
          <Link to="/products" className="ck-btn ck-btn-outline hidden rounded-full sm:inline-flex">
            View all
          </Link>
        </div>
        {loading && <p className="text-sm text-[var(--ck-mute)]">Loading products…</p>}
        {error && <p className="text-sm text-[var(--ck-danger)]">{error}</p>}
        {!loading && newArrivals.length === 0 && (
          <p className="ck-premium-card ck-card-accent p-6 text-sm text-[var(--ck-mute)]">
            No products yet. Start the backend on port 5000, then add items in Admin.
          </p>
        )}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {newArrivals.map((product, idx) => (
            <Reveal key={product.id || idx} delay={idx * 70}>
              <ProductCard product={product} showNewBadge />
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-white/50 py-20">
        <div className="ck-container">
          <Reveal className="mx-auto mb-10 max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--ck-mute)]">Who we dress</p>
            <h2 className="mt-2 font-display text-4xl md:text-5xl">Collections with a pulse</h2>
            <p className="mt-3 text-sm font-normal text-[var(--ck-mute)]">
              Step into a lane. Hover a card. The city answers back.
            </p>
          </Reveal>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {audiences.map((item, i) => (
              <Reveal key={item.title} delay={i * 70}>
                <Link to={item.href} className={`ck-premium-card ck-card-shine group block overflow-hidden ${cardTone(i)}`}>
                  <div className="relative h-52 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                    <p className="absolute bottom-4 left-5 font-display text-3xl text-white">{item.title}</p>
                  </div>
                  <div className="p-5">
                    <p className="text-sm font-normal text-[var(--ck-mute)]">{item.desc}</p>
                    <p className="mt-3 text-xs font-semibold uppercase tracking-[0.14em]">Explore →</p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <WhoWeAre showAboutLink />

      <section className="ck-container py-20">
        <Reveal className="mb-10 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--ck-mute)]">What drives us</p>
          <h2 className="mt-2 font-display text-4xl md:text-5xl">The Champion code</h2>
        </Reveal>
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {values.map((value, i) => (
            <Reveal key={value.title} delay={i * 80}>
              <article className={`ck-premium-card h-full p-6 ${cardTone(i)}`}>
                <p className="font-display text-4xl text-[var(--ck-mute)]">0{i + 1}</p>
                <h3 className="mt-3 font-display text-2xl">{value.title}</h3>
                <p className="mt-2 text-sm font-normal leading-relaxed text-[var(--ck-mute)]">{value.desc}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="ck-container grid items-center gap-10 py-10 lg:grid-cols-2 lg:py-16">
        <Reveal>
          <div className="overflow-hidden rounded-[1.4rem] shadow-lg">
            <img
              src="https://images.unsplash.com/photo-1552346154-21d32810aba3?w=1100&q=80"
              alt="Sneaker lifestyle"
              className="h-[420px] w-full object-cover"
            />
          </div>
        </Reveal>
        <Reveal delay={120}>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--ck-mute)]">Why Champion Kicks</p>
          <h2 className="mt-3 font-display text-4xl md:text-5xl">The story behind the sole</h2>
          <ul className="mt-6 space-y-5">
            {[
              ['Curated, not crowded', 'We edit the rack so every pair earns its place.'],
              ['Boutique service', 'Help with sizing, drops, and the last-mile of the fit.'],
              ['Built for Kenya', 'Local energy, local checkout, local pride on the box.'],
            ].map(([title, desc]) => (
              <li key={title} className="flex gap-3">
                <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-[var(--ck-accent)]" />
                <div>
                  <h3 className="font-display text-2xl">{title}</h3>
                  <p className="mt-1 text-sm font-normal text-[var(--ck-mute)]">{desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      <section className="bg-white/50 py-16">
        <div className="ck-container">
          <Reveal className="mb-8">
            <Badge>Voices</Badge>
            <h2 className="mt-3 font-display text-4xl">What the city says</h2>
          </Reveal>
          <div className="grid gap-5 md:grid-cols-3">
            {testimonials.length === 0 && (
              <p className="text-sm text-[var(--ck-mute)]">Customer stories appear here once approved.</p>
            )}
            {testimonials.map((t, i) => (
              <Reveal key={t.id} delay={i * 90}>
                <blockquote className={`ck-premium-card h-full p-6 ${cardTone(i)}`}>
                  <p className="font-display text-2xl leading-snug">&ldquo;{t.comment}&rdquo;</p>
                  <footer className="mt-4 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--ck-mute)]">
                    {t.username || 'Champion Kicks customer'} · {t.rating}/5
                  </footer>
                </blockquote>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[var(--ck-ink)] py-20 text-white">
        <div
          className="pointer-events-none absolute -right-16 top-0 h-64 w-64 rounded-full bg-[var(--ck-accent)]/20 blur-3xl"
          style={{ transform: `translateY(${scrollY * 0.08}px)` }}
        />
        <Reveal className="ck-container relative text-center">
          <h2 className="font-display text-4xl md:text-5xl">Ready for the next drop?</h2>
          <p className="mx-auto mt-4 max-w-xl text-base font-normal text-white/75">
            Browse the catalog or walk the story with us. Either way, leave louder than you arrived.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/products" className="ck-btn ck-btn-accent rounded-full px-8">
              Shop now
            </Link>
            <Link
              to="/contact"
              className="ck-btn rounded-full border border-white/40 px-8 text-white hover:bg-white hover:text-[var(--ck-ink)]"
            >
              Talk to us
            </Link>
          </div>
        </Reveal>
      </section>
    </div>
  )
}
