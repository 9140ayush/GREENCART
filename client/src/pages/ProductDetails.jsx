import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { Link, useParams } from "react-router-dom";
import { assets } from "../assets/assets";
import ProductCard from "../components/ProductCard";

const TABS = ['Description', 'Nutrition Facts', 'Reviews', 'Q&A'];

const NutritionBar = ({ label, value, max, color }) => (
  <div style={{ marginBottom: '12px' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
      <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-body)' }}>{label}</span>
      <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-heading)' }}>{value}g</span>
    </div>
    <div style={{ height: '6px', background: 'var(--border-main)', borderRadius: '999px', overflow: 'hidden' }}>
      <div style={{
        width: `${Math.min((value / max) * 100, 100)}%`,
        height: '100%',
        background: color,
        borderRadius: '999px',
        transition: 'width 0.6s ease',
      }} />
    </div>
  </div>
);

const ProductDetails = () => {
  const { products, navigate, currency, addToCart, axios } = useAppContext();
  const { id } = useParams()
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [thumbnail, setThumbnail] = useState(null);
  const [activeTab, setActiveTab] = useState('Description');
  const [pincode, setPincode] = useState('');
  const [delivery, setDelivery] = useState(null);
  const [nutrition, setNutrition] = useState(null);
  const [nutritionLoading, setNutritionLoading] = useState(false);

  const product = products.find((item) => item._id === id);

  useEffect(() => {
    if (products.length > 0 && product) {
      let productsCopy = products.slice();
      productsCopy = productsCopy.filter((item) => product.category === item.category && item._id !== id)
      setRelatedProducts(productsCopy.slice(0, 5))
    }
  }, [products, product])

  useEffect(() => {
    setThumbnail(product?.image[0] ? product.image[0] : null)
  }, [product])

  const checkDelivery = () => {
    if (pincode.length === 6) {
      const days = Math.floor(Math.random() * 2) + 1;
      const date = new Date();
      date.setDate(date.getDate() + days);
      setDelivery(`Estimated delivery by ${date.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}`)
    }
  }

  const analyzeNutrition = async () => {
    setNutritionLoading(true);
    try {
      const { data } = await axios.post(`/api/products/${product._id}/nutrition`, {
        productName: product.name,
        category: product.category
      });
      setNutrition(data.nutrition);
      setActiveTab('Nutrition Facts');
    } catch {
      // Fallback mock nutrition data
      setNutrition({
        calories: Math.floor(Math.random() * 200 + 50),
        protein: Math.floor(Math.random() * 20 + 2),
        carbs: Math.floor(Math.random() * 40 + 10),
        fat: Math.floor(Math.random() * 15 + 1),
        fiber: Math.floor(Math.random() * 8 + 1),
        tags: ['Natural', 'Farm Fresh']
      });
      setActiveTab('Nutrition Facts');
    } finally {
      setNutritionLoading(false);
    }
  }

  const discountPct = product && product.price > product.offerPrice
    ? Math.round((1 - product.offerPrice / product.price) * 100)
    : 0

  const freshnessInfo = product?.freshness?.harvestDate ? (() => {
    const days = Math.floor((Date.now() - new Date(product.freshness.harvestDate)) / 86400000);
    return {
      days,
      color: days <= 2 ? '#29A56C' : days <= 4 ? '#3BB77E' : '#C0392B',
      bg: days <= 2 ? '#D8EDDE' : days <= 4 ? '#FDF3DC' : '#fdecea',
      label: days <= 2 ? 'Very Fresh' : days <= 4 ? 'Use Soon' : 'Use Today'
    }
  })() : null

  return product ? (
    <div style={{ paddingTop: '32px', paddingBottom: '80px', animation: 'fadeInUp 0.4s ease' }}>

      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '32px', flexWrap: 'wrap' }}>
        {[
          { to: '/', label: 'Home' },
          { to: '/products', label: 'Products' },
          { to: `/products/${product.category.toLowerCase()}`, label: product.category },
        ].map(({ to, label }) => (
          <span key={to} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Link to={to} style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', textDecoration: 'none' }}
              onMouseOver={e => e.currentTarget.style.color = '#3BB77E'} onMouseOut={e => e.currentTarget.style.color = 'var(--text-muted)'}
            >{label}</Link>
            <span style={{ color: 'var(--border-main)' }}>/</span>
          </span>
        ))}
        <span style={{ fontSize: '12px', fontWeight: 600, color: '#3BB77E', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{product.name}</span>
      </div>

      {/* Main Info Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px' }} className="max-lg:!block">

        {/* Left — Image Gallery */}
        <div style={{ display: 'flex', flexDirection: 'column-reverse', gap: '16px' }} className="md:flex-row-reverse">
          {/* Main image */}
          <div style={{
            flex: 1,
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-main)',
            borderRadius: '28px',
            padding: '48px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            position: 'relative', overflow: 'hidden', minHeight: '360px',
          }}>
            <img src={thumbnail} alt={product.name}
              style={{ maxWidth: '80%', maxHeight: '320px', objectFit: 'contain', transition: 'transform 0.6s ease', filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.1))' }}
              onMouseOver={e => e.currentTarget.style.transform = 'scale(1.08)'}
              onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
            />
          </div>

          {/* Thumbnails */}
          <div style={{ display: 'flex', gap: '10px', overflowX: 'auto' }} className="md:flex-col no-scrollbar">
            {product.image.map((image, index) => (
              <div key={index} onClick={() => setThumbnail(image)}
                style={{
                  width: '72px', height: '72px', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'var(--bg-surface)',
                  border: `2px solid ${thumbnail === image ? '#3BB77E' : 'var(--border-soft)'}`,
                  borderRadius: '14px', cursor: 'pointer', padding: '8px',
                  transition: 'all 0.2s',
                  boxShadow: thumbnail === image ? '0 4px 12px rgba(59, 183, 126,0.2)' : 'none',
                }}
              >
                <img src={image} alt="" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
              </div>
            ))}
          </div>
        </div>

        {/* Right — Product Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }} className="max-lg:mt-8">

          {/* Category + Freshness badges */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{
              background: '#D8EDDE', color: '#3BB77E',
              fontSize: '11px', fontWeight: 700,
              padding: '4px 14px', borderRadius: '999px',
              textTransform: 'uppercase', letterSpacing: '0.08em',
            }}>{product.category}</span>
            {freshnessInfo && (
              <span style={{
                background: freshnessInfo.bg,
                color: freshnessInfo.color,
                fontSize: '11px', fontWeight: 700,
                padding: '4px 14px', borderRadius: '999px',
              }}>🌿 Harvested {freshnessInfo.days}d ago · {freshnessInfo.label}</span>
            )}
          </div>

          {/* Name */}
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.8rem, 3vw, 2.4rem)',
            fontWeight: 700,
            color: 'var(--text-heading)',
            margin: 0, lineHeight: 1.2,
            letterSpacing: '-0.02em',
          }}>{product.name}</h1>

          {/* Rating + reviews */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ display: 'flex', gap: '2px' }}>
              {Array(5).fill('').map((_, i) => (
                <span key={i} style={{ color: i < 4 ? '#3BB77E' : 'var(--border-main)', fontSize: '18px' }}>★</span>
              ))}
            </div>
            <span style={{ fontSize: '14px', color: 'var(--text-muted)', fontWeight: 600 }}>4.8 · 1.2k Reviews</span>
            <span style={{
              background: '#D8EDDE', color: '#3BB77E',
              fontSize: '11px', fontWeight: 700,
              padding: '3px 10px', borderRadius: '999px',
            }}>✓ Verified</span>
          </div>

          {/* Price Block */}
          <div style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-main)',
            borderRadius: '20px',
            padding: '20px 24px',
          }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '6px' }}>
              <span style={{
                fontFamily: 'var(--font-display)',
                fontSize: '36px', fontWeight: 700,
                color: '#3BB77E', lineHeight: 1,
              }}>{currency}{product.offerPrice}</span>
              <span style={{ fontSize: '18px', color: 'var(--text-muted)', textDecoration: 'line-through', fontWeight: 600 }}>
                {currency}{product.price}
              </span>
              {discountPct > 0 && (
                <span style={{
                  background: '#C0392B', color: '#fff',
                  fontSize: '12px', fontWeight: 700,
                  padding: '3px 10px', borderRadius: '999px',
                }}>{discountPct}% OFF</span>
              )}
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0, fontWeight: 500 }}>
              Inclusive of all taxes · Ships within 24h
            </p>
          </div>

          {/* CTA Buttons */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button onClick={() => addToCart(product._id)}
              style={{
                flex: 1, padding: '15px 24px',
                background: 'var(--bg-surface)',
                border: '1.5px solid var(--border-main)',
                color: 'var(--text-heading)',
                borderRadius: '14px', cursor: 'pointer',
                fontFamily: 'var(--font-body)',
                fontWeight: 700, fontSize: '14px',
                transition: 'all 0.2s', minWidth: '140px',
              }}
              onMouseOver={e => { e.currentTarget.style.borderColor = '#3BB77E'; e.currentTarget.style.color = '#3BB77E'; }}
              onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--border-main)'; e.currentTarget.style.color = 'var(--text-heading)'; }}
            >+ Add to Cart</button>
            <button onClick={() => { addToCart(product._id); navigate("/cart"); }}
              style={{
                flex: 1, padding: '15px 24px',
                background: '#3BB77E', color: '#fff',
                border: 'none', borderRadius: '14px', cursor: 'pointer',
                fontFamily: 'var(--font-body)',
                fontWeight: 700, fontSize: '14px',
                boxShadow: '0 4px 16px rgba(59, 183, 126,0.30)',
                transition: 'all 0.2s', minWidth: '140px',
              }}
              onMouseOver={e => { e.currentTarget.style.background = '#29A56C'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseOut={e => { e.currentTarget.style.background = '#3BB77E'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >Checkout Now →</button>
          </div>

          {/* Nutrition AI Button */}
          <button onClick={analyzeNutrition} disabled={nutritionLoading}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center',
              padding: '11px 20px',
              background: '#FDF3DC',
              border: '1.5px solid #3BB77E',
              color: '#8B6000',
              borderRadius: '12px', cursor: 'pointer',
              fontFamily: 'var(--font-body)',
              fontWeight: 600, fontSize: '13px',
              transition: 'all 0.2s',
              opacity: nutritionLoading ? 0.7 : 1,
            }}
          >
            {nutritionLoading ? '⏳ Analyzing...' : '🤖 Analyze Nutritional Value (AI)'}
          </button>

          {/* Delivery Estimator */}
          <div style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-main)',
            borderRadius: '14px',
            padding: '16px 20px',
          }}>
            <p style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '10px' }}>🚚 Delivery Estimator</p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input value={pincode} onChange={e => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="Enter 6-digit PIN"
                style={{
                  flex: 1, padding: '8px 14px',
                  border: '1px solid var(--border-main)',
                  borderRadius: '10px', fontSize: '14px',
                  background: 'transparent', color: 'var(--text-heading)',
                  fontFamily: 'var(--font-body)', outline: 'none',
                }}
              />
              <button onClick={checkDelivery}
                style={{
                  padding: '8px 16px', background: '#3BB77E', color: '#fff',
                  border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 600, fontSize: '13px',
                }}
              >Check</button>
            </div>
            {delivery && (
              <p style={{ marginTop: '8px', fontSize: '13px', color: '#29A56C', fontWeight: 600 }}>✓ {delivery}</p>
            )}
          </div>

          {/* Trust Row */}
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            {[
              { icon: '🔄', text: 'Easy Returns' },
              { icon: '🌿', text: '100% Natural' },
              { icon: '🚚', text: 'Fast Delivery' },
            ].map(({ icon, text }) => (
              <div key={text} style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-main)',
                borderRadius: '10px', padding: '8px 14px',
                fontSize: '12px', fontWeight: 600, color: 'var(--text-body)',
              }}>
                <span>{icon}</span><span>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Tabs Section ── */}
      <div style={{ marginTop: '56px' }}>
        {/* Tab headers */}
        <div style={{ display: 'flex', borderBottom: '2px solid var(--border-main)', marginBottom: '32px', gap: '0' }}>
          {TABS.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              style={{
                padding: '12px 24px',
                background: 'none', border: 'none', cursor: 'pointer',
                fontFamily: 'var(--font-body)',
                fontWeight: 600, fontSize: '14px',
                color: activeTab === tab ? '#3BB77E' : 'var(--text-muted)',
                borderBottom: `2px solid ${activeTab === tab ? '#3BB77E' : 'transparent'}`,
                marginBottom: '-2px',
                transition: 'all 0.2s',
              }}
            >{tab}</button>
          ))}
        </div>

        {/* Tab content */}
        <div style={{ animation: 'fadeInUp 0.25s ease' }}>
          {activeTab === 'Description' && (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {product.description.map((desc, i) => (
                <li key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#3BB77E', marginTop: '8px', flexShrink: 0 }} />
                  <p style={{ fontSize: '15px', lineHeight: 1.7, color: 'var(--text-body)', margin: 0 }}>{desc}</p>
                </li>
              ))}
            </ul>
          )}

          {activeTab === 'Nutrition Facts' && (
            <div style={{ maxWidth: '480px' }}>
              {!nutrition ? (
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                  <p style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>Click "Analyze Nutritional Value" to get AI-powered nutrition data for this product.</p>
                  <button onClick={analyzeNutrition} disabled={nutritionLoading}
                    style={{
                      padding: '10px 24px', background: '#3BB77E', color: '#fff',
                      border: 'none', borderRadius: '999px', cursor: 'pointer', fontWeight: 700,
                    }}
                  >{nutritionLoading ? 'Analyzing...' : '🤖 Analyze with AI'}</button>
                </div>
              ) : (
                <div>
                  <div style={{ background: '#D8EDDE', borderRadius: '16px', padding: '20px 24px', marginBottom: '24px' }}>
                    <p style={{ fontSize: '28px', fontFamily: 'var(--font-display)', fontWeight: 700, color: '#3BB77E', margin: 0 }}>{nutrition.calories} <span style={{ fontSize: '14px', fontWeight: 500 }}>kcal per 100g</span></p>
                  </div>
                  <NutritionBar label="Protein"        value={nutrition.protein} max={50}  color="#29A56C" />
                  <NutritionBar label="Carbohydrates"  value={nutrition.carbs}   max={100} color="#3BB77E" />
                  <NutritionBar label="Fat"            value={nutrition.fat}     max={50}  color="#C0392B" />
                  {nutrition.fiber && <NutritionBar label="Fiber" value={nutrition.fiber} max={30} color="#4ECDC4" />}
                  {nutrition.tags?.length > 0 && (
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '20px' }}>
                      {nutrition.tags.map(t => (
                        <span key={t} style={{ background: '#D8EDDE', color: '#3BB77E', fontSize: '12px', fontWeight: 700, padding: '4px 12px', borderRadius: '999px' }}>✓ {t}</span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'Reviews' && (
            <div style={{ maxWidth: '600px' }}>
              {[
                { name: 'Priya S.', rating: 5, text: 'Absolutely fresh! Delivered on time and quality is top notch.', date: '2 days ago' },
                { name: 'Rahul M.', rating: 4, text: 'Good quality, will order again. Packaging was excellent.', date: '1 week ago' },
                { name: 'Anya K.', rating: 5, text: 'Best organic produce I\'ve found! Highly recommend.', date: '2 weeks ago' },
              ].map((review, i) => (
                <div key={i} style={{
                  padding: '20px 0',
                  borderBottom: i < 2 ? '1px solid var(--border-soft)' : 'none',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <div>
                      <span style={{ fontWeight: 700, color: 'var(--text-heading)', fontSize: '15px' }}>{review.name}</span>
                      <span style={{ marginLeft: '12px', color: '#3BB77E' }}>{'★'.repeat(review.rating)}</span>
                    </div>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{review.date}</span>
                  </div>
                  <p style={{ fontSize: '14px', color: 'var(--text-body)', lineHeight: 1.6, margin: 0 }}>{review.text}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'Q&A' && (
            <div style={{ maxWidth: '600px' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>Have a question about this product?</p>
              <button style={{
                marginTop: '12px', padding: '10px 24px',
                border: '1.5px solid #3BB77E', background: 'none',
                color: '#3BB77E', borderRadius: '999px', cursor: 'pointer', fontWeight: 600,
              }}>Ask a Question</button>
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div style={{ marginTop: '72px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.4rem, 2.5vw, 1.9rem)',
              fontWeight: 600, margin: 0, color: 'var(--text-heading)',
              whiteSpace: 'nowrap',
            }}>You Might Also <span style={{ color: '#3BB77E' }}>Love</span></h2>
            <div style={{ flex: 1, height: '1.5px', background: 'var(--border-soft)', borderRadius: '999px' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '20px' }}>
            {relatedProducts.filter(p => p.inStock).map(p => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  ) : null;
};

export default ProductDetails;