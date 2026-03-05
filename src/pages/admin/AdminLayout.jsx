import { useEffect } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Users, Settings, LogOut, PackageSearch, Tag, ShoppingBag } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const navItems = [
    { p: '/admin/orders', l: 'Orders', i: ShoppingBag },
    { p: '/admin/products', l: 'Products', i: PackageSearch },
    { p: '/admin/discounts', l: 'Discounts', i: Tag },
    { p: '/admin/settings', l: 'Settings', i: Settings },
]

export default function AdminLayout() {
    const { user, isAdmin, signOut } = useAuth()
    const loc = useLocation()
    const nav = useNavigate()

    useEffect(() => {
        if (!user) nav('/login')
        else if (!isAdmin) nav('/')
    }, [user, isAdmin, nav])

    if (!user || !isAdmin) return null

    return (
        <div style={{ display: 'flex', minHeight: '100dvh', background: 'var(--clr-bg)' }}>
            {/* Sidebar */}
            <aside style={{
                width: '260px',
                background: 'var(--clr-surface)',
                borderRight: '1px solid var(--clr-border)',
                display: 'flex', flexDirection: 'column',
                padding: '2rem 1rem'
            }}>
                <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '3rem', paddingLeft: '0.5rem' }}>
                    <div style={{
                        width: '32px', height: '32px',
                        background: 'var(--clr-primary)',
                        borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: '900', color: 'white', fontSize: '1rem'
                    }}>F</div>
                    <div>
                        <span style={{ fontWeight: '800', fontSize: '1rem', color: 'var(--clr-text)', display: 'block', lineHeight: 1 }}>Friends</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--clr-primary-light)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Admin Control</span>
                    </div>
                </Link>

                <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {navItems.map(item => {
                        const Icon = item.i
                        const active = loc.pathname.startsWith(item.p)
                        return (
                            <Link key={item.p} to={item.p}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '0.75rem',
                                    padding: '0.75rem 1rem',
                                    borderRadius: 'var(--radius-md)',
                                    textDecoration: 'none',
                                    color: active ? 'white' : 'var(--clr-text-dim)',
                                    background: active ? 'var(--clr-primary)' : 'transparent',
                                    fontWeight: active ? '700' : '500',
                                    fontSize: '0.9rem',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <Icon size={18} style={{ opacity: active ? 1 : 0.7 }} />
                                {item.l}
                            </Link>
                        )
                    })}
                </nav>

                <div>
                    <div className="divider" style={{ margin: '1.5rem 0' }} />
                    <button
                        onClick={async () => { await signOut(); nav('/login') }}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '0.75rem',
                            width: '100%', padding: '0.75rem 1rem',
                            borderRadius: 'var(--radius-md)',
                            background: 'none', border: 'none', cursor: 'pointer',
                            color: '#f87171', fontWeight: '600', fontSize: '0.9rem',
                        }}
                    >
                        <LogOut size={18} /> Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main style={{ flex: 1, overflowY: 'auto', padding: '2.5rem' }}>
                <Outlet />
            </main>
        </div>
    )
}
