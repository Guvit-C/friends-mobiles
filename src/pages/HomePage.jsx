import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowRight, Sparkles } from 'lucide-react'
import { DiagnosticShuffler, TelemetryTypewriter, CursorScheduler } from '../components/InteractiveFeatures'

gsap.registerPlugin(ScrollTrigger)

export default function HomePage() {
    const mainRef = useRef(null)

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Hero Intro Animation
            const tl = gsap.timeline()
            tl.fromTo('.hero-subtitle', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.2 })
                .fromTo('.hero-title-1', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'power3.out' }, '-=0.6')
                .fromTo('.hero-title-2', { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'power3.out' }, '-=0.8')
                .fromTo('.hero-cta', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }, '-=0.5')

            // Manifesto Reveal
            gsap.fromTo('.manifesto-line',
                { y: 50, opacity: 0 },
                { y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: 'power3.out', scrollTrigger: { trigger: '.manifesto-section', start: 'top 70%' } }
            )

            // Sticky Stacking Archive (Protocol)
            const cards = gsap.utils.toArray('.protocol-card')
            cards.forEach((card, i) => {
                ScrollTrigger.create({
                    trigger: card,
                    start: 'top top',
                    pin: true,
                    pinSpacing: false,
                    id: `pin-${i}`,
                    end: 'max',
                })

                if (i > 0) {
                    gsap.fromTo(cards[i - 1],
                        { scale: 1, filter: 'blur(0px)', opacity: 1 },
                        {
                            scale: 0.9, filter: 'blur(20px)', opacity: 0.4, ease: 'none', scrollTrigger: {
                                trigger: card,
                                start: 'top bottom',
                                end: 'top top',
                                scrub: true
                            }
                        }
                    )
                }
            })

            // Feature Cards Entrance
            gsap.fromTo('.artifact-card',
                { y: 60, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: 'power3.out', scrollTrigger: { trigger: '.features-grid', start: 'top 80%' } }
            )

        }, mainRef)
        return () => ctx.revert()
    }, [])

    return (
        <main ref={mainRef} style={{ background: 'var(--clr-bg)' }}>

            {/* ─── B. HERO SECTION ─── */}
            <section style={{ height: '80dvh', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'flex-end', paddingBottom: '10vh' }}>
                <div className="container" style={{ position: 'relative', zIndex: 10 }}>
                    <div style={{ maxWidth: '800px' }}>
                        <p className="hero-subtitle" style={{ fontFamily: 'var(--font-mono)', color: 'var(--clr-accent)', letterSpacing: '0.15em', textTransform: 'uppercase', fontSize: '0.85rem', marginBottom: '1.5rem', fontWeight: '600' }}>
                            <Sparkles size={14} style={{ display: 'inline', marginRight: '0.5rem', transform: 'translateY(-2px)' }} /> Friends Mobiles
                        </p>
                        <h1 style={{ color: 'var(--clr-text)', lineHeight: 0.95, margin: 0 }}>
                            <div className="hero-title-1" style={{ fontFamily: 'var(--font-sans)', fontWeight: '800', fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', letterSpacing: '-0.02em', color: 'var(--clr-primary)' }}>Premium accessories are the</div>
                            <div className="hero-title-2" style={{ fontFamily: 'var(--font-drama)', fontWeight: '600', fontStyle: 'italic', fontSize: 'clamp(3.5rem, 10vw, 7.5rem)', color: 'var(--clr-accent)' }}>Foundation.</div>
                        </h1>
                        <div className="hero-cta" style={{ marginTop: '2.5rem' }}>
                            <Link to="/products" className="btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem', background: 'var(--clr-primary)', color: 'white' }}>
                                Explore Collection <ArrowRight size={18} />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── C. FEATURES (Interactive Functional Artifacts) ─── */}
            <section style={{ paddingBlock: '8rem', background: 'var(--clr-bg)' }}>
                <div className="container">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '4rem', flexWrap: 'wrap', gap: '2rem' }}>
                        <div style={{ maxWidth: '500px' }}>
                            <h2 style={{ fontFamily: 'var(--font-sans)', fontWeight: '800', fontSize: '2.5rem', color: 'var(--clr-text)', lineHeight: 1.1, marginBottom: '1rem' }}>Engineered for precision.</h2>
                            <p style={{ color: 'var(--clr-text-muted)', fontSize: '1.1rem', lineHeight: 1.6 }}>We curate technology that enhances your biology and daily workflow. No compromises.</p>
                        </div>
                    </div>

                    <div className="features-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
                        {/* Card 1 - Headphones */}
                        <div className="artifact-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <DiagnosticShuffler />
                            <div>
                                <h3 style={{ fontFamily: 'var(--font-sans)', fontWeight: '800', fontSize: '1.5rem', color: 'var(--clr-text)', marginBottom: '0.5rem' }}>Acoustic Diagnostics</h3>
                                <p style={{ color: 'var(--clr-text-dim)', lineHeight: 1.6 }}>Immersive soundscapes and active noise cancellation optimized for deep cognitive focus.</p>
                            </div>
                        </div>

                        {/* Card 2 - Chargers */}
                        <div className="artifact-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <TelemetryTypewriter />
                            <div>
                                <h3 style={{ fontFamily: 'var(--font-sans)', fontWeight: '800', fontSize: '1.5rem', color: 'var(--clr-text)', marginBottom: '0.5rem' }}>Power Telemetry</h3>
                                <p style={{ color: 'var(--clr-text-dim)', lineHeight: 1.6 }}>GaN-powered rapid charging with intelligent thermal and voltage regulation.</p>
                            </div>
                        </div>

                        {/* Card 3 - Adapters/Cables */}
                        <div className="artifact-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <CursorScheduler />
                            <div>
                                <h3 style={{ fontFamily: 'var(--font-sans)', fontWeight: '800', fontSize: '1.5rem', color: 'var(--clr-text)', marginBottom: '0.5rem' }}>Protocol Sync</h3>
                                <p style={{ color: 'var(--clr-text-dim)', lineHeight: 1.6 }}>Universal data and power bridges engineered for uninterrupted digital continuity.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── D. PHILOSOPHY — "The Manifesto" ─── */}
            <section className="manifesto-section" style={{ position: 'relative', paddingBlock: '12rem', background: 'var(--clr-primary)', color: 'white', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?q=80&w=2000)', backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.15, mixBlendMode: 'overlay' }} />
                <div className="container" style={{ position: 'relative', zIndex: 10, textAlign: 'center', maxWidth: '900px' }}>
                    <p className="manifesto-line" style={{ fontFamily: 'var(--font-sans)', fontSize: '1.25rem', color: 'rgba(255,255,255,0.7)', marginBottom: '2rem', fontWeight: '500' }}>
                        Most electronics stores focus on: disposable volume.
                    </p>
                    <h2 className="manifesto-line" style={{ fontFamily: 'var(--font-sans)', fontSize: 'clamp(2rem, 5vw, 4rem)', fontWeight: '800', lineHeight: 1.1 }}>
                        We focus on: <span style={{ fontFamily: 'var(--font-drama)', fontStyle: 'italic', fontWeight: '600', color: 'var(--clr-accent)' }}>Longevity.</span>
                    </h2>
                </div>
            </section>

            {/* ─── E. PROTOCOL — "Sticky Stacking Archive" ─── */}
            <section style={{ background: 'var(--clr-bg)' }}>
                {
                    [
                        { id: '01', title: 'Curated Sourcing', desc: 'Every product is laboratory-tested for durability, thermal performance, and continuous data fidelity.' },
                        { id: '02', title: 'Accelerated Logistics', desc: 'Direct-to-consumer routing ensures your critical hardware arrives within 72 hours across Punjab.' },
                        { id: '03', title: 'Seamless Integration', desc: 'Plug into the ecosystem instantly. Hardware that disappears into your workflow.' },
                    ].map((step, index) => (
                        <div key={step.id} className="protocol-card" style={{ height: '100vh', display: 'flex', alignItems: 'center', background: 'var(--clr-bg)', transformOrigin: 'top center', borderBottom: index < 2 ? '1px solid var(--clr-border)' : 'none' }}>
                            <div className="container">
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
                                    <div style={{ position: 'relative', height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        {/* Abstract graphical representations per step */}
                                        {index === 0 && (
                                            <div style={{ width: '200px', height: '200px', border: '2px solid var(--clr-border)', borderRadius: '50px', transform: 'rotate(45deg)', position: 'relative' }}>
                                                <div style={{ position: 'absolute', inset: '20px', border: '1px solid var(--clr-accent)', borderRadius: '30px' }} />
                                            </div>
                                        )}
                                        {index === 1 && (
                                            <div style={{ width: '100%', height: '4px', background: 'var(--clr-border)', position: 'relative' }}>
                                                <div style={{ position: 'absolute', top: 0, left: '20%', width: '40%', height: '100%', background: 'var(--clr-primary)', animation: 'pulse 2s infinite' }} />
                                            </div>
                                        )}
                                        {index === 2 && (
                                            <div style={{ width: '140px', height: '140px', borderRadius: '50%', border: '4px solid var(--clr-primary-light)', position: 'relative' }}>
                                                <div style={{ position: 'absolute', inset: '-20px', border: '1px dashed var(--clr-border)', borderRadius: '50%', animation: 'spin 10s linear infinite' }} />
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.25rem', color: 'var(--clr-accent)', marginBottom: '1rem', fontWeight: 'bold' }}>// {step.id}</div>
                                        <h2 style={{ fontFamily: 'var(--font-sans)', fontSize: '3rem', fontWeight: '800', color: 'var(--clr-text)', marginBottom: '1.5rem', lineHeight: 1.1 }}>{step.title}</h2>
                                        <p style={{ color: 'var(--clr-text-dim)', fontSize: '1.25rem', lineHeight: 1.6 }}>{step.desc}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                }
            </section>

            {/* ─── F. FOOTER ─── */}
            <footer style={{ background: 'var(--clr-text)', color: 'white', borderRadius: '4rem 4rem 0 0', padding: '6rem 0 3rem', marginTop: '4rem' }}>
                <div className="container">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '4rem', paddingBottom: '4rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                        <div>
                            <h3 style={{ fontFamily: 'var(--font-sans)', fontWeight: '800', fontSize: '1.5rem', marginBottom: '1rem' }}>
                                Friends<span style={{ color: 'var(--clr-accent)' }}>Mobiles</span>
                            </h3>
                            <p style={{ color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, fontSize: '0.9rem' }}>Precision mobile accessories delivered with urgency.</p>
                            <div style={{ marginTop: '2rem', display: 'inline-flex', alignItems: 'center', gap: '0.75rem', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', background: 'rgba(255,255,255,0.05)', padding: '0.5rem 1rem', borderRadius: '99px' }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--clr-accent)', animation: 'pulse 2s infinite' }} />
                                SYSTEM OPERATIONAL
                            </div>
                        </div>
                        <div>
                            <h4 style={{ fontWeight: '700', marginBottom: '1.5rem', color: 'rgba(255,255,255,0.9)' }}>Navigation</h4>
                            {[{ path: '/products', label: 'All Products' }, { path: '/category/headphones', label: 'Acoustics' }, { path: '/category/chargers', label: 'Power' }, { path: '/category/adapters', label: 'Bridges' }].map(link => (
                                <Link key={link.path} to={link.path} style={{ display: 'block', color: 'rgba(255,255,255,0.6)', textDecoration: 'none', marginBottom: '0.75rem', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = 'var(--clr-accent)'} onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.6)'}>
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                        <div>
                            <h4 style={{ fontWeight: '700', marginBottom: '1.5rem', color: 'rgba(255,255,255,0.9)' }}>Legals</h4>
                            {[{ path: '/faq', label: 'FAQ' }, { path: '/delivery', label: 'Delivery Policy' }].map(link => (
                                <Link key={link.path} to={link.path} style={{ display: 'block', color: 'rgba(255,255,255,0.6)', textDecoration: 'none', marginBottom: '0.75rem', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = 'var(--clr-accent)'} onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.6)'}>
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                        <div>
                            <h4 style={{ fontWeight: '700', marginBottom: '1.5rem', color: 'rgba(255,255,255,0.9)' }}>Headquarters</h4>
                            <p style={{ color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, fontSize: '0.9rem' }}>
                                Baghwalia Market, Chakwal<br />
                                Near Chapar Bazar<br />
                                Punjab, Pakistan
                            </p>
                        </div>
                    </div>
                    <div style={{ paddingTop: '2rem', textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>
                        © {new Date().getFullYear()} Friends Mobiles. All rights reserved.
                    </div>
                </div>
            </footer>
        </main>
    )
}
