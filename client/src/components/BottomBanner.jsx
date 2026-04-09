import React from 'react'
import { assets, features } from '../assets/assets'

const BottomBanner = () => {
  return (
    <div className='relative mt-32 overflow-hidden rounded-[32px] shadow-2xl shadow-black/5'>
        <img src={assets.bottom_banner_image} alt="banner" className='w-full hidden md:block group-hover:scale-105 transition-transform duration-1000'/>
        <img src={assets.bottom_banner_image_sm} alt="banner" className='w-full md:hidden'/>
        
        {/* Cinematic Gradient Overlay */}
        <div className='absolute inset-0 bg-gradient-to-l from-page/40 via-transparent to-transparent dark:from-page/80 dark:via-page/20 dark:to-transparent'></div>

        <div className='absolute inset-0 flex flex-col items-center md:items-end md:justify-center pt-16 md:pt-0 md:pr-12 lg:pr-24 z-10'>
            <div className='bg-white/60 dark:bg-card/80 backdrop-blur-xl p-8 md:p-12 rounded-[32px] border border-white/40 dark:border-border-main max-w-lg shadow-2xl'>
                <div className="flex items-center gap-3 mb-8">
                    <h1 className='text-2xl md:text-3xl font-black text-accent uppercase tracking-tight'>Why Choose Us?</h1>
                    <div className="flex-1 h-[2px] bg-accent/20 rounded-full"></div>
                </div>

                <div className="space-y-8">
                    {features.map((feature, index)=>(
                        <div key={index} className='group flex items-start gap-5'>
                            <div className='flex-shrink-0 p-3 bg-accent/10 dark:bg-accent/20 rounded-2xl group-hover:bg-accent group-hover:scale-110 transition-all duration-300'>
                                <img src={feature.icon} alt={feature.title} className='w-8 h-8 md:w-10 md:h-10 dark:invert group-hover:invert-0 transition-all'/>
                            </div>
                            <div>
                                <h3 className='text-lg md:text-xl font-black text-heading mb-1 tracking-tight group-hover:text-accent transition-colors'>{feature.title}</h3>
                                <p className='text-body font-medium leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity'>{feature.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* Floating Decorative Elements */}
        <div className="absolute top-10 right-10 w-32 h-32 bg-accent/10 blur-[80px] rounded-full pointer-events-none"></div>
    </div>
  )
}

export default BottomBanner