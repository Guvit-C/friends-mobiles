import { useState, useEffect } from 'react'
import { Plus, Trash2, Edit2 } from 'lucide-react'
import { supabaseAdmin, supabase } from '../../lib/supabase'

export default function AdminDiscounts() {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchAll() {
            setLoading('all')
            const { data } = await supabase.from('products').select('id, name, brand, price, discount_percent')
            if (data) setProducts(data)
            setLoading(false)
        }
        fetchAll()
    }, [])

    const handleUpdate = async (id, num) => {
        if (isNaN(num) || num < 0) num = 0
        if (num > 100) num = 100
        setProducts(prev => prev.map(p => p.id === id ? { ...p, discount_percent: num } : p))
        await supabaseAdmin.from('products').update({ discount_percent: num }).eq('id', id)
    }

    if (loading) return <div className="spinner" />

    return (
        <div>
            <h1 style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--clr-text)', marginBottom: '1rem' }}>Manage Discounts</h1>
            <p style={{ color: 'var(--clr-text-dim)', marginBottom: '2rem' }}>Set percentage discounts on specific products. Enter 0 to remove a discount.</p>

            <div style={{ background: 'var(--clr-surface)', border: '1px solid var(--clr-border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: 'var(--clr-surface-2)', color: 'var(--clr-text-dim)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            <th style={{ padding: '1rem 1.5rem', fontWeight: '600' }}>Product</th>
                            <th style={{ padding: '1rem 1.5rem', fontWeight: '600' }}>Original Price</th>
                            <th style={{ padding: '1rem 1.5rem', fontWeight: '600' }}>Discount %</th>
                            <th style={{ padding: '1rem 1.5rem', fontWeight: '600' }}>Final Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(p => {
                            const discounted = p.discount_percent > 0 ? p.price * (1 - p.discount_percent / 100) : p.price
                            return (
                                <tr key={p.id} style={{ borderTop: '1px solid var(--clr-border)' }}>
                                    <td style={{ padding: '1rem 1.5rem', fontWeight: '600' }}>{p.name} <span style={{ fontSize: '0.8rem', color: 'var(--clr-text-dim)', fontWeight: '400' }}>({p.brand})</span></td>
                                    <td style={{ padding: '1rem 1.5rem' }}>Rs. {p.price}</td>
                                    <td style={{ padding: '1rem 1.5rem' }}>
                                        <input
                                            type="number"
                                            className="input"
                                            value={p.discount_percent || 0}
                                            onChange={(e) => {
                                                const val = Number(e.target.value)
                                                setProducts(prev => prev.map(prod => prod.id === p.id ? { ...prod, discount_percent: val } : prod))
                                            }}
                                            onBlur={(e) => handleUpdate(p.id, Number(e.target.value))}
                                            style={{ width: '80px', padding: '0.5rem' }}
                                            min="0" max="100"
                                        />
                                    </td>
                                    <td style={{ padding: '1rem 1.5rem', color: p.discount_percent > 0 ? 'var(--clr-primary-light)' : 'var(--clr-text)' }}>
                                        Rs. {Math.round(discounted)}
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
