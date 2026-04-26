import { useEffect, useState } from "react"
import { useAppContext } from "../context/AppContext"
import { assets } from "../assets/assets";
import toast from "react-hot-toast";

const FREE_DELIVERY_THRESHOLD = 499

const Cart = () => {
    const { products, currency, cartItems, removeFromCart, getCartCount, updateCartItem, navigate, getCartAmount, axios, user, setCartItems } = useAppContext();
    const [cartArray, setCartArray] = useState([])
    const [addresses, setAddresses] = useState([])
    const [showAddress, setShowAddress] = useState(false)
    const [selectedAddress, setSelectedAddress] = useState(null)
    const [paymentOption, setPaymentOption] = useState("COD");
    const [promoCode, setPromoCode] = useState('')
    const [promoApplied, setPromoApplied] = useState(false)

    const getCart = () => {
        let tempArray = []
        for (const key in cartItems) {
            const product = products.find((item) => item._id === key)
            if (product) {
                const productWithQty = { ...product, quantity: cartItems[key] };
                tempArray.push(productWithQty)
            }
        }
        setCartArray(tempArray)
    }

    const getUserAddress = async () => {
        try {
            const { data } = await axios.get('/api/address/get');
            if (data.success) {
                setAddresses(data.addresses);
                if (data.addresses.length > 0) {
                    setSelectedAddress(data.addresses[0]);
                }
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    const placeOrder = async () => {
        try {
            if (!selectedAddress) {
                return toast.error("Please select a delivery address")
            }
            if (paymentOption === "COD") {
                const { data } = await axios.post('/api/order/cod', {
                    userId: user._id,
                    items: cartArray.map(item => ({ product: item._id, quantity: item.quantity })),
                    address: selectedAddress._id
                })
                if (data.success) {
                    toast.success(data.message);
                    setCartItems({})
                    navigate('/my-orders');
                } else {
                    toast.error(data.message);
                }
            } else {
                const { data } = await axios.post('/api/order/stripe', {
                    userId: user._id,
                    items: cartArray.map(item => ({ product: item._id, quantity: item.quantity })),
                    address: selectedAddress._id
                })
                if (data.success) {
                    window.location.replace(data.url);
                } else {
                    toast.error(data.message);
                }
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    const applyPromo = () => {
        if (promoCode.toUpperCase() === 'FRESH10') {
            setPromoApplied(true)
            toast.success('Promo code applied! 10% off')
        } else {
            toast.error('Invalid promo code')
        }
    }

    useEffect(() => {
        if (products.length > 0 && cartItems) getCart()
    }, [products, cartItems])

    useEffect(() => {
        if (user) getUserAddress();
    }, [user])

    const subtotal = getCartAmount()
    const discount = promoApplied ? Math.round(subtotal * 0.10) : 0
    const deliveryFee = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : 40
    const total = subtotal - discount + deliveryFee
    const remaining = FREE_DELIVERY_THRESHOLD - subtotal

    return products.length > 0 && cartItems ? (
        <div style={{ paddingTop: '32px', paddingBottom: '80px' }}>
            <h1 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.8rem, 3vw, 2.4rem)',
                fontWeight: 700, margin: '0 0 32px',
                color: 'var(--text-heading)',
                letterSpacing: '-0.02em',
            }}>
                Shopping Cart
                <span style={{
                    background: '#D8EDDE', color: '#3BB77E',
                    fontSize: '14px', fontWeight: 700,
                    padding: '3px 12px', borderRadius: '999px',
                    marginLeft: '14px', verticalAlign: 'middle',
                }}>{getCartCount()} items</span>
            </h1>

            <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-start', flexWrap: 'wrap' }}>

                {/* ─ Cart Items ─ */}
                <div style={{ flex: 1, minWidth: '280px' }}>

                    {/* Free delivery progress bar */}
                    {subtotal < FREE_DELIVERY_THRESHOLD && (
                        <div style={{
                            background: '#FDF3DC',
                            border: '1px solid #3BB77E',
                            borderRadius: '14px',
                            padding: '14px 18px',
                            marginBottom: '20px',
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <span style={{ fontSize: '13px', fontWeight: 600, color: '#8B6000' }}>
                                    🚚 Add {currency}{remaining} more for free delivery!
                                </span>
                                <span style={{ fontSize: '12px', color: '#8B6000' }}>{currency}{subtotal}/{currency}{FREE_DELIVERY_THRESHOLD}</span>
                            </div>
                            <div style={{ height: '6px', background: 'rgba(59, 183, 126,0.2)', borderRadius: '999px', overflow: 'hidden' }}>
                                <div style={{
                                    width: `${Math.min((subtotal / FREE_DELIVERY_THRESHOLD) * 100, 100)}%`,
                                    height: '100%', background: '#3BB77E', borderRadius: '999px',
                                    transition: 'width 0.4s ease',
                                }} />
                            </div>
                        </div>
                    )}
                    {subtotal >= FREE_DELIVERY_THRESHOLD && (
                        <div style={{
                            background: '#D8EDDE', border: '1px solid rgba(59, 183, 126,0.2)',
                            borderRadius: '14px', padding: '12px 18px', marginBottom: '20px',
                            fontSize: '13px', fontWeight: 600, color: '#3BB77E',
                        }}>✓ You've unlocked free delivery! 🎉</div>
                    )}

                    {/* Table Header */}
                    <div style={{
                        display: 'grid', gridTemplateColumns: '3fr 1fr 1fr',
                        padding: '0 4px 12px',
                        borderBottom: '1px solid var(--border-main)',
                        fontSize: '11px', fontWeight: 700,
                        textTransform: 'uppercase', letterSpacing: '0.12em',
                        color: 'var(--text-muted)',
                    }} className="hidden md:grid">
                        <span>Product</span>
                        <span style={{ textAlign: 'center' }}>Subtotal</span>
                        <span style={{ textAlign: 'right' }}>Remove</span>
                    </div>

                    {/* Cart Items */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '12px' }}>
                        {cartArray.map((product, index) => (
                            <div key={index} style={{
                                display: 'grid', gridTemplateColumns: '3fr 1fr 1fr',
                                alignItems: 'center', gap: '16px',
                                padding: '16px',
                                background: 'var(--bg-card)',
                                border: '1px solid var(--border-soft)',
                                borderRadius: '16px',
                                transition: 'box-shadow 0.2s',
                            }}
                                onMouseOver={e => e.currentTarget.style.boxShadow = 'var(--shadow-sm)'}
                                onMouseOut={e => e.currentTarget.style.boxShadow = 'none'}
                            >
                                {/* Product Info */}
                                <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                                    <div
                                        onClick={() => { navigate(`/products/${product.category.toLowerCase()}/${product._id}`); scrollTo(0, 0); }}
                                        style={{
                                            width: '72px', height: '72px',
                                            background: 'var(--bg-surface)',
                                            borderRadius: '12px',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            cursor: 'pointer', flexShrink: 0,
                                            transition: 'transform 0.2s',
                                        }}
                                        onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
                                        onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                                    >
                                        <img src={product.image[0]} alt={product.name} loading="lazy"
                                            style={{ maxWidth: '80%', maxHeight: '80%', objectFit: 'contain' }} />
                                    </div>
                                    <div>
                                        <p style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '3px' }}>{product.category}</p>
                                        <p style={{ fontWeight: 700, color: 'var(--text-heading)', fontSize: '15px', marginBottom: '8px' }}>{product.name}</p>
                                        {/* Qty stepper */}
                                        <div style={{
                                            display: 'flex', alignItems: 'center',
                                            background: 'var(--bg-surface)',
                                            border: '1px solid var(--border-main)',
                                            borderRadius: '10px', width: 'fit-content',
                                        }}>
                                            <button onClick={() => removeFromCart(product._id)} style={{
                                                width: '30px', height: '30px', border: 'none', background: 'none',
                                                cursor: 'pointer', color: '#3BB77E', fontWeight: 700, fontSize: '16px',
                                                borderRadius: '9px 0 0 9px', transition: 'background 0.15s',
                                            }}
                                                onMouseOver={e => e.currentTarget.style.background = '#D8EDDE'}
                                                onMouseOut={e => e.currentTarget.style.background = 'none'}
                                            >−</button>
                                            <span style={{ width: '32px', textAlign: 'center', fontWeight: 700, fontSize: '14px', color: 'var(--text-heading)' }}>
                                                {product.quantity}
                                            </span>
                                            <button onClick={() => updateCartItem(product._id, product.quantity + 1)} style={{
                                                width: '30px', height: '30px', border: 'none', background: 'none',
                                                cursor: 'pointer', color: '#3BB77E', fontWeight: 700, fontSize: '16px',
                                                borderRadius: '0 9px 9px 0', transition: 'background 0.15s',
                                            }}
                                                onMouseOver={e => e.currentTarget.style.background = '#D8EDDE'}
                                                onMouseOut={e => e.currentTarget.style.background = 'none'}
                                            >+</button>
                                        </div>
                                    </div>
                                </div>

                                {/* Subtotal */}
                                <p style={{
                                    textAlign: 'center',
                                    fontFamily: 'var(--font-display)',
                                    fontSize: '18px', fontWeight: 700,
                                    color: '#3BB77E',
                                }}>{currency}{product.offerPrice * product.quantity}</p>

                                {/* Remove */}
                                <div style={{ textAlign: 'right' }}>
                                    <button onClick={() => removeFromCart(product._id)} style={{
                                        padding: '8px', background: 'none',
                                        border: 'none', cursor: 'pointer', borderRadius: '10px',
                                        transition: 'background 0.15s',
                                    }}
                                        onMouseOver={e => e.currentTarget.style.background = '#fdecea'}
                                        onMouseOut={e => e.currentTarget.style.background = 'none'}
                                    >
                                        <img src={assets.remove_icon} alt="remove" style={{ width: '20px', opacity: 0.5 }} className="dark:invert" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Back to shopping */}
                    <button onClick={() => { navigate('/products'); scrollTo(0, 0); }}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '8px',
                            marginTop: '24px',
                            background: 'none', border: 'none', cursor: 'pointer',
                            color: '#3BB77E', fontWeight: 700, fontSize: '13px',
                            textTransform: 'uppercase', letterSpacing: '0.08em',
                        }}
                        onMouseOver={e => e.currentTarget.style.gap = '12px'}
                        onMouseOut={e => e.currentTarget.style.gap = '8px'}
                    >
                        ← Continue Shopping
                    </button>
                </div>

                {/* ─ Order Summary ─ */}
                <div style={{ width: '380px', maxWidth: '100%', position: 'sticky', top: '100px' }}>
                    <div style={{
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border-main)',
                        borderRadius: '24px', padding: '28px',
                        boxShadow: 'var(--shadow-md)',
                    }}>
                        <h2 style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: '1.4rem', fontWeight: 700,
                            color: 'var(--text-heading)', margin: '0 0 24px',
                        }}>Order Summary</h2>

                        {/* Delivery Address */}
                        <div style={{ marginBottom: '20px' }}>
                            <p style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '10px' }}>Delivery Address</p>
                            <div style={{
                                background: 'var(--bg-surface)',
                                border: '1px solid var(--border-soft)',
                                borderRadius: '14px', padding: '14px 16px',
                                position: 'relative',
                            }}>
                                <p style={{ fontSize: '13px', color: 'var(--text-body)', fontWeight: 500, lineHeight: 1.5, margin: 0 }}>
                                    {selectedAddress
                                        ? `${selectedAddress.street}, ${selectedAddress.city}, ${selectedAddress.state}, ${selectedAddress.country}`
                                        : "No address found"}
                                </p>
                                <button onClick={() => setShowAddress(!showAddress)} style={{
                                    background: 'none', border: 'none', cursor: 'pointer',
                                    color: '#3BB77E', fontSize: '12px', fontWeight: 700,
                                    textTransform: 'uppercase', letterSpacing: '0.08em',
                                    marginTop: '10px', display: 'block',
                                }}>
                                    {addresses.length > 0 ? 'Change Address ↓' : '+ Add Address'}
                                </button>
                                {showAddress && (
                                    <div style={{
                                        position: 'absolute', top: '100%', left: 0, right: 0,
                                        background: 'var(--bg-card)',
                                        border: '1px solid var(--border-main)',
                                        borderRadius: '14px', marginTop: '6px',
                                        boxShadow: 'var(--shadow-lg)', zIndex: 20,
                                        animation: 'fadeInUp 0.2s ease',
                                        overflow: 'hidden',
                                    }}>
                                        {addresses.map((addr, i) => (
                                            <div key={i} onClick={() => { setSelectedAddress(addr); setShowAddress(false); }}
                                                style={{
                                                    padding: '12px 16px', cursor: 'pointer',
                                                    fontSize: '13px', color: 'var(--text-body)',
                                                    borderBottom: i < addresses.length - 1 ? '1px solid var(--border-soft)' : 'none',
                                                    transition: 'background 0.15s',
                                                }}
                                                onMouseOver={e => e.currentTarget.style.background = 'var(--bg-surface)'}
                                                onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                                            >
                                                {addr.street}, {addr.city}
                                            </div>
                                        ))}
                                        <div onClick={() => { navigate('/add-address'); setShowAddress(false); }}
                                            style={{
                                                padding: '12px 16px', cursor: 'pointer',
                                                color: '#3BB77E', fontWeight: 700, fontSize: '13px',
                                                textAlign: 'center',
                                            }}
                                            onMouseOver={e => e.currentTarget.style.background = '#D8EDDE'}
                                            onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                                        >+ Add new address</div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div style={{ marginBottom: '20px' }}>
                            <p style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '10px' }}>Payment Method</p>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                {[
                                    { value: 'COD', label: '💵 Cash on Delivery' },
                                    { value: 'Online', label: '💳 Online (Stripe)' },
                                ].map(({ value, label }) => (
                                    <button key={value} onClick={() => setPaymentOption(value)}
                                        style={{
                                            flex: 1, padding: '10px',
                                            border: `1.5px solid ${paymentOption === value ? '#3BB77E' : 'var(--border-main)'}`,
                                            background: paymentOption === value ? '#D8EDDE' : 'transparent',
                                            color: paymentOption === value ? '#3BB77E' : 'var(--text-body)',
                                            borderRadius: '12px', cursor: 'pointer',
                                            fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '12px',
                                            transition: 'all 0.2s',
                                        }}>
                                        {label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Promo Code */}
                        {!promoApplied && (
                            <div style={{ marginBottom: '20px' }}>
                                <p style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '10px' }}>Promo Code</p>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <input value={promoCode} onChange={e => setPromoCode(e.target.value)}
                                        placeholder="Enter code (try FRESH10)"
                                        style={{
                                            flex: 1, padding: '10px 14px',
                                            border: '1px solid var(--border-main)',
                                            borderRadius: '12px', fontSize: '13px',
                                            background: 'var(--bg-surface)',
                                            color: 'var(--text-heading)',
                                            fontFamily: 'var(--font-body)', outline: 'none',
                                        }}
                                    />
                                    <button onClick={applyPromo} style={{
                                        padding: '10px 16px', background: '#3BB77E', color: '#fff',
                                        border: 'none', borderRadius: '12px', cursor: 'pointer',
                                        fontWeight: 700, fontSize: '13px',
                                    }}>Apply</button>
                                </div>
                            </div>
                        )}
                        {promoApplied && (
                            <div style={{
                                background: '#D8EDDE', borderRadius: '10px',
                                padding: '10px 14px', marginBottom: '20px',
                                fontSize: '13px', fontWeight: 600, color: '#3BB77E',
                            }}>✓ FRESH10 applied — 10% discount!</div>
                        )}

                        {/* Price Summary */}
                        <div style={{ borderTop: '1px solid var(--border-soft)', paddingTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {[
                                { label: 'Subtotal', value: `${currency}${subtotal.toFixed(2)}` },
                                ...(discount > 0 ? [{ label: 'Promo Discount', value: `-${currency}${discount}`, color: '#29A56C' }] : []),
                                { label: 'Delivery', value: deliveryFee === 0 ? 'FREE' : `${currency}${deliveryFee}`, color: '#29A56C' },
                            ].map(({ label, value, color }) => (
                                <div key={label} style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600 }}>{label}</span>
                                    <span style={{ fontSize: '14px', fontWeight: 700, color: color || 'var(--text-body)' }}>{value}</span>
                                </div>
                            ))}
                            <div style={{
                                display: 'flex', justifyContent: 'space-between',
                                paddingTop: '14px', marginTop: '4px',
                                borderTop: '2px solid var(--border-main)',
                            }}>
                                <span style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 700, color: 'var(--text-heading)' }}>Total</span>
                                <span style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 700, color: '#3BB77E' }}>{currency}{total.toFixed(2)}</span>
                            </div>
                        </div>

                        {/* CTA */}
                        <button onClick={placeOrder}
                            style={{
                                width: '100%', marginTop: '20px',
                                padding: '16px',
                                background: '#3BB77E', color: '#fff',
                                border: 'none', borderRadius: '14px', cursor: 'pointer',
                                fontFamily: 'var(--font-body)',
                                fontWeight: 700, fontSize: '15px',
                                boxShadow: '0 4px 16px rgba(59, 183, 126,0.30)',
                                transition: 'all 0.2s',
                            }}
                            onMouseOver={e => { e.currentTarget.style.background = '#29A56C'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                            onMouseOut={e => { e.currentTarget.style.background = '#3BB77E'; e.currentTarget.style.transform = 'translateY(0)'; }}
                        >
                            {paymentOption === "COD" ? "Place Order →" : "Proceed to Stripe →"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    ) : (
        <div style={{
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            padding: '96px 0', gap: '24px',
            animation: 'fadeInUp 0.4s ease',
        }}>
            <div style={{
                width: '96px', height: '96px',
                background: 'var(--bg-surface)',
                borderRadius: '28px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '48px',
                border: '1px solid var(--border-main)',
                boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.04)',
            }}>🛒</div>
            <div style={{ textAlign: 'center' }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700, color: 'var(--text-heading)', margin: '0 0 8px' }}>
                    Your cart is empty
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>
                    Looks like you haven't added any fresh items yet.
                </p>
            </div>
            <button onClick={() => navigate('/products')}
                style={{
                    padding: '14px 36px',
                    background: '#3BB77E', color: '#fff',
                    border: 'none', borderRadius: '999px', cursor: 'pointer',
                    fontWeight: 700, fontSize: '15px',
                    boxShadow: '0 4px 16px rgba(59, 183, 126,0.30)',
                    transition: 'all 0.2s',
                }}
                onMouseOver={e => e.currentTarget.style.transform = 'scale(1.04)'}
                onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
            >
                Start Shopping
            </button>
        </div>
    )
}

export default Cart