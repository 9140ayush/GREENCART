import React, { useEffect, useState, useRef } from 'react'
import { NavLink } from 'react-router-dom'
import { assets } from '../assets/assets'
import {useAppContext} from '../context/AppContext'
import toast from 'react-hot-toast'
import DarkModeToggle from './DarkModeToggle'

const Navbar = () => {
    const [open, setOpen] = useState(false)
    const {user, setUser, setShowUserLogin, navigate, setSearchQuery, searchQuery, getCartCount, axios, products} = useAppContext();
    
    // Live Search States
    const [searchTerm, setSearchTerm] = useState('')
    const [suggestions, setSuggestions] = useState([])
    const [showSuggestions, setShowSuggestions] = useState(false)
    const [activeIndex, setActiveIndex] = useState(-1)
    const suggestionsRef = useRef(null)

    const logout = async ()=>{
        try {
            const {data} = await axios.get('/api/user/logout')
            if(data.success) {
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

    // Handle Search Logic with Debounce
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (searchTerm.trim().length > 0) {
                const filtered = products.filter(product => 
                    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    product.category.toLowerCase().includes(searchTerm.toLowerCase())
                ).slice(0, 8); // Limit results to 8
                
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

    return (
        <nav className="flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-border-main bg-card relative sticky top-0 z-[100]">

            <NavLink onClick={()=> setOpen(false)} to='/'>
                <img className='h-9 dark:brightness-200 contrast-125' src={assets.logo} alt="logo" />
            </NavLink>

            {/* Desktop Menu */}
            <div className="hidden sm:flex items-center gap-8">
                <NavLink className={({ isActive }) =>
                `px-4 py-1.5 rounded-full border text-xs font-medium transition-all duration-300
                ${isActive 
                    ? "bg-primary text-white border-primary shadow-lg shadow-primary/20" 
                    : "text-body border-border-main hover:bg-surface hover:border-accent/50"}`
                } 
                to='/seller'>Seller Dashboard</NavLink>
                <NavLink to='/' className="text-body hover:text-accent transition-colors">Home</NavLink>
                <NavLink to='/products' className="text-body hover:text-accent transition-colors">All Product</NavLink>
                <NavLink to='/contact' className="text-body hover:text-accent transition-colors">Contact</NavLink>

                {/* Enhanced Search Bar */}
                <div className="relative group/search" ref={suggestionsRef}>
                    <div className="hidden lg:flex items-center text-sm gap-2 border border-border-main px-4 rounded-full bg-surface focus-within:border-accent/50 focus-within:ring-4 focus-within:ring-accent/5 transition-all w-64 xl:w-80 shadow-inner">
                        <input 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={handleSearchSubmit}
                            onFocus={() => searchTerm.trim() && setShowSuggestions(true)}
                            className="py-1.5 w-full bg-transparent outline-none placeholder-muted text-heading font-medium" 
                            type="text" 
                            placeholder="Search fresh items..." 
                        />
                        <img src={assets.search_icon} alt="search" className='w-4 h-4 dark:invert opacity-60'/>
                    </div>

                    {/* Autocomplete Dropdown */}
                    {showSuggestions && (
                        <div className="absolute top-12 left-0 w-full bg-card border border-border-main shadow-2xl rounded-2xl overflow-hidden z-[150] animate-in fade-in slide-in-from-top-2 duration-300">
                            {suggestions.length > 0 ? (
                                <ul className="py-2 divide-y divide-border-soft">
                                    {suggestions.map((item, index) => (
                                        <li 
                                            key={item._id}
                                            onClick={() => handleSelectSuggestion(item)}
                                            onMouseEnter={() => setActiveIndex(index)}
                                            className={`px-4 py-3 flex items-center gap-4 cursor-pointer transition-all
                                                ${index === activeIndex ? 'bg-surface text-accent' : 'text-body hover:bg-surface/50'}
                                            `}
                                        >
                                            <div className="w-10 h-10 bg-surface rounded-xl p-1.5 border border-border-soft flex items-center justify-center shrink-0">
                                                <img src={item.image[0]} className="max-w-full max-h-full object-contain" alt="" />
                                            </div>
                                            <div className="flex flex-col overflow-hidden">
                                                <span className="text-sm font-black truncate text-heading leading-tight">{item.name}</span>
                                                <span className="text-[9px] text-muted uppercase font-black tracking-[0.15em]">{item.category}</span>
                                            </div>
                                            {index === activeIndex && (
                                                <span className="ml-auto text-[10px] font-bold text-accent opacity-60">SELECT</span>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="p-8 text-center space-y-2">
                                    <p className="text-2xl">🥦</p>
                                    <p className="text-[10px] font-black text-muted uppercase tracking-[0.2em]">No items found for "{searchTerm}"</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <DarkModeToggle />

                <div onClick={()=> navigate("/cart")} className="relative cursor-pointer group">
                    <img src={assets.nav_cart_icon} alt="cart" className='w-6 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all dark:invert'/>
                    <button className="absolute -top-2 -right-3 text-[10px] p-1 font-bold leading-none text-white bg-accent min-w-[18px] min-h-[18px] flex items-center justify-center rounded-full shadow-md shadow-accent/20 transition-transform active:scale-90">{getCartCount()}</button>
                </div>

                {!user ? (<button onClick={()=> setShowUserLogin(true)} className="cursor-pointer px-8 py-2 bg-primary hover:bg-primary-dull transition-all text-white rounded-full font-medium shadow-md shadow-primary/20 active:scale-95">
                    Login
                </button>) 
                :
                (
                    <div className='relative group'>
                        <img src={assets.profile_icon} alt="" className='w-10 cursor-pointer hover:ring-2 hover:ring-accent/20 rounded-full transition-all'/>
                        <ul className='hidden group-hover:block absolute top-12 right-0 bg-card shadow-xl border border-border-main py-2.5 w-40 rounded-xl text-sm z-40 animate-in fade-in slide-in-from-top-2 duration-200'>
                            <li onClick={()=> navigate("my-orders")} className='p-2.5 pl-4 hover:bg-surface text-body hover:text-accent cursor-pointer transition-colors'>My Orders</li>
                            <li onClick={logout} className='p-2.5 pl-4 hover:bg-surface text-body hover:text-red-500 cursor-pointer transition-colors border-t border-border-soft'>Logout</li>
                        </ul>
                    </div>
                )}
            </div>
            
            <div className='flex items-center gap-4 sm:hidden'>
                <DarkModeToggle />
                <div onClick={()=> navigate("/cart")} className="relative cursor-pointer">
                    <img src={assets.nav_cart_icon} alt="cart" className='w-6 opacity-80 dark:invert'/>
                    <button className="absolute -top-2 -right-3 text-[10px] font-bold text-white bg-primary w-[18px] h-[18px] rounded-full flex items-center justify-center">{getCartCount()}</button>
                </div>
                <button onClick={() => open ? setOpen(false) : setOpen(true)} aria-label="Menu" className="p-1 hover:bg-surface rounded-lg transition-colors">
                    {/* Menu Icon SVG */}
                    <img src={assets.menu_icon} alt="menu" className="dark:invert"/>
                </button>
            </div>

            {/* Mobile Menu */}
            { open && (
                <div className="fixed top-[72px] left-0 w-full bg-card/95 backdrop-blur-md shadow-2xl py-6 flex flex-col items-start gap-4 px-6 text-sm md:hidden z-50 border-b border-border-main animate-in slide-in-from-top-4 duration-300">
                    <NavLink to="/" onClick={()=>setOpen(false)} className="text-heading font-medium text-lg">Home</NavLink>
                    <NavLink to="/products" onClick={()=>setOpen(false)} className="text-heading font-medium text-lg">All Product</NavLink>
                    {user &&
                    <NavLink to="/products" onClick={()=>setOpen(false)} className="text-heading font-medium text-lg">My Orders</NavLink>
                    }
                    <NavLink to="/contact" onClick={()=>setOpen(false)} className="text-heading font-medium text-lg">Contact</NavLink>
                    
                    {!user ? (
                        <button onClick={()=>{setOpen(false);setShowUserLogin(true);}} className="w-full cursor-pointer px-6 py-3 mt-4 bg-primary hover:bg-primary-dull transition text-white rounded-xl text-lg font-bold">
                        Login
                        </button>
                    ) : (
                        <button onClick={logout} className="w-full cursor-pointer px-6 py-3 mt-4 bg-surface hover:bg-red-500/10 border border-border-main text-heading hover:text-red-500 transition rounded-xl text-lg font-bold">
                        Logout
                        </button>
                    )}
                </div>
            )}

        </nav>
    )
}

export default Navbar