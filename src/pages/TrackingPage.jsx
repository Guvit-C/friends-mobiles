import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { Package, Truck, Clock, CheckCircle2, AlertCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

export default function TrackingPage() {
    const { user } = useAuth()
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!user) return

        async function fetchOrders() {
            setLoading(true)
            const { data, error } = await supabase
                .from('orders')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })

            if (!error && data) {
                setOrders(data)
            } else {
                console.error("Error fetching orders:", error)
            }
            setLoading(false)
        }

        fetchOrders()
    }, [user])

    if (!user) {
        return <Navigate to="/login" />
    }

    const formatPrice = (p) => `Rs. ${Math.round(p).toLocaleString()}`

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Processing': return <Clock size={16} />
            case 'Shipped': return <Truck size={16} />
            case 'Delivered': return <CheckCircle2 size={16} />
            case 'Cancelled': return <AlertCircle size={16} />
            default: return <Package size={16} />
        }
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'Processing': return { bg: 'rgba(201, 168, 76, 0.15)', color: '#C9A84C' } // Yellowish
            case 'Shipped': return { bg: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8' }     // Blue
            case 'Delivered': return { bg: 'rgba(34, 197, 94, 0.15)', color: '#22c55e' }    // Green
            case 'Cancelled': return { bg: 'rgba(239, 68, 68, 0.15)', color: '#ef4444' }    // Red
            default: return { bg: 'var(--clr-bg)', color: 'var(--clr-text-dim)' }
        }
    }

    return (
        <div className="page-wrapper" style={{ paddingBlock: '4rem 6rem' }}>
            <div className="container" style={{ maxWidth: '900px' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: '900', color: 'var(--clr-text)', marginBottom: '1rem' }}>
                    Order Tracking
                </h1>
                <p style={{ color: 'var(--clr-text-dim)', fontSize: '1.1rem', marginBottom: '3rem' }}>
                    Track the status of your recent orders.
                </p>

                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
                        <div className="spinner" />
                    </div>
                ) : orders.length === 0 ? (
                    <div style={{ textAlign: 'center', background: 'var(--clr-surface)', padding: '5rem 2rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--clr-border)' }}>
                        <Package size={64} style={{ color: 'var(--clr-text-dim)', opacity: 0.3, margin: '0 auto 1.5rem' }} />
                        <h2 style={{ color: 'var(--clr-text)', fontSize: '1.5rem', fontWeight: '800', marginBottom: '1rem' }}>No orders found</h2>
                        <p style={{ color: 'var(--clr-text-dim)', marginBottom: '2rem' }}>You haven't placed any orders yet.</p>
                        <Link to="/products" className="btn-primary" style={{ display: 'inline-flex' }}>Start Shopping</Link>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        {orders.map(order => {
                            const d = new Date(order.created_at)
                            const dateStr = d.toLocaleDateString('en-PK', { year: 'numeric', month: 'short', day: 'numeric' })
                            const sColors = getStatusColor(order.status)

                            return (
                                <div key={order.id} style={{
                                    background: 'var(--clr-surface)',
                                    border: '1px solid var(--clr-border)',
                                    borderRadius: 'var(--radius-xl)',
                                    overflow: 'hidden'
                                }}>
                                    {/* Order Header */}
                                    <div style={{
                                        padding: '1.5rem',
                                        background: 'var(--clr-bg)',
                                        borderBottom: '1px solid var(--clr-border)',
                                        display: 'flex', flexWrap: 'wrap', gap: '1.5rem', justifyContent: 'space-between', alignItems: 'flex-start'
                                    }}>
                                        <div>
                                            <div style={{ fontSize: '0.85rem', color: 'var(--clr-text-dim)', fontWeight: '600', marginBottom: '0.25rem' }}>ORDER PLACED</div>
                                            <div style={{ color: 'var(--clr-text)', fontWeight: '700' }}>{dateStr}</div>
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '0.85rem', color: 'var(--clr-text-dim)', fontWeight: '600', marginBottom: '0.25rem' }}>TOTAL</div>
                                            <div style={{ color: 'var(--clr-text)', fontWeight: '700' }}>{formatPrice(order.total_amount)}</div>
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '0.85rem', color: 'var(--clr-text-dim)', fontWeight: '600', marginBottom: '0.25rem' }}>ORDER #</div>
                                            <div style={{ color: 'var(--clr-text)', fontWeight: '700', fontFamily: 'var(--font-mono)', fontSize: '0.9rem' }}>{order.id.split('-')[0].toUpperCase()}</div>
                                        </div>
                                        <div style={{
                                            display: 'flex', alignItems: 'center', gap: '0.5rem',
                                            padding: '0.5rem 1rem', borderRadius: '99px',
                                            background: sColors.bg, color: sColors.color,
                                            fontWeight: '700', fontSize: '0.9rem'
                                        }}>
                                            {getStatusIcon(order.status)}
                                            {order.status}
                                        </div>
                                    </div>

                                    {/* Order Items */}
                                    <div style={{ padding: '1.5rem' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                            {order.items.map((item, idx) => (
                                                <div key={idx} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                                    <div style={{ width: '64px', height: '64px', borderRadius: 'var(--radius-sm)', background: 'var(--clr-bg)', overflow: 'hidden', flexShrink: 0 }}>
                                                        <img src={item.image_url} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                    </div>
                                                    <div style={{ flex: 1 }}>
                                                        <Link to={`/product/${item.id}`} style={{ fontWeight: '700', color: 'var(--clr-text)', textDecoration: 'none', display: 'block', marginBottom: '0.25rem' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--clr-primary-light)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--clr-text)'}>
                                                            {item.name}
                                                        </Link>
                                                        <div style={{ fontSize: '0.85rem', color: 'var(--clr-text-dim)' }}>
                                                            Qty: {item.qty} &nbsp;·&nbsp; {formatPrice(item.price)} each
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Footer details */}
                                    <div style={{ padding: '1rem 1.5rem', background: 'var(--clr-bg)', borderTop: '1px solid var(--clr-border)', fontSize: '0.85rem', color: 'var(--clr-text-dim)', display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                                        <div><strong style={{ color: 'var(--clr-text)' }}>Payment:</strong> {order.payment_method} {order.transaction_id ? `(TID: ${order.transaction_id})` : ''}</div>
                                        <div><strong style={{ color: 'var(--clr-text)' }}>Delivery To:</strong> {order.customer_info.name}, {order.customer_info.city}</div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}
