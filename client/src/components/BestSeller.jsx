import React from 'react'
import ProductCard from './ProductCard'
import { useAppContext } from '../context/AppContext'

const BestSeller = () => {
    const { products } = useAppContext();
  return (
    <div className='mt-24'>
        <div className="flex items-center gap-3 mb-8">
            <h2 className='text-2xl md:text-3xl font-black text-heading uppercase tracking-tight'>Best Sellers</h2>
            <div className="flex-1 h-[2px] bg-border-soft rounded-full"></div>
        </div>
        
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-8'>
            {products.filter((product)=> product.inStock).slice(0,5).map((product, index)=>(
                <ProductCard key={index} product={product}/>
            ))}
        </div>
    </div>
  )
}

export default BestSeller