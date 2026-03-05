import { useState, useEffect } from 'react'
import { Plus, Trash2, Edit2, ArrowUp, ArrowDown } from 'lucide-react'
import { supabaseAdmin, supabase } from '../../lib/supabase'

export default function AdminSettings() {
    const [faqs, setFaqs] = useState([])
    const [loading, setLoading] = useState(true)
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [current, setCurrent] = useState(null)

    const [question, setQuestion] = useState('')
    const [answer, setAnswer] = useState('')
    const [isActive, setIsActive] = useState('true')

    const fetchFaqs = async () => {
        setLoading(true)
        const { data } = await supabaseAdmin.from('faqs').select('*').order('order_index', { ascending: true })
        if (data) setFaqs(data)
        setLoading(false)
    }

    useEffect(() => { fetchFaqs() }, [])

    const openNew = () => {
        setCurrent(null)
        setQuestion(''); setAnswer(''); setIsActive('true')
        setIsFormOpen(true)
    }

    const openEdit = (f) => {
        setCurrent(f.id)
        setQuestion(f.question); setAnswer(f.answer); setIsActive(f.is_active ? 'true' : 'false')
        setIsFormOpen(true)
    }

    const handleSave = async (e) => {
        e.preventDefault()
        const payload = {
            question, answer, is_active: isActive === 'true',
            order_index: current ? faqs.find(f => f.id === current).order_index : faqs.length
        }

        if (current) {
            await supabaseAdmin.from('faqs').update(payload).eq('id', current)
        } else {
            await supabaseAdmin.from('faqs').insert(payload)
        }
        setIsFormOpen(false)
        fetchFaqs()
    }

    const handleDelete = async (id) => {
        if (confirm('Are you sure you want to delete this FAQ?')) {
            await supabaseAdmin.from('faqs').delete().eq('id', id)
            fetchFaqs()
        }
    }

    const moveFaq = async (index, direction) => {
        if ((direction === -1 && index === 0) || (direction === 1 && index === faqs.length - 1)) return

        const newFaqs = [...faqs]
        const item = newFaqs[index]
        const sibling = newFaqs[index + direction]

        // Swap order_index
        const temp = item.order_index
        item.order_index = sibling.order_index
        sibling.order_index = temp

        setFaqs(newFaqs.sort((a, b) => a.order_index - b.order_index))

        await supabaseAdmin.from('faqs').update({ order_index: item.order_index }).eq('id', item.id)
        await supabaseAdmin.from('faqs').update({ order_index: sibling.order_index }).eq('id', sibling.id)
    }

    if (loading) return <div className="spinner" />

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--clr-text)' }}>Manage FAQs</h1>
                <button onClick={openNew} className="btn-primary">
                    <Plus size={16} /> Add FAQ
                </button>
            </div>

            {isFormOpen && (
                <div style={{
                    background: 'var(--clr-surface)', border: '1px solid var(--clr-border)',
                    borderRadius: 'var(--radius-lg)', padding: '2rem', marginBottom: '2rem'
                }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '1.5rem' }}>
                        {current ? 'Edit FAQ' : 'Create FAQ'}
                    </h2>
                    <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div>
                            <label>Question</label>
                            <input type="text" className="input" value={question} onChange={e => setQuestion(e.target.value)} required />
                        </div>
                        <div>
                            <label>Answer</label>
                            <textarea className="input" rows={4} value={answer} onChange={e => setAnswer(e.target.value)} required />
                        </div>
                        <div>
                            <label>Status</label>
                            <select className="input" value={isActive} onChange={e => setIsActive(e.target.value)}>
                                <option value="true">Active (Visible)</option>
                                <option value="false">Hidden</option>
                            </select>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                            <button type="submit" className="btn-primary">Save FAQ</button>
                            <button type="button" onClick={() => setIsFormOpen(false)} className="btn-outline" style={{ color: 'var(--clr-text-dim)', borderColor: 'var(--clr-text-dim)' }}>
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {faqs.map((faq, i) => (
                    <div key={faq.id} style={{
                        background: 'var(--clr-surface)', border: '1px solid var(--clr-border)',
                        borderRadius: 'var(--radius-md)', padding: '1.5rem',
                        display: 'flex', gap: '1.5rem', opacity: faq.is_active ? 1 : 0.6
                    }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                            <button onClick={() => moveFaq(i, -1)} disabled={i === 0} style={{ background: 'none', border: 'none', cursor: i === 0 ? 'not-allowed' : 'pointer', color: 'var(--clr-text-dim)' }}><ArrowUp size={16} /></button>
                            <button onClick={() => moveFaq(i, 1)} disabled={i === faqs.length - 1} style={{ background: 'none', border: 'none', cursor: i === faqs.length - 1 ? 'not-allowed' : 'pointer', color: 'var(--clr-text-dim)' }}><ArrowDown size={16} /></button>
                        </div>

                        <div style={{ flex: 1 }}>
                            <h3 style={{ fontWeight: '700', fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--clr-text)' }}>{faq.question}</h3>
                            <p style={{ color: 'var(--clr-text-dim)', fontSize: '0.9rem', lineHeight: 1.6 }}>{faq.answer}</p>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <button onClick={() => openEdit(faq)} className="btn-outline" style={{ padding: '0.5rem', borderColor: 'var(--clr-border)' }}><Edit2 size={16} /></button>
                            <button onClick={() => handleDelete(faq.id)} className="btn-outline" style={{ padding: '0.5rem', borderColor: 'var(--clr-border)', color: '#f87171' }}><Trash2 size={16} /></button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
