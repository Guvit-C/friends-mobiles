import { useState, useEffect } from 'react'
import { ChevronDown, ChevronUp, HelpCircle, Plus, MessageCircle } from 'lucide-react'
import { supabase } from '../lib/supabase'

function FAQItem({ faq }) {
    const [open, setOpen] = useState(false)

    return (
        <div
            style={{
                background: 'var(--clr-surface)',
                border: `1px solid ${open ? 'var(--clr-primary)' : 'var(--clr-border)'}`,
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                transition: 'border-color 0.3s'
            }}
        >
            <button
                onClick={() => setOpen(!open)}
                style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1.25rem 1.5rem',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    gap: '1rem',
                    textAlign: 'left'
                }}
            >
                <span style={{
                    fontWeight: '700',
                    fontSize: '1rem',
                    color: open ? 'var(--clr-primary-light)' : 'var(--clr-text)',
                    transition: 'color 0.2s',
                    userSelect: 'none'
                }}>
                    {faq.question}
                </span>
                <div style={{
                    width: '32px', height: '32px', flexShrink: 0,
                    borderRadius: '50%',
                    background: open ? 'rgba(22,163,74,0.15)' : 'var(--clr-surface-2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'background 0.2s'
                }}>
                    {open
                        ? <ChevronUp size={16} style={{ color: 'var(--clr-primary-light)' }} />
                        : <ChevronDown size={16} style={{ color: 'var(--clr-text-dim)' }} />
                    }
                </div>
            </button>
            {open && (
                <div style={{
                    padding: '0 1.5rem 1.5rem',
                    color: 'var(--clr-text-dim)',
                    lineHeight: 1.75,
                    fontSize: '0.95rem',
                    borderTop: '1px solid var(--clr-border)',
                    paddingTop: '1.25rem'
                }}>
                    {faq.answer}
                </div>
            )}
        </div>
    )
}

const defaultFaqs = [
    {
        id: 1,
        question: 'Do you deliver outside Punjab?',
        answer: 'No, we currently only deliver within Punjab. Our delivery network is optimized for delivery across all major cities and towns in Punjab, including Lahore, Rawalpindi, Faisalabad, Multan, Gujranwala, Sialkot, Bahawalpur, and surrounding areas. We are working on expanding our delivery coverage in the future, so stay tuned for updates!'
    },
    {
        id: 2,
        question: 'Do you offer discounts?',
        answer: 'Yes! We regularly offer discounts on our products. You can find discounted items on our website marked with a discount badge. We also run seasonal sales and special promotions. We recommend checking our website regularly or following us on social media to stay updated on the latest deals. Discounts are applied automatically at checkout — no coupon code needed.'
    },
    {
        id: 3,
        question: 'Can I visit your shop?',
        answer: 'Yes, you are most welcome to visit us in person! 📍 Visit us at: Friends Mobiles, Baghwalia Market, Chakwal, Near Chapar Bazar. We are open every day and our staff will be happy to assist you in choosing the perfect accessories for your devices. Visiting in person also lets you check the products before buying!'
    }
]

export default function FAQPage() {
    const [faqs, setFaqs] = useState(defaultFaqs)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchFaqs() {
            const { data, error } = await supabase
                .from('faqs')
                .select('*')
                .eq('is_active', true)
                .order('order_index', { ascending: true })
            if (!error && data && data.length > 0) {
                setFaqs(data)
            }
            setLoading(false)
        }
        fetchFaqs()
    }, [])

    return (
        <div className="page-wrapper">
            {/* Hero */}
            <div style={{
                background: 'var(--clr-surface)',
                borderBottom: '1px solid var(--clr-border)',
                paddingTop: '5rem',
                paddingBottom: '4rem',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div className="glow-orb" style={{ width: '400px', height: '400px', background: 'var(--clr-primary)', top: '-50%', left: '50%', transform: 'translateX(-50%)', opacity: 0.07 }} />
                <div className="container" style={{ position: 'relative' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
                        <div style={{
                            width: '64px', height: '64px', borderRadius: 'var(--radius-lg)',
                            background: 'rgba(22,163,74,0.12)',
                            border: '1px solid rgba(22,163,74,0.25)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            <HelpCircle size={28} style={{ color: 'var(--clr-primary-light)' }} />
                        </div>
                    </div>
                    <p className="section-label" style={{ textAlign: 'center' }}>Got questions?</p>
                    <h1 className="section-title" style={{ textAlign: 'center', margin: '0 auto 1rem' }}>Frequently Asked Questions</h1>
                    <p className="section-subtitle" style={{ margin: '0 auto', textAlign: 'center' }}>
                        Everything you need to know about Friends Mobiles and our services.
                    </p>
                </div>
            </div>

            <div className="container" style={{ paddingBlock: '4rem', maxWidth: '760px' }}>
                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
                        <div className="spinner" />
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {faqs.map(faq => (
                            <FAQItem key={faq.id} faq={faq} />
                        ))}
                    </div>
                )}

                {/* Contact CTA */}
                <div style={{
                    marginTop: '3rem',
                    padding: '2rem',
                    background: 'linear-gradient(135deg, var(--clr-surface), var(--clr-surface-2))',
                    border: '1px solid var(--clr-border)',
                    borderRadius: 'var(--radius-xl)',
                    textAlign: 'center'
                }}>
                    <MessageCircle size={32} style={{ color: 'var(--clr-primary-light)', marginBottom: '1rem' }} />
                    <h3 style={{ fontWeight: '700', marginBottom: '0.5rem', color: 'var(--clr-text)' }}>
                        Still have questions?
                    </h3>
                    <p style={{ color: 'var(--clr-text-dim)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                        Visit us at our shop in Chakwal or reach out to us directly.
                    </p>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875rem', color: 'var(--clr-primary-light)' }}>
                        📍 Friends Mobiles, Baghwalia Market, Chakwal, Near Chapar Bazar
                    </div>
                </div>
            </div>
        </div>
    )
}
