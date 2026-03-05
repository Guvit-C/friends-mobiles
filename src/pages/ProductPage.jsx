import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
    ArrowLeft, ShoppingCart, Star, Package,
    Zap, Shield, Tag, ChevronRight
} from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import ProductCard from '../components/ProductCard'

export default function ProductPage() {
    const { id } = useParams()
    const { addToCart, setCartOpen } = useCart()
    const { user } = useAuth()
    const [product, setProduct] = useState(null)
    const [related, setRelated] = useState([])
    const [loading, setLoading] = useState(true)
    const [qty, setQty] = useState(1)
    const [addedMsg, setAddedMsg] = useState('')
    const [activeImage, setActiveImage] = useState(0)

    useEffect(() => {
        async function fetchProduct() {
            setLoading(true)
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .eq('id', id)
                .single()
            if (!error && data) {
                setProduct(data)
                // Fetch related
                const { data: rel } = await supabase
                    .from('products')
                    .select('*')
                    .eq('category_slug', data.category_slug)
                    .eq('is_active', true)
                    .neq('id', id)
                    .limit(4)
                if (rel) setRelated(rel)
            }
            setLoading(false)
        }
        fetchProduct()
        window.scrollTo(0, 0)
    }, [id])

    const handleAddToCart = async () => {
        if (!user) {
            window.location.href = '/login'
            return
        }
        const { error } = await addToCart(product, qty)
        if (!error) {
            setAddedMsg('Added to cart!')
            setTimeout(() => setAddedMsg(''), 2500)
            setCartOpen(true)
        }
    }

    if (loading) {
        return (
            <div className="page-wrapper" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
                <div className="spinner" />
            </div>
        )
    }

    if (!product) {
        return (
            <div className="page-wrapper" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '70vh', gap: '1rem' }}>
                <Package size={64} style={{ color: 'var(--clr-text-dim)', opacity: 0.3 }} />
                <p style={{ color: 'var(--clr-text-dim)', fontSize: '1.1rem' }}>Product not found</p>
                <Link to="/products" className="btn-primary">Browse Products</Link>
            </div>
        )
    }

    const discounted = product.discount_percent > 0
    const finalPrice = discounted ? product.price * (1 - product.discount_percent / 100) : product.price
    const formatPrice = (n) => `Rs. ${Math.round(n).toLocaleString()}`

    // Build image gallery
    const images = product.images?.length > 0
        ? product.images
        : [product.image_url || `https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80`]

    const categoryLabel = {
        headphones: 'Headphones',
        chargers: 'Chargers',
        adapters: 'Adapters',
        cables: 'Cables'
    }[product.category_slug] || product.category_slug

    return (
        <div className="page-wrapper">
            <div className="container" style={{ paddingBlock: '3rem' }}>
                {/* Breadcrumb */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', fontSize: '0.875rem', color: 'var(--clr-text-dim)' }}>
                    <Link to="/" style={{ color: 'var(--clr-text-dim)', textDecoration: 'none' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--clr-primary-light)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--clr-text-dim)'}>Home</Link>
                    <ChevronRight size={12} />
                    <Link to={`/category/${product.category_slug}`} style={{ color: 'var(--clr-text-dim)', textDecoration: 'none' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--clr-primary-light)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--clr-text-dim)'}>{categoryLabel}</Link>
                    <ChevronRight size={12} />
                    <span style={{ color: 'var(--clr-text)', fontWeight: '600' }}>{product.name}</span>
                </div>

                {/* Main product layout */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '3rem',
                    marginBottom: '5rem'
                }}>
                    {/* Left: Images */}
                    <div>
                        <div style={{
                            background: 'var(--clr-surface)',
                            border: '1px solid var(--clr-border)',
                            borderRadius: 'var(--radius-xl)',
                            overflow: 'hidden',
                            marginBottom: '1rem',
                            aspectRatio: '1'
                        }}>
                            <img
                                src={images[activeImage]}
                                alt={product.name}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        </div>
                        {images.length > 1 && (
                            <div style={{ display: 'flex', gap: '0.75rem' }}>
                                {images.map((img, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setActiveImage(i)}
                                        style={{
                                            width: '72px', height: '72px', borderRadius: 'var(--radius-sm)',
                                            overflow: 'hidden', border: `2px solid ${i === activeImage ? 'var(--clr-primary)' : 'var(--clr-border)'}`,
                                            cursor: 'pointer', background: 'none', padding: 0
                                        }}
                                    >
                                        <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right: Details */}
                    <div>
                        {/* Badge row */}
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                            <span className="badge badge-green">{categoryLabel}</span>
                            {discounted && <span className="badge badge-yellow" style={{ color: '#1a1a1a', fontWeight: '800' }}><Tag size={10} /> {product.discount_percent}% OFF</span>}
                            {product.stock > 0 ? (
                                <span className="badge badge-green"><Zap size={10} /> In Stock</span>
                            ) : (
                                <span className="badge badge-red">Out of Stock</span>
                            )}
                        </div>

                        <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontWeight: '900', color: 'var(--clr-text)', marginBottom: '0.5rem', lineHeight: 1.2 }}>
                            {product.name}
                        </h1>
                        <p style={{ fontFamily: 'var(--font-mono)', color: 'var(--clr-text-dim)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                            {product.brand}
                        </p>

                        {/* Price */}
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', marginBottom: '2rem' }}>
                            <span style={{ fontSize: '2.25rem', fontWeight: '900', color: 'var(--clr-primary-light)' }}>
                                {formatPrice(finalPrice)}
                            </span>
                            {discounted && (
                                <span style={{ fontSize: '1.1rem', color: 'var(--clr-text-dim)', textDecoration: 'line-through' }}>
                                    {formatPrice(product.price)}
                                </span>
                            )}
                        </div>

                        {/* Description */}
                        {product.description && (
                            <div style={{ marginBottom: '2rem' }}>
                                <h3 style={{ fontWeight: '700', marginBottom: '0.75rem', color: 'var(--clr-text)' }}>About this product</h3>
                                <p style={{ color: 'var(--clr-text-dim)', lineHeight: 1.7, fontSize: '0.95rem' }}>
                                    {product.description}
                                </p>
                            </div>
                        )}

                        {/* Specs */}
                        {product.specs && Object.keys(product.specs).length > 0 && (
                            <div style={{ marginBottom: '2rem' }}>
                                <h3 style={{ fontWeight: '700', marginBottom: '0.75rem', color: 'var(--clr-text)' }}>Specifications</h3>
                                <div style={{ display: 'grid', gap: '0.5rem' }}>
                                    {Object.entries(product.specs).map(([key, val]) => (
                                        <div key={key} style={{
                                            display: 'flex', justifyContent: 'space-between',
                                            padding: '0.625rem 0.875rem',
                                            background: 'var(--clr-surface)',
                                            borderRadius: 'var(--radius-sm)',
                                            border: '1px solid var(--clr-border)',
                                            fontSize: '0.875rem'
                                        }}>
                                            <span style={{ color: 'var(--clr-text-dim)', fontWeight: '500' }}>{key}</span>
                                            <span style={{ color: 'var(--clr-text)', fontWeight: '600' }}>{val}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Quantity + Cart */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                            <div style={{
                                display: 'flex', alignItems: 'center',
                                background: 'var(--clr-surface)',
                                border: '1px solid var(--clr-border)',
                                borderRadius: '99px',
                                padding: '0.25rem'
                            }}>
                                <button
                                    onClick={() => setQty(q => Math.max(1, q - 1))}
                                    style={{
                                        width: '36px', height: '36px', borderRadius: '50%',
                                        border: 'none', background: 'transparent',
                                        color: 'var(--clr-text)', cursor: 'pointer',
                                        fontSize: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center'
                                    }}
                                >−</button>
                                <span style={{ minWidth: '2rem', textAlign: 'center', fontWeight: '700', fontSize: '1rem', color: 'var(--clr-text)' }}>
                                    {qty}
                                </span>
                                <button
                                    onClick={() => setQty(q => q + 1)}
                                    style={{
                                        width: '36px', height: '36px', borderRadius: '50%',
                                        border: 'none', background: 'var(--clr-primary)',
                                        color: 'white', cursor: 'pointer',
                                        fontSize: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center'
                                    }}
                                >+</button>
                            </div>

                            <button
                                onClick={handleAddToCart}
                                disabled={product.stock === 0}
                                className="btn-primary"
                                style={{ flex: 1, justifyContent: 'center', minWidth: '180px', fontSize: '1rem', padding: '0.875rem 1.5rem' }}
                            >
                                <ShoppingCart size={18} />
                                {product.stock === 0 ? 'Out of Stock' : addedMsg || 'Add to Cart'}
                            </button>
                        </div>

                        {/* Trust items */}
                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                            {[
                                { icon: Shield, text: 'Genuine Product' },
                                { icon: Package, text: '3-Day Delivery' },
                                { icon: Star, text: 'Quality Assured' },
                            ].map(t => {
                                const I = t.icon
                                return (
                                    <div key={t.text} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--clr-text-dim)' }}>
                                        <I size={14} style={{ color: 'var(--clr-primary-light)' }} />
                                        {t.text}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>

                {/* Related products */}
                {related.length > 0 && (
                    <div>
                        <div className="divider" />
                        <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '2rem', color: 'var(--clr-text)' }}>
                            More in {categoryLabel}
                        </h2>
                        <div className="grid-products">
                            {related.map(p => <ProductCard key={p.id} product={p} />)}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
