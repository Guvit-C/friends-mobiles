import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, SlidersHorizontal, X } from 'lucide-react'
import { supabase } from '../lib/supabase'
import ProductCard from '../components/ProductCard'

const categoryMeta = {
    headphones: {
        name: 'Headphones & Earphones',
        desc: 'From studio-grade over-ears to truly wireless earbuds — find your perfect sound.',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1400&q=80',
        slug: 'headphones'
    },
    chargers: {
        name: 'Chargers & Power',
        desc: 'Fast chargers, wall adapters, wireless pads — keep everything powered up.',
        image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=1400&q=80',
        slug: 'chargers'
    },
    adapters: {
        name: 'Adapters & Converters',
        desc: 'Universal adapters, OTG, HDMI, and more connectivity solutions.',
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1400&q=80',
        slug: 'adapters'
    },
    cables: {
        name: 'Cables & Connectors',
        desc: 'Braided, heavy-duty cables for USB-C, Lightning, Micro-USB and beyond.',
        image: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=1400&q=80',
        slug: 'cables'
    }
}

export default function CategoryPage() {
    const { slug } = useParams()
    const meta = categoryMeta[slug] || { name: slug, desc: '', image: '', slug }

    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [sortBy, setSortBy] = useState('newest')
    const [filterDiscount, setFilterDiscount] = useState(false)
    const [priceRange, setPriceRange] = useState([0, 50000])

    useEffect(() => {
        async function fetchProducts() {
            setLoading(true)
            let query = supabase
                .from('products')
                .select('*')
                .eq('category_slug', slug)
                .eq('is_active', true)

            if (filterDiscount) query = query.gt('discount_percent', 0)

            const { data, error } = await query
            if (!error && data) {
                let sorted = [...data]
                if (sortBy === 'price-asc') sorted.sort((a, b) => a.price - b.price)
                if (sortBy === 'price-desc') sorted.sort((a, b) => b.price - a.price)
                if (sortBy === 'discount') sorted.sort((a, b) => b.discount_percent - a.discount_percent)
                if (sortBy === 'newest') sorted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                setProducts(sorted)
            }
            setLoading(false)
        }
        fetchProducts()
    }, [slug, sortBy, filterDiscount])

    return (
        <div className="page-wrapper">
            {/* Hero */}
            <div style={{
                height: '340px',
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'flex-end',
                paddingBottom: '3rem'
            }}>
                <img src={meta.image} alt={meta.name}
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.3) saturate(0.5)' }}
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, var(--clr-bg) 0%, rgba(10,15,13,0.5) 60%, transparent 100%)' }} />
                <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                    <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--clr-text-muted)', textDecoration: 'none', fontSize: '0.875rem', marginBottom: '1rem', transition: 'color 0.2s' }}
                        onMouseEnter={e => e.currentTarget.style.color = 'var(--clr-primary-light)'}
                        onMouseLeave={e => e.currentTarget.style.color = 'var(--clr-text-muted)'}>
                        <ArrowLeft size={14} /> Back to Home
                    </Link>
                    <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 3rem)', fontWeight: '900', color: 'var(--clr-text)', marginBottom: '0.5rem' }}>{meta.name}</h1>
                    <p style={{ color: 'rgba(240,253,244,0.6)', fontSize: '1rem', maxWidth: '500px' }}>{meta.desc}</p>
                </div>
            </div>

            <div className="container" style={{ paddingBlock: '3rem' }}>
                {/* Filters bar */}
                <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem',
                    padding: '1rem 1.5rem',
                    background: 'var(--clr-surface)',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--clr-border)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--clr-text-dim)', fontSize: '0.875rem', fontWeight: '600' }}>
                            <SlidersHorizontal size={16} style={{ color: 'var(--clr-primary-light)' }} />
                            <span>Filters:</span>
                        </div>
                        <button
                            onClick={() => setFilterDiscount(!filterDiscount)}
                            style={{
                                padding: '0.375rem 0.875rem',
                                borderRadius: '99px',
                                border: `1.5px solid ${filterDiscount ? 'var(--clr-primary)' : 'var(--clr-border)'}`,
                                background: filterDiscount ? 'rgba(22,163,74,0.1)' : 'transparent',
                                color: filterDiscount ? 'var(--clr-primary-light)' : 'var(--clr-text-dim)',
                                cursor: 'pointer',
                                fontSize: '0.8rem',
                                fontWeight: '600',
                                fontFamily: 'var(--font-sans)',
                                transition: 'all 0.2s',
                                display: 'flex', alignItems: 'center', gap: '0.35rem'
                            }}
                        >
                            {filterDiscount && <X size={10} />}
                            On Sale
                        </button>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span style={{ fontSize: '0.875rem', color: 'var(--clr-text-dim)', fontWeight: '600' }}>Sort:</span>
                        <select
                            value={sortBy}
                            onChange={e => setSortBy(e.target.value)}
                            style={{
                                background: 'var(--clr-surface-2)',
                                border: '1.5px solid var(--clr-border)',
                                borderRadius: 'var(--radius-sm)',
                                color: 'var(--clr-text)',
                                padding: '0.375rem 0.75rem',
                                fontSize: '0.875rem',
                                fontFamily: 'var(--font-sans)',
                                cursor: 'pointer',
                                outline: 'none'
                            }}
                        >
                            <option value="newest">Newest</option>
                            <option value="price-asc">Price: Low → High</option>
                            <option value="price-desc">Price: High → Low</option>
                            <option value="discount">Most Discounted</option>
                        </select>
                    </div>
                </div>

                {/* Products count */}
                <p style={{ fontSize: '0.875rem', color: 'var(--clr-text-dim)', marginBottom: '1.5rem', fontFamily: 'var(--font-mono)' }}>
                    {loading ? 'Loading...' : `${products.length} product${products.length !== 1 ? 's' : ''} found`}
                </p>

                {/* Grid */}
                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '6rem' }}>
                        <div className="spinner" />
                    </div>
                ) : products.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '6rem 0' }}>
                        <p style={{ color: 'var(--clr-text-dim)', fontSize: '1.1rem', marginBottom: '1rem' }}>
                            No products found in this category yet.
                        </p>
                        <Link to="/products" className="btn-primary">Browse All Products</Link>
                    </div>
                ) : (
                    <div className="grid-products">
                        {products.map(p => <ProductCard key={p.id} product={p} />)}
                    </div>
                )}
            </div>
        </div>
    )
}
