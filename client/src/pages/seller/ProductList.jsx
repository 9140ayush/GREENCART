import React from 'react'
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const ProductList = () => {

    const { products, currency, axios, fetchProducts } = useAppContext()

    const toggleStock = async (id, inStock)=>{
        try {
            const {data} = await axios.post('/api/product/stock', {id, inStock});
            if(data.success){
                fetchProducts();
                toast.success(data.message)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

  return (
        <div className="no-scrollbar flex-1 animate-in fade-in duration-500">
            <div className="mb-10">
                <h1 className="text-3xl font-black text-heading uppercase tracking-tighter">Inventory Control</h1>
                <p className="text-muted font-bold uppercase tracking-widest text-[10px] mt-1">Total {products.length} Products Catalogued</p>
            </div>

            <div className="w-full max-w-5xl rounded-[32px] overflow-hidden bg-card border border-border-main shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-surface/50 border-b border-border-main">
                                <th className="px-8 py-6 text-left text-[10px] font-black text-muted uppercase tracking-[0.2em]">Product Details</th>
                                <th className="px-8 py-6 text-left text-[10px] font-black text-muted uppercase tracking-[0.2em]">Category</th>
                                <th className="px-8 py-6 text-left text-[10px] font-black text-muted uppercase tracking-[0.2em]">Price</th>
                                <th className="px-8 py-6 text-right text-[10px] font-black text-muted uppercase tracking-[0.2em]">Availability</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-soft">
                            {products.map((product) => (
                                <tr key={product._id} className="group hover:bg-surface/30 transition-colors">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-16 h-16 bg-surface rounded-xl border border-border-soft flex items-center justify-center p-2 group-hover:scale-105 transition-transform">
                                                <img src={product.image[0]} alt="Product" className="max-w-full max-h-full object-contain drop-shadow-sm" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-black text-heading group-hover:text-accent transition-colors">{product.name}</span>
                                                <span className="text-[10px] text-muted font-bold tracking-widest uppercase">ID: {product._id.slice(-6)}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className="text-xs font-black text-body uppercase tracking-wider bg-surface px-3 py-1 rounded-full border border-border-soft">
                                            {product.category}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex flex-col">
                                            <span className="text-lg font-black text-accent">{currency}{product.offerPrice}</span>
                                            <span className="text-[10px] text-muted line-through">{currency}{product.price}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <button 
                                            onClick={()=> toggleStock(product._id, !product.inStock)}
                                            className={`relative inline-flex items-center h-8 w-14 rounded-full cursor-pointer transition-all duration-300 outline-none
                                                ${product.inStock ? 'bg-accent shadow-lg shadow-accent/20' : 'bg-muted/20'}
                                            `}
                                        >
                                            <span className={`inline-block h-6 w-6 rounded-full bg-white shadow-md transform transition-transform duration-300
                                                ${product.inStock ? 'translate-x-7' : 'translate-x-1'}
                                            `} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {products.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-32 space-y-4">
                        <div className="text-4xl">📦</div>
                        <h2 className="text-xl font-black text-heading uppercase tracking-tight">No products listed</h2>
                        <p className="text-muted text-sm font-bold uppercase tracking-widest">Start by adding your first product to the catalogue.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ProductList