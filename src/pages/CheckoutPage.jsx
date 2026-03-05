import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ChevronRight, CreditCard, Truck, AlertCircle, CheckCircle2 } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

export default function CheckoutPage() {
    const { cart, cartTotal, clearCart } = useCart()
    const { user } = useAuth()
    const navigate = useNavigate()

    const [step, setStep] = useState(1) // 1: Shipping, 2: Payment, 3: Success
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const [shipping, setShipping] = useState({
        name: user?.user_metadata?.full_name || '',
        phone: '',
        address: '',
        city: 'Lahore'
    })

    const [paymentMethod, setPaymentMethod] = useState('COD')
    const [transactionId, setTransactionId] = useState('')

    const handleShippingSubmit = (e) => {
        e.preventDefault()
        if (!shipping.name || !shipping.phone || !shipping.address || !shipping.city) {
            setError('Please fill all shipping details.')
            return
        }
        setError('')
        setStep(2)
        window.scrollTo(0, 0)
    }

    const handlePlaceOrder = async () => {
        if (paymentMethod !== 'COD' && !transactionId.trim()) {
            setError('Please provide the Transaction ID for verification.')
            return
        }

        setLoading(true)
        setError('')

        try {
            const { data, error: insertError } = await supabase.from('orders').insert([{
                user_id: user?.id || null,
                customer_info: shipping,
                items: cart.map(item => ({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    qty: item.qty,
                    image_url: item.image_url
                })),
                total_amount: cartTotal,
                payment_method: paymentMethod,
                transaction_id: paymentMethod === 'COD' ? null : transactionId,
                status: 'Processing'
            }]).select().single()

            if (insertError) throw insertError

            await clearCart()
            setStep(3)
            window.scrollTo(0, 0)

        } catch (err) {
            console.error('Checkout error:', err)
            setError('Failed to place order. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    if (cart.length === 0 && step !== 3) {
        return (
            <div className="page-wrapper" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: '1rem' }}>
                <AlertCircle size={48} style={{ color: 'var(--clr-text-dim)' }} />
                <h2 style={{ color: 'var(--clr-text)' }}>Your cart is empty</h2>
                <Link to="/products" className="btn-primary">Return to Shop</Link>
            </div>
        )
    }

    return (
        <div className="page-wrapper" style={{ paddingBlock: '4rem 6rem' }}>
            <div className="container" style={{ maxWidth: '1000px' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: '900', color: 'var(--clr-text)', marginBottom: '2rem', textAlign: 'center' }}>Secure Checkout</h1>

                {step === 3 ? (
                    <div style={{ textAlign: 'center', background: 'var(--clr-surface)', padding: '4rem 2rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--clr-border)' }}>
                        <CheckCircle2 size={64} style={{ color: '#22c55e', margin: '0 auto 1.5rem' }} />
                        <h2 style={{ color: 'var(--clr-text)', fontSize: '2rem', fontWeight: '800', marginBottom: '1rem' }}>Order Placed Successfully!</h2>
                        <p style={{ color: 'var(--clr-text-dim)', fontSize: '1.1rem', marginBottom: '2rem', maxWidth: '500px', marginInline: 'auto' }}>
                            Thank you for shopping with Friends Mobiles. Your order is now being processed.
                        </p>
                        <Link to="/tracking" className="btn-primary" style={{ display: 'inline-flex' }}>Track Your Order</Link>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 350px', gap: '3rem', alignItems: 'start' }}>

                        {/* Left Column: Flow */}
                        <div>
                            {/* Steps Indicator */}
                            <div style={{ display: 'flex', gap: '1rem', marginBottom: '3rem' }}>
                                <div style={{ flex: 1, paddingBottom: '0.5rem', borderBottom: `3px solid ${step >= 1 ? 'var(--clr-primary)' : 'var(--clr-border)'}`, color: step >= 1 ? 'var(--clr-primary)' : 'var(--clr-text-dim)', fontWeight: '700', transition: 'all 0.3s' }}>
                                    1. Shipping
                                </div>
                                <div style={{ flex: 1, paddingBottom: '0.5rem', borderBottom: `3px solid ${step >= 2 ? 'var(--clr-primary)' : 'var(--clr-border)'}`, color: step >= 2 ? 'var(--clr-primary)' : 'var(--clr-text-dim)', fontWeight: '700', transition: 'all 0.3s' }}>
                                    2. Payment
                                </div>
                            </div>

                            {error && (
                                <div style={{ background: 'rgba(230, 59, 46, 0.1)', color: '#e63b2e', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', border: '1px solid rgba(230, 59, 46, 0.2)', fontSize: '0.9rem', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <AlertCircle size={16} /> {error}
                                </div>
                            )}

                            {step === 1 && (
                                <form onSubmit={handleShippingSubmit} style={{ background: 'var(--clr-surface)', border: '1px solid var(--clr-border)', padding: '2rem', borderRadius: 'var(--radius-xl)' }}>
                                    <h2 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '1.5rem', color: 'var(--clr-text)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Truck size={20} /> Shipping Details</h2>

                                    <div style={{ display: 'grid', gap: '1.25rem' }}>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: 'var(--clr-text-dim)', marginBottom: '0.5rem' }}>Full Name</label>
                                            <input type="text" value={shipping.name} onChange={e => setShipping({ ...shipping, name: e.target.value })} style={{ width: '100%', padding: '0.875rem', background: 'var(--clr-bg)', border: '1px solid var(--clr-border)', borderRadius: 'var(--radius-md)', color: 'var(--clr-text)', outline: 'none' }} required />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: 'var(--clr-text-dim)', marginBottom: '0.5rem' }}>Phone Number</label>
                                            <input type="tel" value={shipping.phone} onChange={e => setShipping({ ...shipping, phone: e.target.value })} placeholder="03XXXXXXXXX" style={{ width: '100%', padding: '0.875rem', background: 'var(--clr-bg)', border: '1px solid var(--clr-border)', borderRadius: 'var(--radius-md)', color: 'var(--clr-text)', outline: 'none' }} required />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: 'var(--clr-text-dim)', marginBottom: '0.5rem' }}>Delivery Address</label>
                                            <textarea value={shipping.address} onChange={e => setShipping({ ...shipping, address: e.target.value })} rows={3} style={{ width: '100%', padding: '0.875rem', background: 'var(--clr-bg)', border: '1px solid var(--clr-border)', borderRadius: 'var(--radius-md)', color: 'var(--clr-text)', outline: 'none', resize: 'vertical' }} required />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: 'var(--clr-text-dim)', marginBottom: '0.5rem' }}>City</label>
                                            <select value={shipping.city} onChange={e => setShipping({ ...shipping, city: e.target.value })} style={{ width: '100%', padding: '0.875rem', background: 'var(--clr-bg)', border: '1px solid var(--clr-border)', borderRadius: 'var(--radius-md)', color: 'var(--clr-text)', outline: 'none', appearance: 'none' }}>
                                                <option value="Lahore">Lahore</option>
                                                <option value="Rawalpindi">Rawalpindi</option>
                                                <option value="Faisalabad">Faisalabad</option>
                                                <option value="Multan">Multan</option>
                                                <option value="Gujranwala">Gujranwala</option>
                                                <option value="Sialkot">Sialkot</option>
                                                <option value="Bahawalpur">Bahawalpur</option>
                                                <option value="Chakwal">Chakwal</option>
                                                <option value="Other">Other (Punjab only)</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
                                        <button type="submit" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            Continue to Payment <ChevronRight size={16} />
                                        </button>
                                    </div>
                                </form>
                            )}

                            {step === 2 && (
                                <div style={{ background: 'var(--clr-surface)', border: '1px solid var(--clr-border)', padding: '2rem', borderRadius: 'var(--radius-xl)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                        <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--clr-text)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CreditCard size={20} /> Payment Method</h2>
                                        <button onClick={() => setStep(1)} style={{ background: 'none', border: 'none', color: 'var(--clr-text-dim)', fontSize: '0.875rem', cursor: 'pointer', textDecoration: 'underline' }}>Back to Shipping</button>
                                    </div>

                                    <div style={{ display: 'grid', gap: '1rem', marginBottom: '2rem' }}>
                                        {['COD', 'JazzCash', 'EasyPaisa'].map(method => (
                                            <label key={method} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', border: `2px solid ${paymentMethod === method ? 'var(--clr-primary)' : 'var(--clr-border)'}`, borderRadius: 'var(--radius-md)', cursor: 'pointer', background: paymentMethod === method ? 'var(--clr-bg)' : 'transparent', transition: 'all 0.2s' }}>
                                                <input type="radio" name="paymentMethod" value={method} checked={paymentMethod === method} onChange={(e) => setPaymentMethod(e.target.value)} style={{ accentColor: 'var(--clr-primary)', width: '18px', height: '18px' }} />
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ fontWeight: '700', color: 'var(--clr-text)' }}>{method === 'COD' ? 'Cash on Delivery' : method}</div>
                                                    {method === 'COD' && <div style={{ fontSize: '0.8rem', color: 'var(--clr-text-dim)' }}>Pay when you receive your order.</div>}
                                                </div>
                                            </label>
                                        ))}
                                    </div>

                                    {(paymentMethod === 'JazzCash' || paymentMethod === 'EasyPaisa') && (
                                        <div style={{ background: 'var(--clr-bg)', padding: '1.5rem', borderRadius: 'var(--radius-md)', marginBottom: '2rem', border: '1px solid var(--clr-border)' }}>
                                            <h4 style={{ color: 'var(--clr-text)', fontWeight: '700', marginBottom: '0.5rem' }}>Transfer Instructions</h4>
                                            <p style={{ color: 'var(--clr-text-dim)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                                                Please transfer <strong>Rs. {cartTotal.toLocaleString()}</strong> to the following {paymentMethod} account:
                                            </p>
                                            <div style={{ background: 'var(--clr-surface)', padding: '1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem', fontFamily: 'var(--font-mono)', fontSize: '1.1rem', color: 'var(--clr-primary)', fontWeight: '700', letterSpacing: '2px', textAlign: 'center', border: '1px dashed var(--clr-border)' }}>
                                                0300-1234567<br />
                                                <span style={{ fontSize: '0.8rem', color: 'var(--clr-text-dim)', letterSpacing: 'normal', fontFamily: 'var(--font-sans)', fontWeight: '500' }}>Account Title: Friends Mobiles</span>
                                            </div>
                                            <div>
                                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: 'var(--clr-text-dim)', marginBottom: '0.5rem' }}>Transaction ID (TID)</label>
                                                <input type="text" value={transactionId} onChange={e => setTransactionId(e.target.value)} placeholder="e.g. 01234567890" style={{ width: '100%', padding: '0.875rem', background: 'var(--clr-surface)', border: '1px solid var(--clr-border)', borderRadius: 'var(--radius-md)', color: 'var(--clr-text)', outline: 'none' }} />
                                                <p style={{ fontSize: '0.8rem', color: 'var(--clr-text-muted)', marginTop: '0.5rem' }}>You will receive a TID via SMS from {paymentMethod} after sending the money.</p>
                                            </div>
                                        </div>
                                    )}

                                    <button onClick={handlePlaceOrder} disabled={loading} className="btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', display: 'flex', justifyContent: 'center' }}>
                                        {loading ? <div className="spinner" style={{ width: '20px', height: '20px', borderWidth: '2px' }} /> : 'Confirm Order'}
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Right Column: Summary */}
                        <div style={{ background: 'var(--clr-surface)', border: '1px solid var(--clr-border)', padding: '1.5rem', borderRadius: 'var(--radius-xl)', position: 'sticky', top: '6rem' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '1.5rem', color: 'var(--clr-text)' }}>Order Summary</h3>
                            <div style={{ display: 'grid', gap: '1rem', marginBottom: '1.5rem' }}>
                                {cart.map(item => (
                                    <div key={item.id} style={{ display: 'flex', gap: '1rem' }}>
                                        <div style={{ width: '60px', height: '60px', borderRadius: 'var(--radius-sm)', overflow: 'hidden', background: 'var(--clr-bg)' }}>
                                            <img src={item.image_url} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--clr-text)', lineHeight: 1.2, marginBottom: '0.25rem' }}>{item.name}</div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--clr-text-dim)' }}>Qty: {item.qty}</div>
                                        </div>
                                        <div style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--clr-text)' }}>
                                            Rs. {(item.price * item.qty).toLocaleString()}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="divider" style={{ margin: '1.5rem 0' }} />
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', color: 'var(--clr-text-dim)', fontSize: '0.9rem' }}>
                                <span>Subtotal</span>
                                <span>Rs. {cartTotal.toLocaleString()}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', color: 'var(--clr-text-dim)', fontSize: '0.9rem' }}>
                                <span>Shipping</span>
                                <span>Free</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '1.25rem', fontWeight: '800', color: 'var(--clr-primary-light)' }}>
                                <span>Total</span>
                                <span>Rs. {cartTotal.toLocaleString()}</span>
                            </div>
                        </div>

                    </div>
                )}
            </div>

            <style>{`
            @media (max-width: 768px) {
                .container > div:last-child {
                    grid-template-columns: 1fr !important;
                }
                .container > div:last-child > div:last-child {
                    position: static !important;
                }
            }
            `}</style>
        </div>
    )
}
