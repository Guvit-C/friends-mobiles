import { useState, useEffect } from 'react'
import { Plus, Trash2, Edit2, Archive, CheckCircle } from 'lucide-react'
import { supabaseAdmin } from '../../lib/supabase'

export default function AdminProducts() {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    const [current, setCurrent] = useState(null) // null = create
    const [isFormOpen, setIsFormOpen] = useState(false)

    // Form state
    const [name, setName] = useState('')
    const [brand, setStockBrand] = useState('')
    const [price, setPrice] = useState('0')
    const [stock, setStock] = useState('10')
    const [category, setCategory] = useState('headphones')
    const [img, setImg] = useState('')
    const [isFeatured, setIsFeatured] = useState('false')
    const [desc, setDesc] = useState('')

    async function fetchProducts() {
        setLoading(true)
        const { data } = await supabaseAdmin.from('products').select('*').order('created_at', { ascending: false })
        if (data) setProducts(data)
        setLoading(false)
    }

    useEffect(() => { fetchProducts() }, [])

    const openNew = () => {
        setCurrent(null)
        setName(''); setStockBrand(''); setPrice('0'); setStock('10'); setCategory('headphones'); setImg(''); setDesc(''); setIsFeatured('false')
        setIsFormOpen(true)
    }

    const openEdit = (p) => {
        setCurrent(p.id)
        setName(p.name); setStockBrand(p.brand); setPrice(p.price); setStock(p.stock);
        setCategory(p.category_slug); setImg(p.image_url); setDesc(p.description || '');
        setIsFeatured(p.is_featured ? 'true' : 'false')
        setIsFormOpen(true)
    }

    const handleSave = async (e) => {
        e.preventDefault()
        setSaving(true)
        const payload = {
            name, brand, price: Number(price), stock: Number(stock),
            category_slug: category, image_url: img, description: desc,
            is_featured: isFeatured === 'true',
            is_active: true
        }

        if (current) {
            await supabaseAdmin.from('products').update(payload).eq('id', current)
        } else {
            await supabaseAdmin.from('products').insert(payload)
        }

        setIsFormOpen(false)
        setSaving(false)
        fetchProducts()
    }

    const toggleActive = async (id, isActive) => {
        await supabaseAdmin.from('products').update({ is_active: !isActive }).eq('id', id)
        fetchProducts()
    }

    if (loading) return <div className="spinner" />

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--clr-text)' }}>Products Manager</h1>
                <button onClick={openNew} className="btn-primary">
                    <Plus size={16} /> New Product
                </button>
            </div>

            {isFormOpen && (
                <div style={{
                    background: 'var(--clr-surface)', border: '1px solid var(--clr-border)',
                    borderRadius: 'var(--radius-lg)', padding: '2rem', marginBottom: '2rem'
                }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '1.5rem' }}>
                        {current ? 'Edit Product' : 'Create Product'}
                    </h2>
                    <form onSubmit={handleSave} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label>Name</label>
                            <input type="text" className="input" value={name} onChange={e => setName(e.target.value)} required />
                        </div>
                        <div>
                            <label>Brand</label>
                            <input type="text" className="input" value={brand} onChange={e => setStockBrand(e.target.value)} required />
                        </div>
                        <div>
                            <label>Price (Rs)</label>
                            <input type="number" className="input" value={price} onChange={e => setPrice(e.target.value)} required />
                        </div>
                        <div>
                            <label>Stock</label>
                            <input type="number" className="input" value={stock} onChange={e => setStock(e.target.value)} required />
                        </div>
                        <div>
                            <label>Category</label>
                            <select className="input" value={category} onChange={e => setCategory(e.target.value)}>
                                <option value="headphones">Headphones</option>
                                <option value="chargers">Chargers</option>
                                <option value="adapters">Adapters</option>
                                <option value="cables">Cables</option>
                            </select>
                        </div>
                        <div>
                            <label>Featured (Shows on Home)</label>
                            <select className="input" value={isFeatured} onChange={e => setIsFeatured(e.target.value)}>
                                <option value="false">No</option>
                                <option value="true">Yes</option>
                            </select>
                        </div>
                        <div style={{ gridColumn: 'span 2' }}>
                            <label>Image URL</label>
                            <input type="url" className="input" value={img} onChange={e => setImg(e.target.value)} required />
                        </div>
                        <div style={{ gridColumn: 'span 2' }}>
                            <label>Description</label>
                            <textarea className="input" rows={3} value={desc} onChange={e => setDesc(e.target.value)} />
                        </div>

                        <div style={{ gridColumn: 'span 2', display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                            <button type="submit" disabled={saving} className="btn-primary">
                                {saving ? 'Saving...' : 'Save Product'}
                            </button>
                            <button type="button" onClick={() => setIsFormOpen(false)} className="btn-outline" style={{ color: 'var(--clr-text-dim)', borderColor: 'var(--clr-text-dim)' }}>
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Table */}
            <div style={{ background: 'var(--clr-surface)', border: '1px solid var(--clr-border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: 'var(--clr-surface-2)', color: 'var(--clr-text-dim)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            <th style={{ padding: '1rem 1.5rem', fontWeight: '600' }}>Product</th>
                            <th style={{ padding: '1rem 1.5rem', fontWeight: '600' }}>Price</th>
                            <th style={{ padding: '1rem 1.5rem', fontWeight: '600' }}>Stock</th>
                            <th style={{ padding: '1rem 1.5rem', fontWeight: '600' }}>Status</th>
                            <th style={{ padding: '1rem 1.5rem', fontWeight: '600', textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(p => (
                            <tr key={p.id} style={{ borderTop: '1px solid var(--clr-border)', opacity: p.is_active ? 1 : 0.5 }}>
                                <td style={{ padding: '1rem 1.5rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <img src={p.image_url} alt="" style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }} />
                                        <div>
                                            <div style={{ fontWeight: '700', fontSize: '0.9rem' }}>{p.name}</div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--clr-text-dim)' }}>{p.category_slug} · {p.brand}</div>
                                        </div>
                                    </div>
                                </td>
                                <td style={{ padding: '1rem 1.5rem', fontWeight: '600' }}>Rs. {p.price}</td>
                                <td style={{ padding: '1rem 1.5rem' }}>{p.stock}</td>
                                <td style={{ padding: '1rem 1.5rem' }}>
                                    <span className={`badge ${p.is_active ? 'badge-green' : 'badge-red'}`}>
                                        {p.is_active ? 'Active' : 'Archived'}
                                    </span>
                                </td>
                                <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                                    <button onClick={() => openEdit(p)} style={{ background: 'none', border: 'none', color: 'var(--clr-primary-light)', cursor: 'pointer', padding: '0.25rem', marginRight: '0.5rem' }}>
                                        <Edit2 size={16} />
                                    </button>
                                    <button onClick={() => toggleActive(p.id, p.is_active)} style={{ background: 'none', border: 'none', color: 'var(--clr-text-dim)', cursor: 'pointer', padding: '0.25rem' }}>
                                        {p.is_active ? <Archive size={16} /> : <CheckCircle size={16} />}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
