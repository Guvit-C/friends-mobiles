import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search as SearchIcon } from 'lucide-react'
import { supabase } from '../lib/supabase'
import ProductCard from '../components/ProductCard'

export default function SearchPage() {
    const [searchParams] = useSearchParams()
    const query = searchParams.get('q') || ''
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function doSearch() {
            if (!query.trim()) { setProducts([]); setLoading(false); return }
            setLoading(true)
            const { data } = await supabase
                .from('products')
                .select('*')
                .eq('is_active', true)
                .or(`name.ilike.%${query}%,brand.ilike.%${query}%,description.ilike.%${query}%,category_slug.ilike.%${query}%`)
            setProducts(data || [])
            setLoading(false)
        }
        doSearch()
    }, [query])

    return (
        <div className="page-wrapper">
            <div style={{ background: 'var(--clr-surface)', borderBottom: '1px solid var(--clr-border)', paddingTop: '3rem', paddingBottom: '2.5rem' }}>
                <div className="container">
                    <p className="section-label">Search results</p>
                    <h1 className="section-title" style={{ fontSize: '2rem' }}>
                        {query ? `Results for "${query}"` : 'Search Products'}
                    </h1>
                </div>
            </div>

            <div className="container" style={{ paddingBlock: '3rem' }}>
                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '6rem' }}>
                        <div className="spinner" />
                    </div>
                ) : !query ? (
                    <div style={{ textAlign: 'center', padding: '6rem 0' }}>
                        <SearchIcon size={64} style={{ color: 'var(--clr-text-dim)', opacity: 0.2, marginBottom: '1rem' }} />
                        <p style={{ color: 'var(--clr-text-dim)' }}>Enter a search term to find products</p>
                    </div>
                ) : products.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '6rem 0' }}>
                        <SearchIcon size={64} style={{ color: 'var(--clr-text-dim)', opacity: 0.2, marginBottom: '1rem' }} />
                        <p style={{ color: 'var(--clr-text-dim)', fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                            No products found for <strong style={{ color: 'var(--clr-text)' }}>"{query}"</strong>
                        </p>
                        <p style={{ color: 'var(--clr-text-dim)', fontSize: '0.875rem' }}>
                            Try searching for headphones, charger, USB-C, etc.
                        </p>
                    </div>
                ) : (
                    <>
                        <p style={{ fontSize: '0.875rem', color: 'var(--clr-text-dim)', marginBottom: '1.5rem', fontFamily: 'var(--font-mono)' }}>
                            {products.length} result{products.length !== 1 ? 's' : ''} for "{query}"
                        </p>
                        <div className="grid-products">
                            {products.map(p => <ProductCard key={p.id} product={p} />)}
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}
