import React, { useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { assets } from '../assets/assets'
import {useAppContext} from '../context/AppContext'
import toast from 'react-hot-toast'
import DarkModeToggle from './DarkModeToggle'

const Navbar = () => {
    const [open, setOpen] = React.useState(false)
    const {user, setUser, setShowUserLogin, navigate, setSearchQuery, searchQuery, getCartCount, axios} = useAppContext();

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

    useEffect(()=>{
        if(searchQuery.length > 0) {
            navigate("/products")
        }
    },[searchQuery])

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

                <div className="hidden lg:flex items-center text-sm gap-2 border border-border-main px-4 rounded-full bg-surface focus-within:border-accent/50 focus-within:ring-2 focus-within:ring-accent/10 transition-all">
                    <input onChange={(e)=> setSearchQuery(e.target.value)} className="py-1.5 w-full bg-transparent outline-none placeholder-muted text-heading" type="text" placeholder="Search products" />
                    <img src={assets.search_icon} alt="search" className='w-4 h-4 dark:invert opacity-60'/>
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