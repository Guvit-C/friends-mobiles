import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

export default function ProductCard({ product }) {
    const { addToCart, setCartOpen } = useCart()
    const { user } = useAuth()

    if (!product) return null

    const discounted = product.discount_percent > 0
    const finalPrice = discounted
        ? product.price * (1 - product.discount_percent / 100)
        : product.price

    const formatPrice = (n) => `Rs. ${Math.round(n).toLocaleString()}`

    const handleAddToCart = async (e) => {
        e.preventDefault()
        e.stopPropagation()
        if (!user) {
            window.location.href = '/login'
            return
        }
        await addToCart(product)
        setCartOpen(true)
    }

    const imageUrl = product.image_url ||
        `https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80`

    return (
        <Link to={`/product/${product.id}`} className="product-card" style={{ position: 'relative' }}>
            {/* Discount badge */}
            {discounted && (
                <div style={{
                    position: 'absolute', top: '0.75rem', left: '0.75rem',
                    zIndex: 2,
                    padding: '0.25rem 0.6rem',
                    background: 'var(--clr-primary)',
                    color: 'white',
                    borderRadius: '99px',
                    fontSize: '0.7rem',
                    fontWeight: '800',
                    fontFamily: 'var(--font-mono)'
                }}>
                    -{product.discount_percent}%
                </div>
            )}

            {/* Out of stock */}
            {product.stock === 0 && (
                <div style={{
                    position: 'absolute', inset: 0, zIndex: 3,
                    background: 'rgba(0,0,0,0.6)',
                    borderRadius: 'inherit',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    <span style={{
                        background: 'rgba(239,68,68,0.9)',
                        color: 'white',
                        padding: '0.4rem 1rem',
                        borderRadius: '99px',
                        fontSize: '0.8rem',
                        fontWeight: '700'
                    }}>Out of Stock</span>
                </div>
            )}

            {/* Image */}
            <div style={{ overflow: 'hidden', background: 'var(--clr-surface-2)' }}>
                <img
                    src={imageUrl}
                    alt={product.name}
                    loading="lazy"
                    style={{ display: 'block' }}
                />
            </div>

            {/* Body */}
            <div className="product-card-body">
                <p className="product-card-name">{product.name}</p>
                <p className="product-card-brand">{product.brand}</p>

                <div className="product-card-price" style={{ marginBottom: '0.875rem' }}>
                    <span className="price">{formatPrice(finalPrice)}</span>
                    {discounted && (
                        <span className="original-price">{formatPrice(product.price)}</span>
                    )}
                </div>

                <button
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                    style={{
                        width: '100%',
                        padding: '0.6rem',
                        background: product.stock === 0 ? 'var(--clr-border)' : 'var(--clr-primary)',
                        color: 'white',
                        border: 'none',
                        borderRadius: 'var(--radius-md)',
                        fontWeight: '700',
                        fontSize: '0.85rem',
                        cursor: product.stock === 0 ? 'not-allowed' : 'pointer',
                        fontFamily: 'var(--font-sans)',
                        transition: 'background 0.25s, transform 0.2s'
                    }}
                    onMouseEnter={e => { if (product.stock !== 0) e.currentTarget.style.background = 'var(--clr-primary-dark)' }}
                    onMouseLeave={e => { if (product.stock !== 0) e.currentTarget.style.background = 'var(--clr-primary)' }}
                >
                    {product.stock === 0 ? 'Unavailable' : 'Add to Cart'}
                </button>
            </div>
        </Link>
    )
}
