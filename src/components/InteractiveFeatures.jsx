import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'

export function DiagnosticShuffler() {
    const containerRef = useRef(null)
    const [items, setItems] = useState([
        { id: 1, label: 'Studio Grade', desc: 'Active Noise Cancellation' },
        { id: 2, label: 'Spatial Audio', desc: '360° Soundstage' },
        { id: 3, label: 'Lossless', desc: 'High-Fidelity Drivers' }
    ])

    useEffect(() => {
        const interval = setInterval(() => {
            setItems(prev => {
                const newItems = [...prev]
                newItems.unshift(newItems.pop())
                return newItems
            })
        }, 3000)
        return () => clearInterval(interval)
    }, [])

    return (
        <div ref={containerRef} style={{ position: 'relative', height: '240px', width: '100%', perspective: '1000px' }}>
            {items.map((item, index) => {
                const isTop = index === 0;
                return (
                    <div
                        key={item.id}
                        style={{
                            position: 'absolute',
                            top: 0, left: 0, right: 0,
                            padding: '1.5rem',
                            background: 'var(--clr-surface)',
                            border: '1px solid var(--clr-border)',
                            borderRadius: '1.5rem',
                            boxShadow: isTop ? 'var(--shadow-card)' : 'none',
                            transition: 'all 0.8s var(--transition-spring)',
                            transform: `translateY(${index * 20}px) scale(${1 - index * 0.05})`,
                            opacity: 1 - index * 0.2,
                            zIndex: 10 - index
                        }}
                    >
                        <div className="badge badge-green" style={{ marginBottom: '0.75rem' }}>{item.label}</div>
                        <h4 style={{ fontFamily: 'var(--font-sans)', fontWeight: '700', fontSize: '1.1rem', color: 'var(--clr-text)' }}>
                            {item.desc}
                        </h4>
                    </div>
                )
            })}
        </div>
    )
}

export function TelemetryTypewriter() {
    const [text, setText] = useState('')
    const messages = [
        "Initializing power delivery...",
        "Negotiating optimal voltage...",
        "Fast charge protocol: ACTIVE.",
        "Output locked at 65W max.",
        "Battery health safeguarded."
    ]
    const [msgIdx, setMsgIdx] = useState(0)

    useEffect(() => {
        let currentText = ''
        const targetMsg = messages[msgIdx]
        let charIdx = 0

        const typeInterval = setInterval(() => {
            if (charIdx < targetMsg.length) {
                currentText += targetMsg.charAt(charIdx)
                setText(currentText)
                charIdx++
            } else {
                clearInterval(typeInterval)
                setTimeout(() => {
                    setMsgIdx((m) => (m + 1) % messages.length)
                }, 2000)
            }
        }, 50)

        return () => clearInterval(typeInterval)
    }, [msgIdx])

    return (
        <div style={{ padding: '1.5rem', background: 'var(--clr-surface)', border: '1px solid var(--clr-border)', borderRadius: '1.5rem', boxShadow: 'var(--shadow-card)', height: '240px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--clr-accent)', animation: 'pulse 1.5s infinite' }} />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--clr-accent)' }}>Live Feed</span>
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.95rem', color: 'var(--clr-text-muted)', lineHeight: 1.6, flex: 1, display: 'flex', alignItems: 'flex-start' }}>
                <p>
                    <span style={{ color: 'var(--clr-primary-light)', marginRight: '0.5rem' }}>{'>'}</span>
                    {text}
                    <span style={{ display: 'inline-block', width: '8px', height: '1em', background: 'var(--clr-accent)', marginLeft: '4px', animation: 'blink 1s step-end infinite' }} />
                </p>
            </div>
            <style>{`
                @keyframes blink { 50% { opacity: 0; } }
            `}</style>
        </div>
    )
}

export function CursorScheduler() {
    const svgRef = useRef(null)
    const cursorRef = useRef(null)
    const activeCellRef = useRef(null)
    const saveBtnRef = useRef(null)

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ repeat: -1, repeatDelay: 1 })

            // Cursor start pos
            tl.set(cursorRef.current, { x: 0, y: 150, opacity: 0, scale: 1 })
            tl.set(activeCellRef.current, { fill: 'transparent', stroke: 'var(--clr-border)' })
            tl.set(saveBtnRef.current, { scale: 1 })

            // Move in
            tl.to(cursorRef.current, { x: 120, y: 60, opacity: 1, duration: 1, ease: 'power2.inOut' })
            // Click visual
            tl.to(cursorRef.current, { scale: 0.8, duration: 0.1, yoyo: true, repeat: 1 })
            tl.to(activeCellRef.current, { fill: 'var(--clr-primary)', stroke: 'var(--clr-primary)', duration: 0.2 }, '-=0.1')

            // Move to save
            tl.to(cursorRef.current, { x: 200, y: 130, duration: 0.8, ease: 'power2.inOut', delay: 0.3 })
            // Click visual
            tl.to(cursorRef.current, { scale: 0.8, duration: 0.1, yoyo: true, repeat: 1 })
            tl.to(saveBtnRef.current, { scale: 0.95, duration: 0.1, yoyo: true, repeat: 1 }, '-=0.1')

            // Move out
            tl.to(cursorRef.current, { x: 300, y: 200, opacity: 0, duration: 0.8, ease: 'power2.inOut', delay: 0.2 })

        }, svgRef)
        return () => ctx.revert()
    }, [])

    return (
        <div style={{ padding: '1.5rem', background: 'var(--clr-surface)', border: '1px solid var(--clr-border)', borderRadius: '1.5rem', boxShadow: 'var(--shadow-card)', height: '240px', position: 'relative', overflow: 'hidden' }}>
            <h4 style={{ fontFamily: 'var(--font-sans)', fontWeight: '700', fontSize: '1rem', color: 'var(--clr-text)', marginBottom: '1rem' }}>Universal Compatibility</h4>
            <svg ref={svgRef} viewBox="0 0 300 160" style={{ width: '100%', height: '100%' }}>
                <defs>
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                        <rect width="40" height="40" fill="none" rx="4" stroke="var(--clr-border)" strokeWidth="1" />
                    </pattern>
                </defs>
                {/* Grid */}
                <rect width="280" height="80" x="10" y="10" fill="url(#grid)" />
                {/* Active cell (Tuesday is 3rd cell, x=90) */}
                <rect ref={activeCellRef} width="38" height="38" x="91" y="11" rx="4" fill="transparent" />

                {/* Save Button */}
                <g ref={saveBtnRef} transform="translate(180, 110)">
                    <rect width="60" height="24" rx="12" fill="var(--clr-accent)" />
                    <text x="30" y="16" fill="white" fontSize="10" fontFamily="var(--font-mono)" fontWeight="bold" textAnchor="middle">SYNC</text>
                </g>

                {/* Cursor */}
                <g ref={cursorRef} style={{ pointerEvents: 'none' }}>
                    <path d="M0,0 L12,12 L5,12 L5,20 L0,20 Z" fill="white" stroke="black" strokeWidth="1" transform="rotate(-15) scale(1.5)" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.3))" />
                </g>
            </svg>
        </div>
    )
}
