import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { Link, useParams } from "react-router-dom";
import { assets } from "../assets/assets";
import ProductCard from "../components/ProductCard";

const ProductDetails = () => {

    const {products, navigate, currency, addToCart} = useAppContext();
    const {id} = useParams()
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [thumbnail, setThumbnail] = useState(null);

    const product = products.find((item)=> item._id === id);

    useEffect(()=>{
        if(products.length > 0 && product) {
            let productsCopy = products.slice();
            productsCopy = productsCopy.filter((item)=> product.category === item.category)
            setRelatedProducts(productsCopy.slice(0,5))
        }
    },[products, product])

    useEffect(()=>{
        setThumbnail(product?.image[0] ? product.image[0] : null)
    },[product])

    return product && (
        <div className="mt-12 animate-in fade-in duration-500">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 mb-8 text-[10px] font-black uppercase tracking-[0.2em] text-muted">
                <Link to={"/"} className="hover:text-accent transition-colors">Home</Link> 
                <span className="opacity-40">/</span>
                <Link to={"/products"} className="hover:text-accent transition-colors">Products</Link> 
                <span className="opacity-40">/</span>
                <Link to={`/products/${product.category.toLowerCase()}`} className="hover:text-accent transition-colors">{product.category}</Link> 
                <span className="opacity-40">/</span>
                <span className="text-accent underline underline-offset-4 decoration-accent/20">{product.name}</span>
            </div>

            <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
                {/* Media Gallery */}
                <div className="flex-1 flex flex-col md:flex-row-reverse gap-6">
                    <div className="flex-1 bg-surface dark:bg-card border border-border-main rounded-[40px] p-12 flex items-center justify-center relative overflow-hidden group shadow-inner">
                        <img src={thumbnail} alt="Selected product" className="max-w-[80%] max-h-[500px] object-contain group-hover:scale-110 transition-transform duration-700 ease-out drop-shadow-2xl" />
                        
                        {/* Interactive Accent */}
                        <div className="absolute top-10 right-10 w-32 h-32 bg-accent/5 blur-[100px] rounded-full pointer-events-none"></div>
                    </div>

                    <div className="flex md:flex-col gap-4 overflow-x-auto no-scrollbar pb-4 md:pb-0">
                        {product.image.map((image, index) => (
                            <div 
                                key={index} 
                                onClick={() => setThumbnail(image)} 
                                className={`w-24 h-24 flex-shrink-0 flex items-center justify-center bg-surface dark:bg-card border-2 rounded-2xl cursor-pointer p-3 transition-all duration-300 transform hover:-translate-y-1
                                    ${thumbnail === image ? 'border-accent shadow-lg shadow-accent/20' : 'border-border-soft hover:border-accent/40'}
                                `} 
                            >
                                <img src={image} alt={`Thumbnail ${index + 1}`} className="max-w-full h-full object-contain" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Product Info */}
                <div className="lg:w-[500px] space-y-10">
                    <div className="space-y-4">
                        <span className="px-4 py-1.5 bg-accent/10 text-accent text-[10px] font-black uppercase tracking-[0.25em] rounded-full border border-accent/20">Organic & Fresh</span>
                        <h1 className="text-4xl lg:text-5xl font-black text-heading leading-tight tracking-tighter">{product.name}</h1>
                        <div className="flex items-center gap-3">
                            <div className="flex items-center">
                                {Array(5).fill('').map((_, i) => (
                                    <img key={i} className="w-4 h-4" src={i<4 ? assets.star_icon : assets.star_dull_icon} alt="" />
                                ))}
                            </div>
                            <span className="text-muted font-bold text-sm tracking-wide">(4.8 / 5.0 • 1.2k Reviews)</span>
                        </div>
                    </div>

                    <div className="bg-surface dark:bg-card border border-border-main p-8 rounded-[32px] shadow-sm">
                        <div className="flex items-baseline gap-4 mb-2">
                             <p className="text-4xl font-black text-accent">{currency}{product.offerPrice}</p>
                             <p className="text-xl text-muted font-bold line-through decoration-red-500/50">{currency}{product.price}</p>
                        </div>
                        <p className="text-[10px] font-black text-muted uppercase tracking-widest leading-relaxed">Price inclusive of all taxes • Ships in 24h</p>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <h2 className="text-lg font-black text-heading uppercase tracking-tighter">About the Product</h2>
                            <div className="flex-1 h-[2px] bg-border-soft rounded-full"></div>
                        </div>
                        <ul className="space-y-4">
                            {product.description.map((desc, index) => (
                                <li key={index} className="flex gap-4 group">
                                    <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 group-hover:scale-150 transition-transform flex-shrink-0"></span>
                                    <p className="text-body font-medium leading-relaxed opacity-90">{desc}</p>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-4 pt-8">
                        <button 
                            onClick={()=> addToCart(product._id)} 
                            className="w-full py-5 px-8 cursor-pointer font-black rounded-2xl bg-surface dark:bg-card border border-border-main text-heading hover:bg-surface dark:hover:bg-accent/5 hover:border-accent/40 transition-all active:scale-95 uppercase tracking-widest text-xs" 
                        >
                            Add To Basket
                        </button>
                        <button 
                            onClick={()=> {addToCart(product._id); navigate("/cart")}} 
                            className="w-full py-5 px-8 cursor-pointer font-black rounded-2xl bg-accent text-white shadow-xl shadow-accent/20 hover:bg-primary-dull hover:-translate-y-1 transition-all active:scale-95 uppercase tracking-widest text-xs" 
                        >
                            Checkout Now
                        </button>
                    </div>
                </div>
            </div>

            {/* Related Products */}
            <div className="mt-32">
                <div className="flex items-center gap-4 mb-12">
                    <h2 className="text-3xl font-black text-heading uppercase tracking-tighter">You Might Also <span className="text-accent underline decoration-accent/20 underline-offset-8">Love</span></h2>
                    <div className="flex-1 h-[2px] bg-border-soft rounded-full"></div>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 md:gap-10">
                    {relatedProducts.filter((product)=>product.inStock).map((product, index)=>(
                        <ProductCard key={index} product={product}/>
                    ))}
                </div>
                
                <div className="flex justify-center mt-16">
                    <button onClick={()=> {navigate('/products'); scrollTo(0,0)}} className="group px-12 py-4 border-2 border-border-main text-muted font-black uppercase tracking-widest text-xs rounded-full hover:border-accent hover:text-accent transition-all active:scale-95">
                        Discover More Fresh Items
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails