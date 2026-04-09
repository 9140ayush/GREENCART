import React from 'react'
import { assets } from '../assets/assets'
import { Link } from 'react-router-dom'

const MainBanner = () => {
  return (
    <div className='relative group overflow-hidden rounded-2xl md:rounded-[32px] mt-6 shadow-xl shadow-black/5'>
        <img src={assets.main_banner_bg} alt="banner" className='w-full hidden md:block group-hover:scale-105 transition-transform duration-1000 ease-out'/>
        <img src={assets.main_banner_bg_sm} alt="banner" className='w-full md:hidden'/>
        
        {/* Cinematic Overlay - Sophisticated gradient for readability */}
        <div className='absolute inset-0 bg-gradient-to-r from-page/60 via-page/20 to-transparent dark:from-page/95 dark:via-page/40 dark:to-transparent transition-all duration-500'></div>
        
        <div className='absolute inset-0 flex flex-col items-center md:items-start justify-end md:justify-center pb-24 md:pb-0 px-8 md:pl-16 lg:pl-24 z-10'>
            <h1 className='text-3xl md:text-5xl lg:text-6xl font-black text-center md:text-left max-w-72 md:max-w-md lg:max-w-2xl leading-tight lg:leading-[1.1] text-heading drop-shadow-sm'>
                Freshness You Can <span className="text-primary">Trust</span>, Savings You will <span className="text-primary">Love</span>! 
            </h1>
        
            <div className='flex items-center gap-4 mt-8 font-bold'>
                <Link to={"/products"} className='group flex items-center gap-3 px-8 md:px-10 py-4 bg-primary hover:bg-primary-dull transition-all rounded-full text-white shadow-lg shadow-primary/30 active:scale-95 cursor-pointer'>
                    Shop now
                    <img className='w-4 md:w-5 transition group-hover:translate-x-1' src={assets.white_arrow_icon} alt="arrow" />
                </Link>
                <Link to={"/products"} className='group hidden md:flex items-center gap-3 px-10 py-4 bg-white/20 dark:bg-card/40 backdrop-blur-md border border-white/30 dark:border-border-main hover:bg-white/40 dark:hover:bg-card/60 transition-all rounded-full text-heading cursor-pointer active:scale-95'>
                    Explore deals
                    <img className='w-4 md:w-5 transition group-hover:translate-x-1 dark:invert opacity-70' src={assets.black_arrow_icon} alt="arrow" />
                </Link>
            </div>
        </div>
    </div>
  )
}

export default MainBanner