import Reveal from './Reveal'

export default function VisionMission() {
  return (
    <section className="bg-white/50 py-16">
      <div className="ck-container grid gap-5 md:grid-cols-2">
        <Reveal>
          <article className="ck-premium-card ck-card-accent p-7">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--ck-ink)] font-display text-2xl text-[var(--ck-accent)]">
              01
            </div>
            <h3 className="font-display text-3xl">Our vision</h3>
            <p className="mt-3 text-sm font-normal leading-relaxed text-[var(--ck-mute)]">
              To be the Nairobi house people trust when they want sneakers that carry culture —
              not just another listing.
            </p>
          </article>
        </Reveal>
        <Reveal delay={100}>
          <article className="ck-premium-card ck-card-ink p-7">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--ck-accent)] font-display text-2xl text-[var(--ck-ink)]">
              02
            </div>
            <h3 className="font-display text-3xl">Our mission</h3>
            <p className="mt-3 text-sm font-normal leading-relaxed text-[var(--ck-mute)]">
              Curate authentic drops, present them beautifully, and make checkout feel as sharp
              as the pair you picked.
            </p>
          </article>
        </Reveal>
      </div>
    </section>
  )
}
