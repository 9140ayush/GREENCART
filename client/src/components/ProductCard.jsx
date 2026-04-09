import React from "react";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";

const ProductCard = ({product}) => { 
    const {currency, addToCart, removeFromCart, cartItems, navigate} = useAppContext();
    

    return product && (
        <div 
            onClick={()=> {navigate(`/products/${product.category.toLowerCase()}/${product._id}`); scrollTo(0,0)}} 
            className="group relative border border-border-main rounded-2xl md:px-5 px-4 py-4 bg-card w-full transition-all duration-300 hover:shadow-2xl hover:shadow-black/10 dark:hover:shadow-black/40 hover:-translate-y-1.5 cursor-pointer overflow-hidden"
        >
            {/* Image Container - Premium Framing */}
            <div className="flex items-center justify-center p-4 bg-surface/50 dark:bg-page/40 rounded-xl mb-4 group-hover:bg-white dark:group-hover:bg-accent/5 transition-colors duration-500">
                <img className="group-hover:scale-110 transition-transform duration-500 max-w-28 md:max-w-36 drop-shadow-xl" src={product.image[0]} alt={product.name} />
            </div>

            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <p className="text-[10px] uppercase tracking-widest font-bold text-muted">{product.category}</p>
                    <div className="flex items-center gap-1 bg-accent/10 px-1.5 py-0.5 rounded text-accent text-[10px] font-bold">
                        <img className="w-2.5" src={assets.star_icon} alt="" />
                        (4.2)
                    </div>
                </div>

                <p className="text-heading font-bold text-base md:text-lg truncate group-hover:text-accent transition-colors">{product.name}</p>
                
                <div className="flex items-center gap-0.5">
                    {Array(5).fill('').map((_, i) => (
                        <img key={i} className="w-3" src={i < 4 ? assets.star_icon : assets.star_dull_icon} alt="" />
                    ))}
                    <span className="text-[10px] text-muted ml-1 font-medium">(120 reviews)</span>
                </div>

                <div className="flex items-center justify-between mt-4 pt-3 border-t border-border-soft">
                    <div className="flex flex-col">
                        <span className="text-[10px] text-muted line-through decoration-red-500/50">{currency}{product.price}</span>
                        <p className="text-xl font-black text-accent">
                            {currency}{product.offerPrice}
                        </p>
                    </div>

                    <div onClick={(e) => { e.stopPropagation(); }}>
                        {!cartItems[product._id] ? (
                            <button 
                                className="flex items-center justify-center gap-2 bg-accent hover:bg-primary-dull text-white px-5 h-[40px] rounded-xl font-bold transition-all shadow-lg shadow-accent/20 active:scale-90 cursor-pointer text-sm" 
                                onClick={() => addToCart(product._id)} 
                            >
                                <img src={assets.cart_icon} alt="cart_icon" className="w-4 invert brightness-200" />
                                Add
                            </button>
                        ) : (
                            <div className="flex items-center justify-between gap-1 w-24 h-[40px] bg-surface border border-border-main rounded-xl p-1 shadow-inner overflow-hidden">
                                <button 
                                    onClick={() => {removeFromCart(product._id)}} 
                                    className="w-8 h-full flex items-center justify-center cursor-pointer text-accent hover:bg-accent/10 rounded-lg transition-colors font-black text-lg" 
                                >
                                    -
                                </button>
                                <span className="flex-1 text-center font-bold text-heading text-sm">{cartItems[product._id]}</span>
                                <button 
                                    onClick={() => {addToCart(product._id)}} 
                                    className="w-8 h-full flex items-center justify-center cursor-pointer text-accent hover:bg-accent/10 rounded-lg transition-colors font-black text-lg" 
                                >
                                    +
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Subtle Gradient Accent */}
            <div className="absolute top-0 right-0 w-12 h-12 bg-accent/5 blur-2xl rounded-full"></div>
        </div>
    );
};

export default ProductCard;