import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Smartphone, ArrowRight } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
    const { signIn, signUp } = useAuth()
    const navigate = useNavigate()
    const [mode, setMode] = useState('login') // 'login' | 'signup'
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [fullName, setFullName] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [successMsg, setSuccessMsg] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setSuccessMsg('')
        setLoading(true)

        if (mode === 'login') {
            const { error } = await signIn(email, password)
            if (error) {
                setError(error.message)
            } else {
                navigate('/')
            }
        } else {
            const { error } = await signUp(email, password, fullName)
            if (error) {
                setError(error.message)
            } else {
                setSuccessMsg('Account created! Check your email to confirm, then login.')
                setMode('login')
            }
        }
        setLoading(false)
    }

    return (
        <div style={{
            minHeight: '100dvh',
            background: 'var(--clr-bg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem 1rem',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* BG decoration */}
            <div className="glow-orb" style={{ width: '500px', height: '500px', background: 'var(--clr-primary)', top: '-20%', right: '-10%' }} />
            <div className="glow-orb" style={{ width: '300px', height: '300px', background: 'var(--clr-primary-light)', bottom: '-10%', left: '-5%', opacity: 0.08 }} />

            <div style={{
                width: '100%', maxWidth: '440px',
                background: 'var(--clr-surface)',
                border: '1px solid var(--clr-border)',
                borderRadius: 'var(--radius-xl)',
                padding: '2.5rem',
                position: 'relative', zIndex: 1,
                boxShadow: 'var(--shadow-glow), 0 20px 60px rgba(0,0,0,0.4)'
            }}>
                {/* Logo */}
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <Link to="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                        <div style={{
                            width: '40px', height: '40px',
                            background: 'linear-gradient(135deg, var(--clr-primary), var(--clr-primary-light))',
                            borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontWeight: '900', color: 'white', fontSize: '1.2rem', boxShadow: 'var(--shadow-glow)'
                        }}>F</div>
                        <span style={{ fontWeight: '800', fontSize: '1.1rem', color: 'var(--clr-text)' }}>
                            Friends <span style={{ color: 'var(--clr-primary-light)' }}>Mobiles</span>
                        </span>
                    </Link>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--clr-text)', marginBottom: '0.375rem' }}>
                        {mode === 'login' ? 'Welcome back' : 'Create account'}
                    </h1>
                    <p style={{ color: 'var(--clr-text-dim)', fontSize: '0.875rem' }}>
                        {mode === 'login'
                            ? 'Login to manage your cart and orders'
                            : 'Sign up to start shopping with us'}
                    </p>
                </div>

                {/* Toggle */}
                <div style={{
                    display: 'flex',
                    background: 'var(--clr-surface-2)',
                    borderRadius: '99px',
                    padding: '4px',
                    marginBottom: '2rem'
                }}>
                    {['login', 'signup'].map(m => (
                        <button
                            key={m}
                            onClick={() => { setMode(m); setError(''); setSuccessMsg('') }}
                            style={{
                                flex: 1,
                                padding: '0.5rem',
                                borderRadius: '99px',
                                border: 'none',
                                cursor: 'pointer',
                                fontFamily: 'var(--font-sans)',
                                fontWeight: '700',
                                fontSize: '0.875rem',
                                transition: 'all 0.25s',
                                background: mode === m ? 'var(--clr-primary)' : 'transparent',
                                color: mode === m ? 'white' : 'var(--clr-text-dim)'
                            }}
                        >
                            {m === 'login' ? 'Login' : 'Sign Up'}
                        </button>
                    ))}
                </div>

                {/* Error / Success */}
                {error && (
                    <div style={{
                        padding: '0.875rem 1rem',
                        background: 'rgba(239,68,68,0.1)',
                        border: '1px solid rgba(239,68,68,0.3)',
                        borderRadius: 'var(--radius-md)',
                        color: '#f87171',
                        fontSize: '0.875rem',
                        marginBottom: '1.25rem'
                    }}>
                        {error}
                    </div>
                )}
                {successMsg && (
                    <div style={{
                        padding: '0.875rem 1rem',
                        background: 'rgba(22,163,74,0.1)',
                        border: '1px solid rgba(22,163,74,0.3)',
                        borderRadius: 'var(--radius-md)',
                        color: 'var(--clr-primary-light)',
                        fontSize: '0.875rem',
                        marginBottom: '1.25rem'
                    }}>
                        {successMsg}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    {mode === 'signup' && (
                        <div>
                            <label htmlFor="fullName">Full Name</label>
                            <input
                                id="fullName"
                                type="text"
                                className="input"
                                placeholder="Your full name"
                                value={fullName}
                                onChange={e => setFullName(e.target.value)}
                                required
                            />
                        </div>
                    )}

                    <div>
                        <label htmlFor="email">Email Address</label>
                        <input
                            id="email"
                            type="email"
                            className="input"
                            placeholder="you@example.com"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="password">Password</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                className="input"
                                placeholder="••••••••"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    position: 'absolute', right: '1rem', top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'none', border: 'none', cursor: 'pointer',
                                    color: 'var(--clr-text-dim)'
                                }}
                            >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary"
                        style={{ justifyContent: 'center', padding: '0.875rem', fontSize: '1rem' }}
                    >
                        {loading ? (
                            <div className="spinner" style={{ width: '20px', height: '20px', borderWidth: '2px' }} />
                        ) : (
                            <>
                                {mode === 'login' ? 'Login' : 'Create Account'}
                                <ArrowRight size={16} />
                            </>
                        )}
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.8rem', color: 'var(--clr-text-dim)' }}>
                    {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
                    <button
                        onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); setSuccessMsg('') }}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--clr-primary-light)', fontWeight: '600', fontFamily: 'var(--font-sans)', fontSize: '0.8rem' }}
                    >
                        {mode === 'login' ? 'Sign up' : 'Login'}
                    </button>
                </p>
            </div>
        </div>
    )
}
