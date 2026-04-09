import React from 'react'
import { categories } from '../assets/assets'
import {useAppContext} from '../context/AppContext'

const Categories = () => {
  const {navigate} = useAppContext()
  return (
    <div className='mt-24 lg:mt-32'>
        {/* Section Heading */}
        <div className="flex items-center gap-3 mb-10">
            <h2 className='text-2xl md:text-3xl font-black text-heading uppercase tracking-tight'>Shop by Category</h2>
            <div className="flex-1 h-[2px] bg-border-soft rounded-full"></div>
        </div>

        {/* Forced One-Row Grid for Desktop (7 items) */}
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4 md:gap-5'>
            {categories.map((category, index)=>(
              <div key={index} 
                className='group relative cursor-pointer p-5 py-8 rounded-[32px] flex flex-col justify-center items-center transition-all duration-500 hover:-translate-y-2 border border-transparent dark:hover:border-accent/40 overflow-hidden w-full' 
                style={{backgroundColor: category.bgColor}}
                onClick={()=>{
                  navigate(`/products/${category.path.toLowerCase()}`);
                  scrollTo(0, 0)
                }}
              >
                {/* Responsive Dark Mode Overlay */}
                <div className="absolute inset-0 bg-card/60 dark:bg-card/90 opacity-0 dark:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                
                <div className="relative z-10 flex flex-col items-center gap-5">
                  <div className="p-4 bg-white/40 dark:bg-surface/50 rounded-[24px] backdrop-blur-sm group-hover:bg-white dark:group-hover:bg-accent/10 transition-all duration-500 shadow-sm">
                    <img src={category.image} alt={category.text} className='w-12 h-12 md:w-14 md:h-14 object-contain group-hover:scale-110 transition-transform duration-500 drop-shadow-md'/>
                  </div>
                  <p className='text-xs sm:text-sm font-black text-gray-800 dark:text-heading group-hover:text-accent transition-all tracking-wide text-center leading-tight h-8 flex items-center'>{category.text}</p>
                </div>

                {/* Refined Glow Effect */}
                <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-accent/10 blur-[50px] opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
            ))}
        </div>
    </div>
  )
}

export default Categories