import { useEffect, useState } from "react"
import { useAppContext } from "../context/AppContext"
import { assets, dummyAddress } from "../assets/assets";
import toast from "react-hot-toast";

const Cart = () => {
    const {products, currency, cartItems, removeFromCart, getCartCount, updateCartItem, navigate, getCartAmount, axios, user, setCartItems} = useAppContext();
    const [cartArray, setCartArray] = useState([])
    const [addresses, setAddresses] = useState([])  
    const [showAddress, setShowAddress] = useState(false)
    const [selectedAddress, setSelectedAddress] = useState(null)
    const [paymentOption, setPaymentOption] = useState("COD");

    const getCart = ()=>{
        let tempArray = []
        for(const key in cartItems) {
            const product = products.find((item)=>item._id === key)
            if(product) {
                const productWithQty = { ...product, quantity: cartItems[key] };
                tempArray.push(productWithQty)
            }
        }
        setCartArray(tempArray)
    }

    const getUserAddress = async ()=>{
        try {
            const {data} = await axios.get('/api/address/get');
            if(data.success){
                setAddresses(data.addresses);
                if(data.addresses.length > 0){
                    setSelectedAddress(data.addresses[0]);
                }
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    const placeOrder = async ()=>{
        try {
            if(!selectedAddress) {
                return toast.error("Please select an address")
            }

            // Place order with COD
            if(paymentOption === "COD") {
                const {data} = await axios.post('/api/order/cod', {
                    userId: user._id,
                    items: cartArray.map(item => ({
                        product: item._id,
                        quantity: item.quantity,
                    })),
                    address: selectedAddress._id
                })
                if(data.success) {
                    toast.success(data.message);   
                    setCartItems({})
                    navigate('/my-orders');
                } else {
                    toast.error(data.message);
                }
            }else {
                //Place Order with Stripe
                const {data} = await axios.post('/api/order/stripe', {
                    userId: user._id,
                    items: cartArray.map(item => ({
                        product: item._id,
                        quantity: item.quantity,
                    })),
                    address: selectedAddress._id
                })
                if(data.success) {
                    window.location.replace(data.url);
                } else {
                    toast.error(data.message);
                }
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    useEffect(()=>{
        if(products.length > 0 && cartItems) {
            getCart()
        }
    },[products, cartItems])

    useEffect(()=>{
        if(user) {
            getUserAddress();
        }
    },[user])

    return products.length > 0 && cartItems ? (
        <div className="flex flex-col lg:flex-row mt-12 gap-10 min-h-screen pb-24">
            <div className='flex-1'>
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-black text-heading uppercase tracking-tighter">
                        Shopping Cart <span className="text-sm font-bold text-accent bg-accent/10 px-3 py-1 rounded-full ml-4 tracking-normal uppercase">{getCartCount()} Items</span>
                    </h1>
                </div>

                <div className="hidden md:grid grid-cols-[3fr_1fr_1fr] text-muted text-xs font-black uppercase tracking-[0.2em] border-b border-border-main pb-4 mb-4">
                    <p className="text-left">Product Details</p>
                    <p className="text-center">Subtotal</p>
                    <p className="text-right pr-4">Remove</p>
                </div>

                <div className="space-y-4">
                    {cartArray.map((product, index) => (
                        <div key={index} className="grid grid-cols-1 md:grid-cols-[3fr_1fr_1fr] items-center gap-6 p-4 rounded-2xl bg-card border border-border-soft hover:border-accent/30 transition-all group">
                            <div className="flex items-center gap-6">
                                <div onClick={()=>{
                                    navigate(`/products/${product.category.toLowerCase()}/${product._id}`); scrollTo(0, 0)
                                }} className="cursor-pointer w-24 h-24 flex-shrink-0 flex items-center justify-center bg-surface rounded-xl overflow-hidden group-hover:scale-105 transition-transform duration-500">
                                    <img className="max-w-[80%] h-full object-contain drop-shadow-md" src={product.image[0]} alt={product.name} />
                                </div>
                                <div className="flex-1 space-y-1">
                                    <p className="font-black text-heading text-lg leading-tight group-hover:text-accent transition-colors">{product.name}</p>
                                    <div className="flex flex-wrap items-center gap-3">
                                        <p className="text-xs font-bold text-muted uppercase tracking-widest">{product.category}</p>
                                        <span className="w-1 h-1 rounded-full bg-border-main"></span>
                                        <p className="text-sm font-bold text-body">Weight: <span className="text-muted">{product.weight || "N/A"}</span></p>
                                    </div>
                                    <div className='flex items-center gap-2 mt-2 bg-surface w-max px-3 py-1.5 rounded-lg border border-border-soft'>
                                        <label className="text-[10px] font-black text-muted uppercase tracking-widest">Qty:</label>
                                        <select 
                                            onChange={e => updateCartItem(product._id, Number(e.target.value))} 
                                            value={product.quantity} 
                                            className='outline-none bg-transparent text-sm font-black text-heading cursor-pointer'
                                        >
                                            {Array(Math.max(product.quantity, 9)).fill('').map((_, index) => (
                                                <option key={index} value={index + 1}>{index + 1}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <p className="text-center font-black text-xl text-accent">
                                {currency}{product.offerPrice * product.quantity}
                            </p>
                            <div className="text-right">
                                <button onClick={()=> removeFromCart(product._id)} className="cursor-pointer p-3 hover:bg-red-500/10 rounded-xl transition-all group/btn">
                                    <img src={assets.remove_icon} alt="remove" className="w-6 h-6 dark:invert opacity-40 group-hover/btn:opacity-100 group-hover/btn:scale-110"/>
                                </button>
                            </div>
                        </div>)
                    )}
                </div>

                <button onClick={()=> {navigate("/products"); scrollTo(0,0)}} className="group cursor-pointer flex items-center mt-12 gap-3 text-accent font-black uppercase tracking-widest text-sm hover:gap-5 transition-all">
                    <img className="rotate-180 dark:invert transition-transform group-hover:scale-125" src={assets.arrow_right_icon_colored} alt="arrow" />
                    Back to Shopping
                </button>

            </div>

            <div className="lg:w-[400px] w-full max-md:mt-16">
                <div className="bg-surface dark:bg-card border border-border-main p-8 rounded-[32px] shadow-2xl relative overflow-hidden sticky top-24">
                    <h2 className="text-2xl font-black text-heading mb-8 uppercase tracking-tighter">Order Summary</h2>
                    
                    <div className="space-y-6 mb-8">
                        <div>
                            <p className="text-[10px] font-black text-muted uppercase tracking-[0.2em] mb-3">Delivery Address</p>
                            <div className="relative group/addr bg-page dark:bg-surface border border-border-soft p-4 rounded-2xl">
                                <p className="text-sm font-bold text-body leading-relaxed">
                                    {selectedAddress ? `${selectedAddress.street}, ${selectedAddress.city}, ${selectedAddress.state}, ${selectedAddress.country}`: "No address found"}
                                </p>
                                <button onClick={() => setShowAddress(!showAddress)} className="text-accent text-[10px] font-black uppercase tracking-widest hover:underline cursor-pointer mt-3 w-full text-right transition-all">
                                    {addresses.length > 0 ? "Change Address" : "Add Address"}
                                </button>
                                {showAddress && (
                                    <div className="absolute top-full left-0 right-0 mt-3 py-3 bg-card border border-border-main rounded-2xl shadow-2xl z-20 animate-in fade-in slide-in-from-top-2 overflow-hidden">
                                        {addresses.map((address, index)=>(
                                            <div key={index} onClick={() => {setSelectedAddress(address); setShowAddress(false)}} className="text-sm font-bold text-body p-4 hover:bg-surface cursor-pointer transition-colors border-b border-border-soft last:border-0">
                                                {address.street}, {address.city}, {address.state}, {address.country}
                                            </div>
                                        ))}
                                        <div onClick={() => {navigate("/add-address"); setShowAddress(false)}} className="text-accent font-black text-sm text-center cursor-pointer p-4 hover:bg-accent/10 transition-colors">
                                            + Add new address
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div>
                            <p className="text-[10px] font-black text-muted uppercase tracking-[0.2em] mb-3">Payment Method</p>
                            <select 
                                onChange={e => setPaymentOption(e.target.value)} 
                                className="w-full border border-border-soft bg-page dark:bg-surface text-heading font-bold px-5 py-4 outline-none rounded-2xl text-sm appearance-none cursor-pointer focus:border-accent/40 transition-all pr-12"
                                style={{backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%234FBF8B' stroke-width='3'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1.25rem center', backgroundSize: '1.25rem'}}
                            >
                                <option value="COD">Cash On Delivery</option>
                                <option value="Online">Online Payment (Stripe)</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-4 pt-6 border-t border-border-soft">
                        <div className="flex justify-between text-body font-bold">
                            <span className="opacity-60 uppercase tracking-widest text-[10px]">Subtotal</span>
                            <span>{currency}{getCartAmount()}</span>
                        </div>
                        <div className="flex justify-between text-body font-bold">
                            <span className="opacity-60 uppercase tracking-widest text-[10px]">Shipping</span>
                            <span className="text-accent">FREE</span>
                        </div>
                        <div className="flex justify-between text-body font-bold">
                            <span className="opacity-60 uppercase tracking-widest text-[10px]">Estimated Tax (2%)</span>
                            <span>{currency}{(getCartAmount() * 0.02).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between pt-6 mt-2 border-t border-border-soft">
                            <span className="text-heading font-black text-lg uppercase tracking-tighter">Total Payable</span>
                            <span className="text-2xl font-black text-accent">{currency}{(getCartAmount() * 1.02).toFixed(2)}</span>
                        </div>
                    </div>

                    <button onClick={placeOrder} className="w-full py-5 mt-10 cursor-pointer bg-accent text-white font-black rounded-2xl shadow-xl shadow-accent/30 hover:bg-primary-dull hover:-translate-y-1 active:translate-y-0 transition-all uppercase tracking-[0.1em] text-sm">
                        {paymentOption === "COD" ? "Place Your Order" : "Proceed to Checkout"}
                    </button>

                    {/* Decorative Blob */}
                    <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-accent/5 blur-[50px] rounded-full"></div>
                </div>
            </div>
        </div>
    ) : (
        <div className="flex flex-col items-center justify-center py-48 space-y-8 animate-in fade-in zoom-in duration-500">
            <div className="w-32 h-32 bg-surface rounded-[40px] flex items-center justify-center text-6xl shadow-inner border border-border-soft">🛒</div>
            <div className="text-center">
                <h2 className="text-4xl font-black text-heading uppercase tracking-tighter mb-2">Your cart is empty</h2>
                <p className="text-muted font-medium">Looks like you haven't added any fresh items yet.</p>
            </div>
            <button onClick={() => navigate('/products')} className="px-12 py-4 bg-accent text-white font-black rounded-full shadow-xl shadow-accent/20 hover:scale-105 active:scale-95 transition-all">
                Shop Our Collection
            </button>
        </div>
    )
}

export default Cart