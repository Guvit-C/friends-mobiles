import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import {
    ShoppingCart, Search, User, Menu, X, LogOut,
    Headphones, Zap, Cable, Plug, ChevronDown, Settings
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

const categories = [
    { name: 'Headphones', icon: Headphones, path: '/category/headphones' },
    { name: 'Chargers', icon: Zap, path: '/category/chargers' },
    { name: 'Adapters', icon: Plug, path: '/category/adapters' },
    { name: 'Cables', icon: Cable, path: '/category/cables' },
]

export default function Navbar() {
    const { user, signOut, isAdmin } = useAuth()
    const { cartCount, setCartOpen } = useCart()
    const navigate = useNavigate()
    const location = useLocation()
    const isHomePage = location.pathname === '/'
    const isAdminRoute = location.pathname.startsWith('/admin')
    const [scrolled, setScrolled] = useState(false)

    if (isAdminRoute) return null;
    const [menuOpen, setMenuOpen] = useState(false)
    const [searchOpen, setSearchOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const [userMenuOpen, setUserMenuOpen] = useState(false)
    const searchRef = useRef(null)

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 80)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    useEffect(() => {
        if (searchOpen && searchRef.current) {
            searchRef.current.focus()
        }
    }, [searchOpen])

    const handleSearch = (e) => {
        e.preventDefault()
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
            setSearchOpen(false)
            setSearchQuery('')
        }
    }

    const handleSignOut = async () => {
        await signOut()
        setDropdownOpen(false)
        setUserMenuOpen(false)
        navigate('/')
    }

    const isDarkBackground = false; /* Image was removed from the home hero */
    const navTextColor = 'var(--clr-primary)';
    const navTextHover = 'var(--clr-accent)';

    return (
        <>
            <div style={{ position: 'fixed', top: scrolled ? '1rem' : '1.5rem', left: 0, right: 0, zIndex: 1000, display: 'flex', justifyContent: 'center', pointerEvents: 'none', transition: 'top 0.4s var(--transition)' }}>
                <nav
                    style={{
                        pointerEvents: 'auto',
                        transition: 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                        background: scrolled ? 'rgba(242, 240, 233, 0.75)' : 'transparent',
                        backdropFilter: scrolled ? 'blur(16px)' : 'none',
                        border: scrolled ? '1px solid rgba(46, 64, 54, 0.1)' : '1px solid transparent',
                        borderRadius: '99px',
                        padding: '0.4rem 0.75rem 0.4rem 1.25rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '2rem',
                        boxShadow: scrolled ? '0 10px 40px rgba(0,0,0,0.05)' : 'none',
                        color: navTextColor
                    }}
                >
                    {/* Logo */}
                    <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', color: navTextColor }}>
                        <span style={{
                            fontFamily: 'var(--font-sans)',
                            fontWeight: '800',
                            fontSize: '1.25rem',
                            letterSpacing: '-0.02em',
                            transition: 'color 0.4s var(--transition)'
                        }}>
                            Friends<span style={{ color: 'var(--clr-accent)' }}>Mobiles</span>
                        </span>
                    </Link>

                    {/* Desktop Nav Links */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} className="desktop-nav">
                        <div style={{ position: 'relative' }}>
                            <button
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                onMouseEnter={() => setDropdownOpen(true)}
                                style={{
                                    background: 'none', border: 'none', cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', gap: '0.25rem',
                                    color: navTextColor, padding: '0.5rem',
                                    borderRadius: '99px', fontSize: '0.9rem', fontWeight: '600',
                                    transition: 'color 0.2s', fontFamily: 'var(--font-sans)',
                                }}
                                onMouseLeave={e => { e.currentTarget.style.color = navTextColor }}
                            >
                                Products <ChevronDown size={14} />
                            </button>
                            {dropdownOpen && (
                                <div
                                    onMouseLeave={() => setDropdownOpen(false)}
                                    style={{
                                        position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)',
                                        background: 'var(--clr-surface)',
                                        border: '1px solid var(--clr-border)',
                                        borderRadius: 'var(--radius-lg)',
                                        padding: '0.75rem',
                                        minWidth: '220px',
                                        boxShadow: 'var(--shadow-card)',
                                        zIndex: 100,
                                        marginTop: '1rem',
                                        color: 'var(--clr-text)'
                                    }}
                                >
                                    {categories.map(cat => {
                                        const Icon = cat.icon
                                        return (
                                            <Link
                                                key={cat.path}
                                                to={cat.path}
                                                onClick={() => setDropdownOpen(false)}
                                                style={{
                                                    display: 'flex', alignItems: 'center', gap: '0.75rem',
                                                    padding: '0.75rem',
                                                    borderRadius: 'var(--radius-md)',
                                                    textDecoration: 'none',
                                                    color: 'var(--clr-text)',
                                                    fontSize: '0.9rem', fontWeight: '500',
                                                    transition: 'all 0.2s'
                                                }}
                                                onMouseEnter={e => { e.currentTarget.style.background = 'var(--clr-bg)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
                                                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.transform = 'translateY(0)' }}
                                            >
                                                <Icon size={16} style={{ color: 'var(--clr-primary)' }} />
                                                {cat.name}
                                            </Link>
                                        )
                                    })}
                                    <div className="divider" style={{ margin: '0.5rem 0' }} />
                                    <Link
                                        to="/products"
                                        onClick={() => setDropdownOpen(false)}
                                        style={{
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            padding: '0.75rem',
                                            borderRadius: 'var(--radius-md)',
                                            textDecoration: 'none',
                                            color: 'white',
                                            background: 'var(--clr-primary)',
                                            fontSize: '0.85rem', fontWeight: '600',
                                            transition: 'transform 0.2s'
                                        }}
                                        className="btn-primary"
                                    >
                                        View All Products
                                    </Link>
                                </div>
                            )}
                        </div>

                        {[
                            { label: 'Delivery', path: '/delivery' },
                            { label: 'FAQ', path: '/faq' },
                        ].map(link => (
                            <Link
                                key={link.path}
                                to={link.path}
                                style={{
                                    textDecoration: 'none',
                                    color: navTextColor,
                                    padding: '0.5rem 0.75rem',
                                    borderRadius: '99px',
                                    fontSize: '0.9rem', fontWeight: '600',
                                    transition: 'color 0.2s'
                                }}
                                onMouseEnter={e => e.currentTarget.style.color = navTextHover}
                                onMouseLeave={e => e.currentTarget.style.color = navTextColor}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Right controls */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <button
                            onClick={() => setSearchOpen(true)}
                            style={{
                                background: 'transparent', border: 'none', cursor: 'pointer',
                                padding: '0.5rem', borderRadius: '50%',
                                color: navTextColor,
                                transition: 'transform 0.2s',
                                display: 'flex', alignItems: 'center'
                            }}
                            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
                            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                        >
                            <Search size={18} />
                        </button>

                        <button
                            onClick={() => user ? setCartOpen(true) : navigate('/login')}
                            style={{
                                background: 'transparent', border: 'none', cursor: 'pointer',
                                padding: '0.5rem', borderRadius: '50%',
                                color: navTextColor,
                                transition: 'transform 0.2s',
                                display: 'flex', alignItems: 'center',
                                position: 'relative'
                            }}
                            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
                            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                        >
                            <ShoppingCart size={18} />
                            {cartCount > 0 && (
                                <span style={{
                                    position: 'absolute', top: '-1px', right: '-1px',
                                    background: 'var(--clr-accent)',
                                    color: 'white', borderRadius: '50%',
                                    width: '16px', height: '16px',
                                    fontSize: '0.6rem', fontWeight: '800',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontFamily: 'var(--font-mono)'
                                }}>
                                    {cartCount}
                                </span>
                            )}
                        </button>

                        {user ? (
                            <div style={{ position: 'relative' }}>
                                <button
                                    onClick={() => setUserMenuOpen(v => !v)}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '0.5rem',
                                        background: 'var(--clr-primary)',
                                        border: '1px solid transparent',
                                        borderRadius: '99px',
                                        padding: '0.4rem 1rem',
                                        cursor: 'pointer',
                                        color: 'white',
                                        fontSize: '0.85rem', fontWeight: '600',
                                        fontFamily: 'var(--font-sans)',
                                        transition: 'all 0.3s',
                                        marginLeft: '0.5rem'
                                    }}
                                >
                                    <User size={14} />
                                    {user.user_metadata?.full_name?.split(' ')[0] || user.email?.split('@')[0]}
                                </button>
                                {userMenuOpen && (
                                    <div
                                        onMouseLeave={() => setUserMenuOpen(false)}
                                        style={{
                                            position: 'absolute', top: '100%', right: 0,
                                            background: 'var(--clr-surface)',
                                            border: '1px solid var(--clr-border)',
                                            borderRadius: 'var(--radius-lg)',
                                            padding: '0.75rem',
                                            minWidth: '220px',
                                            boxShadow: 'var(--shadow-card)',
                                            zIndex: 100,
                                            marginTop: '0.5rem',
                                            color: 'var(--clr-text)'
                                        }}
                                    >
                                        <div style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem', color: 'var(--clr-text-dim)', borderBottom: '1px solid var(--clr-border)', marginBottom: '0.5rem' }}>
                                            Logged in as<br /><strong style={{ color: 'var(--clr-text)' }}>{user.email}</strong>
                                        </div>
                                        {isAdmin && (
                                            <Link
                                                to="/admin"
                                                onClick={() => setUserMenuOpen(false)}
                                                style={{
                                                    display: 'flex', alignItems: 'center', gap: '0.75rem',
                                                    padding: '0.75rem', borderRadius: 'var(--radius-md)', textDecoration: 'none', color: 'var(--clr-text)', fontSize: '0.9rem', fontWeight: '500',
                                                    transition: 'all 0.2s'
                                                }}
                                                onMouseEnter={e => e.currentTarget.style.background = 'var(--clr-bg)'}
                                                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                            >
                                                <Settings size={16} style={{ color: 'var(--clr-primary)' }} />
                                                Admin Dashboard
                                            </Link>
                                        )}
                                        <button
                                            onClick={handleSignOut}
                                            style={{
                                                display: 'flex', alignItems: 'center', gap: '0.75rem',
                                                padding: '0.75rem', width: '100%', borderRadius: 'var(--radius-md)', border: 'none', background: 'transparent', color: '#e63b2e', fontSize: '0.9rem', fontWeight: '600', cursor: 'pointer', textAlign: 'left',
                                                transition: 'all 0.2s'
                                            }}
                                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(230, 59, 46, 0.1)'}
                                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                        >
                                            <LogOut size={16} />
                                            Sign Out
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link to="/login" style={{
                                background: 'var(--clr-primary)',
                                border: '1px solid transparent',
                                color: 'white',
                                padding: '0.4rem 1.25rem',
                                borderRadius: '99px',
                                fontSize: '0.85rem', fontWeight: '600',
                                textDecoration: 'none', marginLeft: '0.5rem',
                                transition: 'all 0.3s'
                            }}>
                                Login
                            </Link>
                        )}

                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="mobile-menu-btn"
                            style={{
                                background: 'transparent', border: 'none', cursor: 'pointer',
                                padding: '0.5rem', color: navTextColor,
                                display: 'none'
                            }}
                        >
                            {menuOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </nav>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <div style={{
                    position: 'fixed', top: '4.5rem', left: '1rem', right: '1rem', zIndex: 999,
                    background: 'var(--clr-surface)',
                    border: '1px solid var(--clr-border)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '1.5rem',
                    boxShadow: 'var(--shadow-card)',
                    color: 'var(--clr-text)'
                }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {categories.map(cat => {
                            const Icon = cat.icon
                            return (
                                <Link key={cat.path} to={cat.path} onClick={() => setMenuOpen(false)}
                                    style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', borderRadius: 'var(--radius-md)', textDecoration: 'none', color: 'var(--clr-text)', fontWeight: '600', background: 'var(--clr-bg)' }}>
                                    <Icon size={16} style={{ color: 'var(--clr-primary)' }} /> {cat.name}
                                </Link>
                            )
                        })}
                        <div className="divider" style={{ margin: '0.5rem 0' }} />
                        {[{ label: 'All Products', path: '/products' }, { label: 'Delivery', path: '/delivery' }, { label: 'FAQ', path: '/faq' }].map(l => (
                            <Link key={l.path} to={l.path} onClick={() => setMenuOpen(false)}
                                style={{ display: 'block', padding: '0.75rem', borderRadius: 'var(--radius-md)', textDecoration: 'none', color: 'var(--clr-text)', fontWeight: '600' }}>
                                {l.label}
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* Search Overlay */}
            {searchOpen && (
                <div
                    onClick={() => setSearchOpen(false)}
                    style={{
                        position: 'fixed', inset: 0, zIndex: 2000,
                        background: 'rgba(26,26,26,0.85)',
                        backdropFilter: 'blur(12px)',
                        display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
                        paddingTop: '15vh', paddingInline: '1rem'
                    }}
                >
                    <div onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: '640px' }}>
                        <form onSubmit={handleSearch} style={{ position: 'relative' }}>
                            <Search size={22} style={{
                                position: 'absolute', left: '1.5rem', top: '50%',
                                transform: 'translateY(-50%)', color: 'var(--clr-text-dim)'
                            }} />
                            <input
                                ref={searchRef}
                                type="text"
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                placeholder="Search accessories..."
                                style={{
                                    width: '100%',
                                    padding: '1.25rem 4rem 1.25rem 3.5rem',
                                    background: 'var(--clr-surface)',
                                    border: '1px solid var(--clr-border)',
                                    borderRadius: '99px',
                                    color: 'var(--clr-text)',
                                    fontSize: '1.25rem',
                                    fontFamily: 'var(--font-sans)',
                                    outline: 'none',
                                    boxShadow: '0 20px 60px rgba(0,0,0,0.1)'
                                }}
                            />
                            <button type="button" onClick={() => setSearchOpen(false)} style={{
                                position: 'absolute', right: '1.5rem', top: '50%', transform: 'translateY(-50%)',
                                background: 'var(--clr-bg)', border: 'none', cursor: 'pointer', color: 'var(--clr-text-muted)',
                                width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                transition: 'background 0.2s'
                            }}>
                                <X size={16} />
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
          nav {
            padding: 0.5rem 1rem !important;
            gap: 1rem !important;
          }
        }
      `}</style>
        </>
    )
}
