import { useEffect, useState } from 'react'
import { PackageSearch, Clock, Truck, CheckCircle2, AlertCircle, Eye, Search } from 'lucide-react'
import { supabase } from '../../lib/supabase'

export default function AdminOrders() {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedOrder, setSelectedOrder] = useState(null)
    const [updating, setUpdating] = useState(false)

    const fetchOrders = async () => {
        setLoading(true)
        const { data, error } = await supabase
            .from('orders')
            .select(`
                *,
                user:auth.users(email)
            `)
            .order('created_at', { ascending: false })

        if (!error && data) {
            setOrders(data)
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchOrders()
    }, [])

    const handleUpdateStatus = async (orderId, newStatus) => {
        setUpdating(true)
        const { error } = await supabase
            .from('orders')
            .update({ status: newStatus })
            .eq('id', orderId)

        if (!error) {
            if (selectedOrder && selectedOrder.id === orderId) {
                setSelectedOrder({ ...selectedOrder, status: newStatus })
            }
            setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o))
        }
        setUpdating(false)
    }

    const formatPrice = (p) => `Rs. ${Math.round(p).toLocaleString()}`

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Processing': return <Clock size={16} />
            case 'Shipped': return <Truck size={16} />
            case 'Delivered': return <CheckCircle2 size={16} />
            case 'Cancelled': return <AlertCircle size={16} />
            default: return <PackageSearch size={16} />
        }
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'Processing': return { bg: 'rgba(201, 168, 76, 0.15)', color: '#C9A84C' } // Yellowish
            case 'Shipped': return { bg: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8' }     // Blue
            case 'Delivered': return { bg: 'rgba(34, 197, 94, 0.15)', color: '#22c55e' }    // Green
            case 'Cancelled': return { bg: 'rgba(239, 68, 68, 0.15)', color: '#ef4444' }    // Red
            default: return { bg: 'var(--clr-surface)', color: 'var(--clr-text-dim)' }
        }
    }

    const filteredOrders = orders.filter(o => {
        const query = searchTerm.toLowerCase()
        return (
            o.id.toLowerCase().includes(query) ||
            o.customer_info.name.toLowerCase().includes(query) ||
            o.customer_info.phone.includes(query) ||
            (o.transaction_id && o.transaction_id.toLowerCase().includes(query))
        )
    })

    if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}><div className="spinner" /></div>

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--clr-text)' }}>Orders Management</h1>
            </div>

            <div style={{
                background: 'var(--clr-surface)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--clr-border)',
                overflow: 'hidden',
                marginBottom: '2rem'
            }}>
                {/* Header / Search */}
                <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--clr-border)', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
                        <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--clr-text-dim)' }} />
                        <input
                            type="text"
                            placeholder="Search by Order ID, Name, Phone, or TID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                width: '100%', padding: '0.875rem 1rem 0.875rem 2.875rem',
                                background: 'var(--clr-bg)', border: '1px solid var(--clr-border)',
                                borderRadius: 'var(--radius-md)', color: 'var(--clr-text)', outline: 'none'
                            }}
                        />
                    </div>
                </div>

                {/* Table */}
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ background: 'var(--clr-bg)', borderBottom: '1px solid var(--clr-border)', fontSize: '0.85rem', color: 'var(--clr-text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                <th style={{ padding: '1rem 1.5rem', fontWeight: '600' }}>Order ID</th>
                                <th style={{ padding: '1rem 1.5rem', fontWeight: '600' }}>Date</th>
                                <th style={{ padding: '1rem 1.5rem', fontWeight: '600' }}>Customer</th>
                                <th style={{ padding: '1rem 1.5rem', fontWeight: '600' }}>Payment</th>
                                <th style={{ padding: '1rem 1.5rem', fontWeight: '600' }}>Status</th>
                                <th style={{ padding: '1rem 1.5rem', fontWeight: '600', textAlign: 'right' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.length === 0 ? (
                                <tr>
                                    <td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: 'var(--clr-text-dim)' }}>
                                        No orders found.
                                    </td>
                                </tr>
                            ) : (
                                filteredOrders.map(order => {
                                    const d = new Date(order.created_at)
                                    const dateStr = d.toLocaleDateString('en-PK', { month: 'short', day: 'numeric', year: 'numeric' })
                                    const sColors = getStatusColor(order.status)
                                    const shortId = order.id.split('-')[0].toUpperCase()

                                    return (
                                        <tr key={order.id} style={{ borderBottom: '1px solid var(--clr-border)' }}>
                                            <td style={{ padding: '1rem 1.5rem', fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: 'var(--clr-text)', fontWeight: '600' }}>
                                                {shortId}
                                            </td>
                                            <td style={{ padding: '1rem 1.5rem', color: 'var(--clr-text-dim)', fontSize: '0.9rem' }}>
                                                {dateStr}
                                            </td>
                                            <td style={{ padding: '1rem 1.5rem' }}>
                                                <div style={{ color: 'var(--clr-text)', fontWeight: '600', fontSize: '0.95rem' }}>{order.customer_info.name}</div>
                                                <div style={{ color: 'var(--clr-text-dim)', fontSize: '0.8rem' }}>{order.customer_info.city}</div>
                                            </td>
                                            <td style={{ padding: '1rem 1.5rem' }}>
                                                <div style={{ color: 'var(--clr-text)', fontWeight: '600', fontSize: '0.9rem' }}>{order.payment_method}</div>
                                                {order.transaction_id && <div style={{ color: 'var(--clr-text-dim)', fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>TID: {order.transaction_id}</div>}
                                            </td>
                                            <td style={{ padding: '1rem 1.5rem' }}>
                                                <div style={{
                                                    display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                                                    padding: '0.25rem 0.75rem', borderRadius: '99px',
                                                    background: sColors.bg, color: sColors.color,
                                                    fontSize: '0.8rem', fontWeight: '700'
                                                }}>
                                                    {getStatusIcon(order.status)}
                                                    {order.status}
                                                </div>
                                            </td>
                                            <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                                                <button
                                                    onClick={() => setSelectedOrder(order)}
                                                    style={{
                                                        background: 'var(--clr-bg)', border: '1px solid var(--clr-border)',
                                                        color: 'var(--clr-text)', padding: '0.5rem', borderRadius: 'var(--radius-sm)',
                                                        cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                                                        transition: 'background 0.2s'
                                                    }}
                                                    onMouseEnter={e => e.currentTarget.style.background = 'var(--clr-border)'}
                                                    onMouseLeave={e => e.currentTarget.style.background = 'var(--clr-bg)'}
                                                >
                                                    <Eye size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Order Details Modal */}
            {selectedOrder && (
                <div style={{
                    position: 'fixed', inset: 0, zIndex: 2000,
                    background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
                }} onClick={() => setSelectedOrder(null)}>
                    <div style={{
                        background: 'var(--clr-surface)', border: '1px solid var(--clr-border)',
                        borderRadius: 'var(--radius-xl)', padding: '2rem', width: '100%', maxWidth: '700px',
                        maxHeight: '90vh', overflowY: 'auto', position: 'relative'
                    }} onClick={e => e.stopPropagation()}>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <div>
                                <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--clr-text)', marginBottom: '0.25rem' }}>
                                    Order details
                                </h2>
                                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: 'var(--clr-text-dim)' }}>
                                    {selectedOrder.id}
                                </p>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-end' }}>
                                <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--clr-text-dim)' }}>Update Status</label>
                                <select
                                    value={selectedOrder.status}
                                    onChange={(e) => handleUpdateStatus(selectedOrder.id, e.target.value)}
                                    disabled={updating}
                                    style={{
                                        padding: '0.5rem 1rem', background: 'var(--clr-bg)', border: '1px solid var(--clr-border)',
                                        borderRadius: 'var(--radius-md)', color: 'var(--clr-text)', outline: 'none',
                                        fontWeight: '600', cursor: 'pointer', opacity: updating ? 0.5 : 1
                                    }}
                                >
                                    <option value="Processing">Processing</option>
                                    <option value="Shipped">Shipped</option>
                                    <option value="Delivered">Delivered</option>
                                    <option value="Cancelled">Cancelled</option>
                                </select>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
                            {/* Customer Info */}
                            <div style={{ background: 'var(--clr-bg)', border: '1px solid var(--clr-border)', padding: '1.5rem', borderRadius: 'var(--radius-md)' }}>
                                <h3 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--clr-text)', marginBottom: '1rem', borderBottom: '1px solid var(--clr-border)', paddingBottom: '0.5rem' }}>Customer</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--clr-text-dim)' }}>
                                    <div><strong style={{ color: 'var(--clr-text)' }}>Name:</strong> {selectedOrder.customer_info.name}</div>
                                    <div><strong style={{ color: 'var(--clr-text)' }}>Phone:</strong> {selectedOrder.customer_info.phone}</div>
                                    <div><strong style={{ color: 'var(--clr-text)' }}>Address:</strong> {selectedOrder.customer_info.address}</div>
                                    <div><strong style={{ color: 'var(--clr-text)' }}>City:</strong> {selectedOrder.customer_info.city}</div>
                                </div>
                            </div>

                            {/* Payment Info */}
                            <div style={{ background: 'var(--clr-bg)', border: '1px solid var(--clr-border)', padding: '1.5rem', borderRadius: 'var(--radius-md)' }}>
                                <h3 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--clr-text)', marginBottom: '1rem', borderBottom: '1px solid var(--clr-border)', paddingBottom: '0.5rem' }}>Payment</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--clr-text-dim)' }}>
                                    <div><strong style={{ color: 'var(--clr-text)' }}>Method:</strong> {selectedOrder.payment_method}</div>
                                    <div><strong style={{ color: 'var(--clr-text)' }}>Amount:</strong> {formatPrice(selectedOrder.total_amount)}</div>
                                    {selectedOrder.transaction_id && (
                                        <div><strong style={{ color: 'var(--clr-text)' }}>TID:</strong> <span style={{ fontFamily: 'var(--font-mono)' }}>{selectedOrder.transaction_id}</span></div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Items */}
                        <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--clr-text)', marginBottom: '1rem' }}>Items Ordered</h3>
                        <div style={{ border: '1px solid var(--clr-border)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                            {selectedOrder.items.map((item, idx) => (
                                <div key={idx} style={{
                                    display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem',
                                    borderBottom: idx < selectedOrder.items.length - 1 ? '1px solid var(--clr-border)' : 'none',
                                    background: 'var(--clr-bg)'
                                }}>
                                    <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-sm)', overflow: 'hidden', background: 'var(--clr-surface)' }}>
                                        <img src={item.image_url} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: '600', color: 'var(--clr-text)' }}>{item.name}</div>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--clr-text-dim)' }}>
                                            Qty: {item.qty} · {formatPrice(item.price)} each
                                        </div>
                                    </div>
                                    <div style={{ fontWeight: '800', color: 'var(--clr-text)' }}>
                                        {formatPrice(item.price * item.qty)}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={() => setSelectedOrder(null)}
                            style={{ position: 'absolute', top: '2rem', right: '2rem', background: 'none', border: 'none', color: 'var(--clr-text-dim)', cursor: 'pointer', fontSize: '2rem', lineHeight: 1 }}
                        >
                            &times;
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
