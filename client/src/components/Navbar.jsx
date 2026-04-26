import React, { useEffect, useState, useRef } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'
import DarkModeToggle from './DarkModeToggle'

const Navbar = () => {
    const [open, setOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const [announcementVisible, setAnnouncementVisible] = useState(true)
    const { user, setUser, setShowUserLogin, navigate, setSearchQuery, searchQuery, getCartCount, axios, products } = useAppContext();

    // Live Search States
    const [searchTerm, setSearchTerm] = useState('')
    const [suggestions, setSuggestions] = useState([])
    const [showSuggestions, setShowSuggestions] = useState(false)
    const [activeIndex, setActiveIndex] = useState(-1)
    const [isListening, setIsListening] = useState(false)
    const suggestionsRef = useRef(null)

    const logout = async () => {
        try {
            const { data } = await axios.get('/api/user/logout')
            if (data.success) {
                toast.success(data.message)
                setUser(null);
                navigate('/')
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    // Scroll shadow effect
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10)
        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    // Handle Search Logic with Debounce
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (searchTerm.trim().length > 0) {
                const filtered = products.filter(product =>
                    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    product.category.toLowerCase().includes(searchTerm.toLowerCase())
                ).slice(0, 8);
                setSuggestions(filtered)
                setShowSuggestions(true)
            } else {
                setSuggestions([])
                setShowSuggestions(false)
            }
        }, 300)
        return () => clearTimeout(delayDebounceFn)
    }, [searchTerm, products])

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
                setShowSuggestions(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleSelectSuggestion = (product) => {
        setSearchTerm(product.name)
        setSearchQuery(product.name)
        setShowSuggestions(false)
        navigate(`/products/${product.category.toLowerCase()}/${product._id}`)
    }

    const handleSearchSubmit = (e) => {
        if (e.key === 'Enter') {
            if (activeIndex >= 0 && suggestions[activeIndex]) {
                handleSelectSuggestion(suggestions[activeIndex])
            } else if (searchTerm.trim()) {
                setSearchQuery(searchTerm)
                setShowSuggestions(false)
                navigate('/products')
            }
        } else if (e.key === 'ArrowDown') {
            setActiveIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : prev))
        } else if (e.key === 'ArrowUp') {
            setActiveIndex(prev => (prev > 0 ? prev - 1 : prev))
        } else if (e.key === 'Escape') {
            setShowSuggestions(false)
        }
    }

    // Voice Search
    const startVoiceSearch = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
        if (!SpeechRecognition) {
            toast.error('Voice search not supported in this browser')
            return
        }
        const recognition = new SpeechRecognition()
        recognition.lang = 'en-IN'
        recognition.continuous = false
        recognition.interimResults = false
        setIsListening(true)
        recognition.start()
        recognition.onresult = (e) => {
            const transcript = e.results[0][0].transcript
            setSearchTerm(transcript)
            setSearchQuery(transcript)
            navigate('/products')
            setIsListening(false)
        }
        recognition.onerror = () => {
            setIsListening(false)
            toast.error('Could not hear you. Try again.')
        }
        recognition.onend = () => setIsListening(false)
    }

    const cartCount = getCartCount()

    return (
        <div className="sticky top-0 z-[100]">
            {/* Announcement Bar */}
            {announcementVisible && (
                <div style={{
                    background: '#3BB77E',
                    color: '#fff',
                    textAlign: 'center',
                    fontSize: '13px',
                    fontFamily: 'var(--font-body)',
                    fontWeight: 500,
                    padding: '7px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    position: 'relative',
                }}>
                    <span>🌿</span>
                    <span>Free delivery on orders over <strong>₹499</strong> · Use code <strong>FRESH10</strong> for 10% off your first order</span>
                    <button
                        onClick={() => setAnnouncementVisible(false)}
                        style={{
                            position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)',
                            background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)',
                            cursor: 'pointer', fontSize: '16px', lineHeight: 1, padding: '2px'
                        }}
                        aria-label="Close announcement"
                    >✕</button>
                </div>
            )}

            {/* Main Navbar */}
            <nav style={{
                background: 'rgba(250,250,248,0.92)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                borderBottom: scrolled ? '1px solid var(--border-main)' : '1px solid transparent',
                transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
                boxShadow: scrolled ? 'var(--shadow-sm)' : 'none',
            }} className="flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-3 relative">

                {/* LOGO — GreenCart wordmark */}
                <NavLink onClick={() => setOpen(false)} to='/' className="flex-shrink-0">
                    <span style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '26px',
                        fontWeight: 700,
                        letterSpacing: '-0.02em',
                        lineHeight: 1,
                    }}>
                        <span style={{ color: '#3BB77E' }}>Green</span><span style={{ color: 'var(--text-heading)' }}>Cart</span>
                    </span>
                </NavLink>

                {/* Desktop Nav Links */}
                <div className="hidden sm:flex items-center gap-6">
                    <NavLink className={({ isActive }) =>
                        `px-4 py-1.5 rounded-full border text-xs font-semibold transition-all duration-300
                        ${isActive
                            ? 'bg-primary text-white border-primary'
                            : 'text-body border-border-main hover:bg-surface-2 hover:border-accent/50'}`
                    }
                        to='/seller'>Seller</NavLink>
                    <NavLink to='/' className={({ isActive }) =>
                        `text-sm font-medium transition-colors ${isActive ? 'text-primary font-semibold' : 'text-body hover:text-primary'}`
                    }>Home</NavLink>
                    <NavLink to='/products' className={({ isActive }) =>
                        `text-sm font-medium transition-colors ${isActive ? 'text-primary font-semibold' : 'text-body hover:text-primary'}`
                    }>Shop</NavLink>
                    <NavLink to='/meal-planner' className={({ isActive }) =>
                        `text-sm font-medium transition-colors ${isActive ? 'text-primary font-semibold' : 'text-body hover:text-primary'}`
                    }>Meal Planner</NavLink>
                    <NavLink to='/contact' className={({ isActive }) =>
                        `text-sm font-medium transition-colors ${isActive ? 'text-primary font-semibold' : 'text-body hover:text-primary'}`
                    }>Contact</NavLink>
                </div>

                {/* Search Bar */}
                <div className="relative group/search" ref={suggestionsRef}>
                    <div style={{
                        display: 'none',
                        alignItems: 'center',
                        gap: '8px',
                        background: 'var(--bg-surface)',
                        border: '1.5px solid var(--border-main)',
                        borderRadius: '999px',
                        padding: '0 14px',
                        boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.04)',
                        transition: 'border-color 0.2s, box-shadow 0.2s',
                        width: '260px',
                    }} className="lg:!flex">
                        {/* Search Icon */}
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--text-muted)', flexShrink: 0 }}>
                            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                        </svg>
                        <input
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={handleSearchSubmit}
                            onFocus={() => searchTerm.trim() && setShowSuggestions(true)}
                            style={{
                                flex: 1, padding: '9px 0',
                                background: 'transparent', border: 'none', outline: 'none',
                                fontSize: '14px', color: 'var(--text-heading)',
                                fontFamily: 'var(--font-body)',
                            }}
                            placeholder="Search fresh items..."
                        />
                        {/* Voice Search Mic */}
                        <button
                            onClick={startVoiceSearch}
                            title="Voice search"
                            style={{
                                background: 'none', border: 'none', cursor: 'pointer', padding: '4px',
                                color: isListening ? '#3BB77E' : 'var(--text-muted)',
                                transition: 'color 0.2s',
                                flexShrink: 0,
                            }}
                        >
                            {isListening ? (
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ animation: 'badgePulse 1s infinite' }}>
                                    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                                    <path d="M19 10v2a7 7 0 0 1-14 0v-2" fill="none" stroke="currentColor" strokeWidth="2"/>
                                    <line x1="12" y1="19" x2="12" y2="23" stroke="currentColor" strokeWidth="2"/>
                                </svg>
                            ) : (
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                                    <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                                    <line x1="12" y1="19" x2="12" y2="23"/>
                                </svg>
                            )}
                        </button>
                    </div>

                    {/* Autocomplete Dropdown */}
                    {showSuggestions && (
                        <div style={{
                            position: 'absolute', top: '52px', left: 0, width: '100%',
                            background: 'var(--bg-card)',
                            border: '1px solid var(--border-main)',
                            borderRadius: '16px',
                            boxShadow: 'var(--shadow-lg)',
                            overflow: 'hidden',
                            zIndex: 150,
                            animation: 'fadeInUp 0.2s ease',
                        }}>
                            {suggestions.length > 0 ? (
                                <ul style={{ padding: '8px 0', listStyle: 'none', margin: 0 }}>
                                    {suggestions.map((item, index) => (
                                        <li
                                            key={item._id}
                                            onClick={() => handleSelectSuggestion(item)}
                                            onMouseEnter={() => setActiveIndex(index)}
                                            style={{
                                                padding: '10px 16px',
                                                display: 'flex', alignItems: 'center', gap: '12px',
                                                cursor: 'pointer',
                                                background: index === activeIndex ? 'var(--bg-surface)' : 'transparent',
                                                transition: 'background 0.15s',
                                            }}
                                        >
                                            <div style={{
                                                width: '36px', height: '36px',
                                                background: 'var(--bg-surface)',
                                                borderRadius: '10px',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                flexShrink: 0, border: '1px solid var(--border-soft)',
                                            }}>
                                                <img src={item.image[0]} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} alt="" />
                                            </div>
                                            <div style={{ overflow: 'hidden' }}>
                                                <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-heading)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</div>
                                                <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>{item.category}</div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div style={{ padding: '24px', textAlign: 'center' }}>
                                    <p style={{ fontSize: '24px' }}>🥦</p>
                                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.15em' }}>No results for "{searchTerm}"</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Right Controls */}
                <div className="hidden sm:flex items-center gap-4">
                    <DarkModeToggle />

                    {/* Cart */}
                    <div
                        onClick={() => navigate("/cart")}
                        style={{ position: 'relative', cursor: 'pointer' }}
                        className="group"
                    >
                        <img src={assets.nav_cart_icon} alt="cart" style={{ width: '24px', opacity: 0.8, transition: 'all 0.2s' }} className="group-hover:opacity-100 group-hover:scale-110 dark:invert" />
                        {cartCount > 0 && (
                            <span style={{
                                position: 'absolute', top: '-8px', right: '-10px',
                                background: '#3BB77E',
                                color: '#fff',
                                fontSize: '10px',
                                fontWeight: 700,
                                minWidth: '18px', minHeight: '18px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                borderRadius: '999px',
                                boxShadow: '0 2px 6px rgba(59,183,126,0.4)',
                                animation: 'badgePulse 0.3s ease',
                            }}>{cartCount}</span>
                        )}
                    </div>

                    {/* Auth */}
                    {!user ? (
                        <button
                            onClick={() => setShowUserLogin(true)}
                            style={{
                                padding: '8px 22px',
                                background: '#3BB77E',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '999px',
                                fontFamily: 'var(--font-body)',
                                fontWeight: 600,
                                fontSize: '14px',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                boxShadow: '0 2px 8px rgba(59, 183, 126,0.3)',
                            }}
                            onMouseOver={e => e.currentTarget.style.background = '#29A56C'}
                            onMouseOut={e => e.currentTarget.style.background = '#3BB77E'}
                        >Login</button>
                    ) : (
                        <div style={{ position: 'relative' }} className="group">
                            <div style={{
                                width: '38px', height: '38px',
                                borderRadius: '50%',
                                background: '#3BB77E',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                cursor: 'pointer',
                                color: '#fff',
                                fontSize: '15px',
                                fontWeight: 700,
                                fontFamily: 'var(--font-display)',
                                transition: 'all 0.2s',
                                border: '2px solid transparent',
                            }} className="group-hover:border-accent/30">
                                {user.name?.[0]?.toUpperCase() || '👤'}
                            </div>
                            <ul style={{
                                display: 'none',
                                position: 'absolute', top: '48px', right: 0,
                                background: 'var(--bg-card)',
                                border: '1px solid var(--border-main)',
                                borderRadius: '14px',
                                padding: '8px 0',
                                width: '160px',
                                boxShadow: 'var(--shadow-lg)',
                                zIndex: 40,
                                listStyle: 'none',
                                margin: 0,
                                animation: 'fadeInUp 0.2s ease',
                            }} className="group-hover:!block">
                                <li onClick={() => navigate("my-orders")} style={{
                                    padding: '10px 16px', cursor: 'pointer',
                                    fontSize: '14px', color: 'var(--text-body)', fontWeight: 500,
                                    transition: 'all 0.15s',
                                }} onMouseOver={e => { e.currentTarget.style.background = 'var(--bg-surface)'; e.currentTarget.style.color = '#3BB77E' }}
                                    onMouseOut={e => { e.currentTarget.style.background = ''; e.currentTarget.style.color = 'var(--text-body)' }}>
                                    My Orders
                                </li>
                                <li onClick={logout} style={{
                                    padding: '10px 16px', cursor: 'pointer',
                                    fontSize: '14px', color: 'var(--text-body)', fontWeight: 500,
                                    borderTop: '1px solid var(--border-soft)',
                                    transition: 'all 0.15s',
                                }} onMouseOver={e => { e.currentTarget.style.background = 'var(--bg-surface)'; e.currentTarget.style.color = '#C0392B' }}
                                    onMouseOut={e => { e.currentTarget.style.background = ''; e.currentTarget.style.color = 'var(--text-body)' }}>
                                    Logout
                                </li>
                            </ul>
                        </div>
                    )}
                </div>

                {/* Mobile Controls */}
                <div className='flex items-center gap-3 sm:hidden'>
                    <DarkModeToggle />
                    <div onClick={() => navigate("/cart")} style={{ position: 'relative', cursor: 'pointer' }}>
                        <img src={assets.nav_cart_icon} alt="cart" style={{ width: '24px', opacity: 0.8 }} className="dark:invert" />
                        {cartCount > 0 && (
                            <span style={{
                                position: 'absolute', top: '-8px', right: '-10px',
                                background: '#3BB77E', color: '#fff',
                                fontSize: '10px', fontWeight: 700,
                                minWidth: '18px', minHeight: '18px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                borderRadius: '999px',
                            }}>{cartCount}</span>
                        )}
                    </div>
                    <button
                        onClick={() => setOpen(!open)}
                        aria-label="Menu"
                        style={{ padding: '6px', background: 'var(--bg-surface)', border: '1px solid var(--border-main)', borderRadius: '8px', cursor: 'pointer' }}
                    >
                        <img src={assets.menu_icon} alt="menu" style={{ width: '20px', display: 'block' }} className="dark:invert" />
                    </button>
                </div>

                {/* Mobile Slide-over Menu */}
                {open && (
                    <div style={{
                        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                        zIndex: 200, display: 'flex',
                    }}>
                        {/* Backdrop */}
                        <div
                            onClick={() => setOpen(false)}
                            style={{ flex: 1, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}
                        />
                        {/* Drawer */}
                        <div style={{
                            width: '280px',
                            background: 'var(--bg-card)',
                            padding: '32px 24px',
                            display: 'flex', flexDirection: 'column', gap: '8px',
                            boxShadow: 'var(--shadow-lg)',
                            animation: 'fadeInUp 0.25s ease',
                            overflowY: 'auto',
                        }}>
                            {/* Close */}
                            <button
                                onClick={() => setOpen(false)}
                                style={{ alignSelf: 'flex-end', background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer', color: 'var(--text-muted)', marginBottom: '16px' }}
                            >✕</button>

                            {/* Logo */}
                            <span style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 700, marginBottom: '24px' }}>
                                <span style={{ color: '#3BB77E' }}>Green</span><span style={{ color: 'var(--text-heading)' }}>Cart</span>
                            </span>

                            {[
                                { to: '/', label: 'Home' },
                                { to: '/products', label: 'Shop All' },
                                { to: '/meal-planner', label: 'Meal Planner' },
                                { to: '/contact', label: 'Contact' },
                                ...(user ? [{ to: '/my-orders', label: 'My Orders' }] : []),
                                { to: '/seller', label: 'Seller Dashboard' },
                            ].map(({ to, label }) => (
                                <NavLink
                                    key={to}
                                    to={to}
                                    onClick={() => setOpen(false)}
                                    style={({ isActive }) => ({
                                        padding: '12px 16px',
                                        borderRadius: '12px',
                                        fontWeight: 600,
                                        fontSize: '16px',
                                        color: isActive ? '#3BB77E' : 'var(--text-heading)',
                                        background: isActive ? '#D8EDDE' : 'transparent',
                                        textDecoration: 'none',
                                        transition: 'all 0.15s',
                                    })}
                                >{label}</NavLink>
                            ))}

                            <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid var(--border-main)' }}>
                                {!user ? (
                                    <button
                                        onClick={() => { setOpen(false); setShowUserLogin(true); }}
                                        style={{
                                            width: '100%', padding: '14px',
                                            background: '#3BB77E', color: '#fff',
                                            border: 'none', borderRadius: '12px',
                                            fontSize: '16px', fontWeight: 700, cursor: 'pointer',
                                        }}
                                    >Login</button>
                                ) : (
                                    <button
                                        onClick={logout}
                                        style={{
                                            width: '100%', padding: '14px',
                                            background: 'var(--bg-surface)', color: '#C0392B',
                                            border: '1px solid var(--border-main)', borderRadius: '12px',
                                            fontSize: '16px', fontWeight: 700, cursor: 'pointer',
                                        }}
                                    >Logout</button>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </nav>
        </div>
    )
}

export default Navbar