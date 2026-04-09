import React, { useEffect, useState } from 'react'
import { useAppContext } from '../context/AppContext'
import ProductCard from '../components/ProductCard'

const AllProducts = () => {
    const {products, searchQuery} = useAppContext()
    const [filteredProducts, setFilteredProducts] = useState([])

    useEffect(()=>{
        if(typeof searchQuery === 'string' && searchQuery.length > 0) {
            setFilteredProducts(products.filter(
                product => product.name.toLowerCase().includes(searchQuery.toLowerCase())
            ))} else {
                setFilteredProducts(products)
            }
    },[products, searchQuery])

  return (
    <div className='mt-16 flex flex-col min-h-screen pb-24'>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div className='flex flex-col w-max'>
                <h1 className='text-3xl md:text-4xl font-black text-heading uppercase tracking-tighter'>All Products</h1>
                <div className='w-full h-1 bg-accent rounded-full mt-1'></div>
            </div>
            
            <p className="text-muted font-bold uppercase tracking-widest text-xs bg-surface px-4 py-2 rounded-full border border-border-soft">
                Showing {filteredProducts.filter(p => p.inStock).length} Fresh Items
            </p>
        </div>

        <div className='grid grid-cols-2 sm:grid:cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-8'>
            {filteredProducts.filter((product)=> product.inStock).map((product, index)=>(
                <ProductCard key={index} product={product}/>
            ))}
        </div>

        {filteredProducts.filter(p => p.inStock).length === 0 && (
            <div className="flex flex-col items-center justify-center py-32 space-y-4">
                <div className="w-20 h-20 bg-surface rounded-full flex items-center justify-center text-4xl">🥦</div>
                <h2 className="text-2xl font-black text-heading">No products found</h2>
                <p className="text-muted">Try adjusting your search or filters.</p>
            </div>
        )}
    </div>
  )
}

export default AllProducts