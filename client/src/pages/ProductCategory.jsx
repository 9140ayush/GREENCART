import React from 'react'
import { useAppContext } from '../context/AppContext'
import { useParams, useNavigate } from 'react-router-dom';
import { categories } from '../assets/assets';
import ProductCard from '../components/ProductCard';

const ProductCategory = () => {

    const { products } = useAppContext();
    const { category } = useParams();
    const navigate = useNavigate();

    const searchCategory = categories.find((item)=> item.path.toLowerCase() === category)
    const filteredProducts = products.filter((product)=>product.category.toLowerCase() === category)

  return (
    <div className='mt-16 min-h-screen pb-24'>
        {searchCategory && (
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div className='flex flex-col w-max'>
                    <h1 className='text-3xl md:text-4xl font-black text-heading uppercase tracking-tighter'>{searchCategory.text}</h1>
                    <div className='w-full h-1 bg-accent rounded-full mt-1'></div>
                </div>
                <p className="text-muted font-bold uppercase tracking-widest text-xs bg-surface px-4 py-2 rounded-full border border-border-soft">
                    {filteredProducts.length} Fresh Items Found
                </p>
            </div>
        )}

        {filteredProducts.length > 0 ? (
            <div className='grid grid-cols-2 sm:grid:cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-8 mt-6'>
                {filteredProducts.map((product, index)=>(
                    <ProductCard key={index} product={product} />
                ))}
            </div>
        ): (
            <div className='flex flex-col items-center justify-center py-48 space-y-6'>
                <div className="text-6xl">🥬</div>
                <h2 className='text-2xl font-black text-heading uppercase tracking-tighter'>Harvest Pending</h2>
                <p className='text-muted font-medium max-w-sm text-center'>We don't have any products in the <span className="text-heading font-black">{category}</span> category right now. Check back soon for fresh arrivals!</p>
                <button onClick={() => navigate('/products')} className="px-8 py-3 bg-accent text-white font-black rounded-full shadow-lg shadow-accent/20 hover:scale-105 transition-all">Explore All Products</button>
            </div>
        )}
    </div>
  )
}

export default ProductCategory