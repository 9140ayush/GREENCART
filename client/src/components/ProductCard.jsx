import React, { useState, useEffect, useRef } from "react";
import { useAppContext } from "../context/AppContext";

const ProductCard = ({ product }) => {
    const { currency, addToCart, removeFromCart, cartItems, navigate } = useAppContext();
    const [wishlisted, setWishlisted] = useState(false);
    const [showQuickView, setShowQuickView] = useState(false);
    const cardRef = useRef(null);

    // Scroll animation via IntersectionObserver
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            },
            { threshold: 0.1 }
        );
        if (cardRef.current) observer.observe(cardRef.current);
        return () => observer.disconnect();
    }, []);

    const handleWishlist = (e) => {
        e.stopPropagation();
        setWishlisted(prev => !prev);
    };

    const discountPct = product.price > product.offerPrice
        ? Math.round((1 - product.offerPrice / product.price) * 100)
        : 0;

    const getBadge = () => {
        if (product.badge) return product.badge;
        if (discountPct >= 10) return `${discountPct}% OFF`;
        if (product.tags?.includes('organic')) return 'Organic';
        return null;
    };
    const badge = getBadge();

    return product ? (
        <div
            ref={cardRef}
            className="animate-on-scroll"
            style={{ position: 'relative' }}
        >
            <div
                onClick={() => { navigate(`/products/${product.category.toLowerCase()}/${product._id}`); scrollTo(0, 0); }}
                style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-main)',
                    borderRadius: '20px',
                    padding: '16px',
                    cursor: 'pointer',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    position: 'relative',
                    overflow: 'hidden',
                }}
                className="product-card group"
            >
                {/* Badge */}
                {badge && (
                    <div style={{
                        position: 'absolute', top: '12px', left: '12px', zIndex: 2,
                        background: badge.includes('OFF') ? '#C0392B' : '#3BB77E',
                        color: '#fff',
                        fontSize: '10px', fontWeight: 700,
                        padding: '3px 10px',
                        borderRadius: '999px',
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase',
                    }}>{badge}</div>
                )}

                {/* Wishlist Heart */}
                <button
                    onClick={handleWishlist}
                    style={{
                        position: 'absolute', top: '12px', right: '12px', zIndex: 2,
                        background: wishlisted ? '#fff0f0' : 'var(--bg-surface)',
                        border: `1px solid ${wishlisted ? '#ffb3b3' : 'var(--border-main)'}`,
                        borderRadius: '50%',
                        width: '32px', height: '32px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        animation: wishlisted ? 'heartPop 0.3s ease' : 'none',
                    }}
                    aria-label="Add to wishlist"
                >
                    <svg width="14" height="14" viewBox="0 0 24 24"
                        fill={wishlisted ? '#e53935' : 'none'}
                        stroke={wishlisted ? '#e53935' : 'var(--text-muted)'}
                        strokeWidth="2">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                </button>

                {/* Product Image */}
                <div style={{
                    background: 'var(--bg-surface)',
                    borderRadius: '14px',
                    padding: '20px',
                    marginBottom: '14px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    minHeight: '160px',
                    position: 'relative', overflow: 'hidden',
                }}>
                    <img
                        className="product-image"
                        src={product.image[0]}
                        alt={product.name}
                        loading="lazy"
                        style={{
                            maxWidth: '120px', maxHeight: '120px',
                            objectFit: 'contain',
                            filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.10))',
                        }}
                    />
                    {/* Quick View Overlay */}
                    <div style={{
                        position: 'absolute', bottom: 0, left: 0, right: 0,
                        background: 'rgba(59, 183, 126,0.88)',
                        color: '#fff',
                        textAlign: 'center',
                        padding: '10px',
                        fontSize: '12px', fontWeight: 600,
                        transform: 'translateY(100%)',
                        transition: 'transform 0.25s ease',
                        borderRadius: '0 0 14px 14px',
                        letterSpacing: '0.05em',
                    }} className="group-hover:!translate-y-0"
                        onClick={(e) => { e.stopPropagation(); navigate(`/products/${product.category.toLowerCase()}/${product._id}`); scrollTo(0, 0); }}
                    >
                        👁️ Quick View
                    </div>
                </div>

                {/* Info */}
                <div>
                    {/* Category + Rating */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <span style={{
                            fontSize: '10px', fontWeight: 700,
                            textTransform: 'uppercase', letterSpacing: '0.1em',
                            color: 'var(--text-muted)',
                        }}>{product.category}</span>
                        <span style={{
                            fontSize: '11px', fontWeight: 600,
                            background: 'rgba(59, 183, 126, 0.12)',
                            color: '#3BB77E',
                            padding: '2px 7px', borderRadius: '999px',
                            display: 'flex', alignItems: 'center', gap: '3px',
                        }}>★ 4.5</span>
                    </div>

                    {/* Name */}
                    <p style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '16px', fontWeight: 600,
                        color: 'var(--text-heading)',
                        marginBottom: '4px',
                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                        transition: 'color 0.2s',
                        lineHeight: 1.3,
                    }} className="group-hover:!text-primary">{product.name}</p>

                    {/* Sold count */}
                    <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '12px' }}>
                        {Math.floor(Math.random() * 200 + 50)} sold
                    </p>

                    {/* Freshness Badge */}
                    {product.freshness?.harvestDate && (() => {
                        const days = Math.floor((Date.now() - new Date(product.freshness.harvestDate)) / 86400000);
                        return (
                            <span style={{
                                fontSize: '10px', fontWeight: 600,
                                color: days <= 2 ? '#29A56C' : days <= 4 ? '#F59E0B' : '#C0392B',
                                background: days <= 2 ? '#D8EDDE' : days <= 4 ? '#FEF3C7' : '#fdecea',
                                padding: '2px 8px', borderRadius: '999px',
                                display: 'inline-block', marginBottom: '10px',
                            }}>
                                🌿 Harvested {days}d ago
                            </span>
                        );
                    })()}

                    {/* Price + Cart Controls */}
                    <div style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        paddingTop: '12px',
                        borderTop: '1px solid var(--border-soft)',
                    }}>
                        <div>
                            <span style={{ fontSize: '11px', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                                {currency}{product.price}
                            </span>
                            <p style={{
                                fontFamily: 'var(--font-display)',
                                fontSize: '20px', fontWeight: 700,
                                color: '#3BB77E',
                                lineHeight: 1,
                            }}>{currency}{product.offerPrice}</p>
                        </div>

                        <div onClick={(e) => e.stopPropagation()}>
                            {!cartItems[product._id] ? (
                                <button
                                    onClick={() => addToCart(product._id)}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '6px',
                                        background: '#3BB77E', color: '#fff',
                                        border: 'none', borderRadius: '12px',
                                        padding: '9px 16px',
                                        fontSize: '13px', fontWeight: 600,
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        boxShadow: '0 2px 8px rgba(59, 183, 126,0.25)',
                                    }}
                                    onMouseOver={e => e.currentTarget.style.background = '#29A56C'}
                                    onMouseOut={e => e.currentTarget.style.background = '#3BB77E'}
                                >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                                    </svg>
                                    Add
                                </button>
                            ) : (
                                <div style={{
                                    display: 'flex', alignItems: 'center', gap: '4px',
                                    background: 'var(--bg-surface)',
                                    border: '1px solid var(--border-main)',
                                    borderRadius: '12px',
                                    padding: '4px',
                                    width: '100px',
                                }}>
                                    <button
                                        onClick={() => removeFromCart(product._id)}
                                        style={{
                                            width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            background: 'none', border: 'none', cursor: 'pointer',
                                            color: '#3BB77E', fontSize: '18px', fontWeight: 700,
                                            borderRadius: '8px',
                                        }}
                                        onMouseOver={e => e.currentTarget.style.background = '#D8EDDE'}
                                        onMouseOut={e => e.currentTarget.style.background = 'none'}
                                    >−</button>
                                    <span style={{ flex: 1, textAlign: 'center', fontWeight: 700, color: 'var(--text-heading)', fontSize: '15px' }}>
                                        {cartItems[product._id]}
                                    </span>
                                    <button
                                        onClick={() => addToCart(product._id)}
                                        style={{
                                            width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            background: 'none', border: 'none', cursor: 'pointer',
                                            color: '#3BB77E', fontSize: '18px', fontWeight: 700,
                                            borderRadius: '8px',
                                        }}
                                        onMouseOver={e => e.currentTarget.style.background = '#D8EDDE'}
                                        onMouseOut={e => e.currentTarget.style.background = 'none'}
                                    >+</button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    ) : null;
};

export default ProductCard;