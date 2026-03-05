import { useEffect, useRef } from 'react'
import { X, Minus, Plus, ShoppingBag, Trash2, AlertCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

export default function CartDrawer() {
    const { cartItems, cartTotal, cartCount, cartOpen, setCartOpen, removeFromCart, updateQuantity } = useCart()
    const { user } = useAuth()
    const drawerRef = useRef(null)

    useEffect(() => {
        if (cartOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }
        return () => { document.body.style.overflow = '' }
    }, [cartOpen])

    if (!cartOpen) return null

    const formatPrice = (p) => `Rs. ${Math.round(p).toLocaleString()}`

    return (
        <>
            {/* Backdrop */}
            <div
                onClick={() => setCartOpen(false)}
                style={{
                    position: 'fixed', inset: 0, zIndex: 1500,
                    background: 'rgba(0,0,0,0.7)',
                    backdropFilter: 'blur(4px)'
                }}
            />

            {/* Drawer */}
            <div style={{
                position: 'fixed', top: 0, right: 0, bottom: 0,
                zIndex: 1501,
                width: '100%', maxWidth: '440px',
                background: 'var(--clr-surface)',
                borderLeft: '1px solid var(--clr-border)',
                display: 'flex', flexDirection: 'column',
                animation: 'slideFromRight 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards'
            }}>

                {/* Header */}
                <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '1.5rem',
                    borderBottom: '1px solid var(--clr-border)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <ShoppingBag size={20} style={{ color: 'var(--clr-primary-light)' }} />
                        <h2 style={{ fontWeight: '800', fontSize: '1.15rem', color: 'var(--clr-text)' }}>
                            Your Cart
                        </h2>
                        {cartCount > 0 && (
                            <span className="badge badge-green">{cartCount} items</span>
                        )}
                    </div>
                    <button
                        onClick={() => setCartOpen(false)}
                        style={{
                            background: 'var(--clr-surface-2)', border: 'none', cursor: 'pointer',
                            padding: '0.5rem', borderRadius: 'var(--radius-sm)',
                            color: 'var(--clr-text-muted)',
                            display: 'flex', alignItems: 'center'
                        }}
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Items */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '1rem 1.5rem' }}>
                    {!user ? (
                        <div style={{ textAlign: 'center', paddingTop: '4rem' }}>
                            <AlertCircle size={48} style={{ color: 'var(--clr-text-dim)', marginBottom: '1rem' }} />
                            <p style={{ color: 'var(--clr-text-dim)', marginBottom: '1.5rem' }}>
                                Please login to manage your cart
                            </p>
                            <Link
                                to="/login"
                                onClick={() => setCartOpen(false)}
                                className="btn-primary"
                            >
                                Login
                            </Link>
                        </div>
                    ) : cartItems.length === 0 ? (
                        <div style={{ textAlign: 'center', paddingTop: '4rem' }}>
                            <ShoppingBag size={64} style={{ color: 'var(--clr-text-dim)', marginBottom: '1rem', opacity: 0.3 }} />
                            <p style={{ color: 'var(--clr-text-dim)', marginBottom: '0.5rem', fontWeight: '600' }}>
                                Your cart is empty
                            </p>
                            <p style={{ color: 'var(--clr-text-dim)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                                Browse our products and add items
                            </p>
                            <Link to="/products" onClick={() => setCartOpen(false)} className="btn-primary">
                                Shop Now
                            </Link>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {cartItems.map(item => {
                                const p = item.products
                                if (!p) return null
                                const discountedPrice = p.discount_percent > 0
                                    ? p.price * (1 - p.discount_percent / 100)
                                    : p.price
                                return (
                                    <div key={item.id} style={{
                                        display: 'flex', gap: '1rem',
                                        padding: '1rem',
                                        background: 'var(--clr-surface-2)',
                                        borderRadius: 'var(--radius-md)',
                                        border: '1px solid var(--clr-border)'
                                    }}>
                                        <img
                                            src={p.image_url || `https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100`}
                                            alt={p.name}
                                            style={{
                                                width: '72px', height: '72px',
                                                borderRadius: 'var(--radius-sm)',
                                                objectFit: 'cover', flexShrink: 0
                                            }}
                                        />
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <p style={{ fontWeight: '700', fontSize: '0.9rem', color: 'var(--clr-text)', marginBottom: '0.2rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                {p.name}
                                            </p>
                                            <p style={{ fontSize: '0.75rem', color: 'var(--clr-text-dim)', fontFamily: 'var(--font-mono)', marginBottom: '0.5rem' }}>
                                                {p.brand}
                                            </p>
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        style={{
                                                            width: '26px', height: '26px', borderRadius: '50%',
                                                            background: 'var(--clr-surface)', border: '1px solid var(--clr-border)',
                                                            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                            color: 'var(--clr-text)'
                                                        }}
                                                    ><Minus size={12} /></button>
                                                    <span style={{ fontWeight: '700', fontSize: '0.875rem', minWidth: '20px', textAlign: 'center' }}>{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        style={{
                                                            width: '26px', height: '26px', borderRadius: '50%',
                                                            background: 'var(--clr-primary)', border: 'none',
                                                            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                            color: 'white'
                                                        }}
                                                    ><Plus size={12} /></button>
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    <span style={{ fontWeight: '800', color: 'var(--clr-primary-light)', fontSize: '0.9rem' }}>
                                                        {formatPrice(discountedPrice * item.quantity)}
                                                    </span>
                                                    <button
                                                        onClick={() => removeFromCart(item.id)}
                                                        style={{
                                                            background: 'none', border: 'none', cursor: 'pointer',
                                                            color: '#f87171', padding: '0.25rem',
                                                            transition: 'opacity 0.2s'
                                                        }}
                                                    ><Trash2 size={14} /></button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {user && cartItems.length > 0 && (
                    <div style={{
                        padding: '1.5rem',
                        borderTop: '1px solid var(--clr-border)',
                        background: 'var(--clr-surface-2)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                            <span style={{ color: 'var(--clr-text-dim)', fontWeight: '600' }}>Total</span>
                            <span style={{ fontWeight: '900', fontSize: '1.2rem', color: 'var(--clr-primary-light)' }}>
                                {formatPrice(cartTotal)}
                            </span>
                        </div>
                        <p style={{ fontSize: '0.75rem', color: 'var(--clr-text-dim)', marginBottom: '1rem', fontFamily: 'var(--font-mono)' }}>
                            Free delivery within Punjab · 3-day delivery
                        </p>
                        <button className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                            Place Order (WhatsApp)
                        </button>
                    </div>
                )}
            </div>

            <style>{`
        @keyframes slideFromRight {
          from { transform: translateX(100%); }
          to   { transform: translateX(0); }
        }
      `}</style>
        </>
    )
}
