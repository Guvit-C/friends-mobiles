import { Truck, Clock, MapPin, Package, CheckCircle, Shield } from 'lucide-react'

const steps = [
    { icon: Package, title: 'Place Your Order', desc: 'Browse our products and add items to your cart. Complete the order with your delivery details.' },
    { icon: CheckCircle, title: 'Order Confirmed', desc: 'We verify your order and prepare it for dispatch within 24 hours.' },
    { icon: Truck, title: 'Out for Delivery', desc: 'Your order is dispatched via our reliable logistics partners serving all of Punjab.' },
    { icon: MapPin, title: 'Delivered to You', desc: 'Your package arrives at your doorstep within 3 business days — safe and secure.' },
]

const cities = [
    'Lahore', 'Rawalpindi', 'Faisalabad', 'Multan', 'Gujranwala',
    'Sialkot', 'Bahawalpur', 'Sargodha', 'Sheikhupura', 'Jhang',
    'Chakwal', 'Attock', 'Jhelum', 'Gujrat', 'Mandi Bahauddin',
    'Hafizabad', 'Narowal', 'Toba Tek Singh', 'Vehari', 'Kasur',
    'Nankana Sahib', 'Chiniot', 'Okara', 'Pakpattan', 'Khanewal',
]

export default function DeliveryPage() {
    return (
        <div className="page-wrapper">
            {/* Hero */}
            <div style={{
                background: 'var(--clr-surface)',
                borderBottom: '1px solid var(--clr-border)',
                paddingTop: '5rem',
                paddingBottom: '4rem',
                position: 'relative',
                overflow: 'hidden',
                textAlign: 'center'
            }}>
                <div className="glow-orb" style={{ width: '500px', height: '500px', background: 'var(--clr-primary)', top: '-30%', left: '50%', transform: 'translateX(-50%)', opacity: 0.06 }} />
                <div className="container" style={{ position: 'relative' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
                        <div style={{
                            width: '72px', height: '72px', borderRadius: 'var(--radius-xl)',
                            background: 'rgba(22,163,74,0.12)',
                            border: '1px solid rgba(22,163,74,0.25)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            <Truck size={32} style={{ color: 'var(--clr-primary-light)' }} />
                        </div>
                    </div>
                    <p className="section-label" style={{ textAlign: 'center' }}>Delivery policy</p>
                    <h1 className="section-title" style={{ textAlign: 'center', margin: '0 auto 1rem' }}>Fast & Reliable Delivery</h1>
                    <p className="section-subtitle" style={{ margin: '0 auto', textAlign: 'center' }}>
                        We deliver your mobile accessories across Punjab within 3 business days.
                    </p>
                </div>
            </div>

            <div className="container" style={{ paddingBlock: '4rem' }}>
                {/* Highlight cards */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                    gap: '1.5rem',
                    marginBottom: '5rem'
                }}>
                    {[
                        { icon: Clock, val: '3 Days', lbl: 'Delivery Time' },
                        { icon: MapPin, val: 'Punjab', lbl: 'Coverage Area' },
                        { icon: Truck, val: 'Free', lbl: 'Delivery Charges' },
                        { icon: Shield, val: '100%', lbl: 'Safe Packaging' },
                    ].map(stat => {
                        const Icon = stat.icon
                        return (
                            <div key={stat.lbl} className="card" style={{
                                padding: '2rem', textAlign: 'center'
                            }}>
                                <div style={{
                                    width: '48px', height: '48px', margin: '0 auto 1rem',
                                    borderRadius: 'var(--radius-md)',
                                    background: 'rgba(22,163,74,0.1)',
                                    border: '1px solid rgba(22,163,74,0.2)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}>
                                    <Icon size={20} style={{ color: 'var(--clr-primary-light)' }} />
                                </div>
                                <div style={{ fontSize: '1.75rem', fontWeight: '900', color: 'var(--clr-primary-light)', lineHeight: 1 }}>{stat.val}</div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--clr-text-dim)', fontFamily: 'var(--font-mono)', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: '0.375rem' }}>{stat.lbl}</div>
                            </div>
                        )
                    })}
                </div>

                {/* How it works */}
                <div style={{ marginBottom: '5rem' }}>
                    <div style={{ marginBottom: '3rem' }}>
                        <p className="section-label">How it works</p>
                        <h2 className="section-title">From Order to Doorstep</h2>
                    </div>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                        gap: '1.5rem'
                    }}>
                        {steps.map((step, i) => {
                            const Icon = step.icon
                            return (
                                <div key={step.title} style={{
                                    background: 'var(--clr-surface)',
                                    border: '1px solid var(--clr-border)',
                                    borderRadius: 'var(--radius-xl)',
                                    padding: '2rem',
                                    position: 'relative'
                                }}>
                                    <div style={{
                                        position: 'absolute', top: '1.25rem', right: '1.25rem',
                                        width: '28px', height: '28px',
                                        borderRadius: '50%',
                                        background: 'rgba(22,163,74,0.1)',
                                        border: '1px solid rgba(22,163,74,0.2)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '0.7rem',
                                        fontFamily: 'var(--font-mono)',
                                        fontWeight: '700',
                                        color: 'var(--clr-primary-light)'
                                    }}>0{i + 1}</div>
                                    <div style={{
                                        width: '48px', height: '48px',
                                        borderRadius: 'var(--radius-md)',
                                        background: 'rgba(22,163,74,0.1)',
                                        border: '1px solid rgba(22,163,74,0.2)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        marginBottom: '1.25rem'
                                    }}>
                                        <Icon size={22} style={{ color: 'var(--clr-primary-light)' }} />
                                    </div>
                                    <h3 style={{ fontWeight: '700', marginBottom: '0.5rem', fontSize: '1rem', color: 'var(--clr-text)' }}>{step.title}</h3>
                                    <p style={{ color: 'var(--clr-text-dim)', fontSize: '0.875rem', lineHeight: 1.65 }}>{step.desc}</p>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Coverage */}
                <div>
                    <div style={{ marginBottom: '2rem' }}>
                        <p className="section-label">Delivery coverage</p>
                        <h2 className="section-title">Areas We Serve</h2>
                        <p className="section-subtitle">We deliver to all major cities and towns across Punjab.</p>
                    </div>
                    <div style={{
                        background: 'var(--clr-surface)',
                        border: '1px solid var(--clr-border)',
                        borderRadius: 'var(--radius-xl)',
                        padding: '2rem'
                    }}>
                        <div style={{
                            display: 'flex', flexWrap: 'wrap', gap: '0.625rem'
                        }}>
                            {cities.map(city => (
                                <span key={city} className="badge badge-green" style={{ padding: '0.375rem 0.875rem' }}>
                                    <MapPin size={10} /> {city}
                                </span>
                            ))}
                        </div>
                        <div className="divider" />
                        <p style={{ fontSize: '0.875rem', color: 'var(--clr-text-dim)', fontFamily: 'var(--font-mono)' }}>
                            ⚠️ Note: We do not deliver outside Punjab at this time.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
