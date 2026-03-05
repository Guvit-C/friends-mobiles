import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { supabase } from '../lib/supabase'
import ProductCard from '../components/ProductCard'

const ALL_CATEGORIES = ['headphones', 'chargers', 'adapters', 'cables']

export default function ProductsPage() {
    const [searchParams, setSearchParams] = useSearchParams()
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [sortBy, setSortBy] = useState('newest')
    const [selectedCat, setSelectedCat] = useState(searchParams.get('category') || 'all')
    const [filterDiscount, setFilterDiscount] = useState(searchParams.get('filter') === 'discounted')

    useEffect(() => {
        async function fetch() {
            setLoading(true)
            let query = supabase.from('products').select('*').eq('is_active', true)
            if (selectedCat !== 'all') query = query.eq('category_slug', selectedCat)
            if (filterDiscount) query = query.gt('discount_percent', 0)
            const { data } = await query
            if (data) {
                let sorted = [...data]
                if (sortBy === 'price-asc') sorted.sort((a, b) => a.price - b.price)
                if (sortBy === 'price-desc') sorted.sort((a, b) => b.price - a.price)
                if (sortBy === 'discount') sorted.sort((a, b) => b.discount_percent - a.discount_percent)
                if (sortBy === 'newest') sorted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                setProducts(sorted)
            }
            setLoading(false)
        }
        fetch()
    }, [selectedCat, sortBy, filterDiscount])

    const filterBtn = (active) => ({
        padding: '0.375rem 0.875rem',
        borderRadius: '99px',
        border: `1.5px solid ${active ? 'var(--clr-primary)' : 'var(--clr-border)'}`,
        background: active ? 'rgba(22,163,74,0.12)' : 'transparent',
        color: active ? 'var(--clr-primary-light)' : 'var(--clr-text-dim)',
        cursor: 'pointer',
        fontSize: '0.8rem',
        fontWeight: '600',
        fontFamily: 'var(--font-sans)',
        transition: 'all 0.2s',
        textTransform: 'capitalize'
    })

    return (
        <div className="page-wrapper">
            {/* Page header */}
            <div style={{
                background: 'var(--clr-surface)',
                borderBottom: '1px solid var(--clr-border)',
                paddingTop: '3rem',
                paddingBottom: '2.5rem'
            }}>
                <div className="container">
                    <p className="section-label">Explore our range</p>
                    <h1 className="section-title">All Products</h1>
                    <p className="section-subtitle">Browse our complete collection of mobile accessories</p>
                </div>
            </div>

            <div className="container" style={{ paddingBlock: '2.5rem' }}>
                {/* Filters */}
                <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem',
                    padding: '1rem 1.5rem',
                    background: 'var(--clr-surface)',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--clr-border)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--clr-text-dim)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <SlidersHorizontal size={14} style={{ color: 'var(--clr-primary-light)' }} /> Category:
                        </span>
                        <button style={filterBtn(selectedCat === 'all')} onClick={() => setSelectedCat('all')}>All</button>
                        {ALL_CATEGORIES.map(c => (
                            <button key={c} style={filterBtn(selectedCat === c)} onClick={() => setSelectedCat(c)}>
                                {c.charAt(0).toUpperCase() + c.slice(1)}
                            </button>
                        ))}
                        <button
                            onClick={() => setFilterDiscount(v => !v)}
                            style={filterBtn(filterDiscount)}
                        >
                            {filterDiscount && <X size={10} style={{ display: 'inline', marginRight: '0.25rem' }} />}
                            On Sale
                        </button>
                    </div>

                    <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                        style={{
                            background: 'var(--clr-surface-2)', border: '1.5px solid var(--clr-border)',
                            borderRadius: 'var(--radius-sm)', color: 'var(--clr-text)',
                            padding: '0.375rem 0.75rem', fontSize: '0.875rem',
                            fontFamily: 'var(--font-sans)', cursor: 'pointer', outline: 'none'
                        }}>
                        <option value="newest">Newest</option>
                        <option value="price-asc">Price: Low → High</option>
                        <option value="price-desc">Price: High → Low</option>
                        <option value="discount">Most Discounted</option>
                    </select>
                </div>

                <p style={{ fontSize: '0.875rem', color: 'var(--clr-text-dim)', marginBottom: '1.5rem', fontFamily: 'var(--font-mono)' }}>
                    {loading ? 'Loading...' : `${products.length} product${products.length !== 1 ? 's' : ''}`}
                </p>

                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '6rem' }}>
                        <div className="spinner" />
                    </div>
                ) : products.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '6rem 0' }}>
                        <Search size={64} style={{ color: 'var(--clr-text-dim)', opacity: 0.2, marginBottom: '1rem' }} />
                        <p style={{ color: 'var(--clr-text-dim)', fontSize: '1.1rem' }}>
                            No products found with these filters.
                        </p>
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
