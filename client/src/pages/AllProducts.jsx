import React, { useState, useMemo } from 'react'
import { useAppContext } from '../context/AppContext'
import ProductCard from '../components/ProductCard'
import { categories } from '../assets/assets'

const SkeletonCard = () => (
  <div style={{
    background: 'var(--bg-card)',
    border: '1px solid var(--border-main)',
    borderRadius: '20px',
    padding: '16px',
    overflow: 'hidden',
  }}>
    <div className="skeleton" style={{ height: '160px', borderRadius: '14px', marginBottom: '14px' }} />
    <div className="skeleton" style={{ height: '12px', width: '40%', marginBottom: '8px' }} />
    <div className="skeleton" style={{ height: '18px', width: '80%', marginBottom: '6px' }} />
    <div className="skeleton" style={{ height: '14px', width: '60%', marginBottom: '16px' }} />
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div className="skeleton" style={{ height: '24px', width: '60px' }} />
      <div className="skeleton" style={{ height: '36px', width: '80px', borderRadius: '12px' }} />
    </div>
  </div>
)

const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest First' },
]

const DIETARY_TAGS = ['organic', 'vegan', 'gluten-free', 'diabetic-friendly', 'high-protein', 'low-calorie']

const ITEMS_PER_PAGE = 12

const AllProducts = () => {
  const { products } = useAppContext()

  const [selectedCategories, setSelectedCategories] = useState([])
  const [priceRange, setPriceRange] = useState([0, 1000])
  const [selectedRating, setSelectedRating] = useState(0)
  const [selectedTags, setSelectedTags] = useState([])
  const [sortBy, setSortBy] = useState('featured')
  const [viewMode, setViewMode] = useState('grid') // 'grid' | 'list'
  const [page, setPage] = useState(1)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const toggleCategory = (cat) => {
    setSelectedCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    )
    setPage(1)
  }

  const toggleTag = (tag) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    )
    setPage(1)
  }

  const resetFilters = () => {
    setSelectedCategories([])
    setPriceRange([0, 1000])
    setSelectedRating(0)
    setSelectedTags([])
    setSortBy('featured')
    setPage(1)
  }

  const activeFilterCount = selectedCategories.length + selectedTags.length + (selectedRating > 0 ? 1 : 0) + (priceRange[1] < 1000 ? 1 : 0)

  const filtered = useMemo(() => {
    let result = products.filter(p => p.inStock)

    if (selectedCategories.length > 0) {
      result = result.filter(p => selectedCategories.includes(p.category))
    }
    result = result.filter(p => p.offerPrice >= priceRange[0] && p.offerPrice <= priceRange[1])

    if (selectedTags.length > 0) {
      result = result.filter(p => p.tags && selectedTags.every(tag => p.tags.includes(tag)))
    }

    switch (sortBy) {
      case 'price-asc':  result = [...result].sort((a, b) => a.offerPrice - b.offerPrice); break
      case 'price-desc': result = [...result].sort((a, b) => b.offerPrice - a.offerPrice); break
      case 'newest':     result = [...result].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); break
      default: break
    }

    return result
  }, [products, selectedCategories, priceRange, selectedRating, selectedTags, sortBy])

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const displayed = filtered.slice(0, page * ITEMS_PER_PAGE)
  const loading = products.length === 0

  const Sidebar = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 600, margin: 0, color: 'var(--text-heading)' }}>Filters</h3>
        {activeFilterCount > 0 && (
          <button onClick={resetFilters} style={{
            fontSize: '12px', fontWeight: 600, color: '#3BB77E',
            background: '#D8EDDE', border: 'none', borderRadius: '999px',
            padding: '4px 12px', cursor: 'pointer',
          }}>Reset all</button>
        )}
      </div>

      {/* Category */}
      <div>
        <p style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '10px' }}>Category</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {categories.map(cat => (
            <label key={cat.path} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', padding: '6px 0' }}>
              <div
                onClick={() => toggleCategory(cat.path)}
                style={{
                  width: '18px', height: '18px', borderRadius: '5px', flexShrink: 0,
                  border: `2px solid ${selectedCategories.includes(cat.path) ? '#3BB77E' : 'var(--border-main)'}`,
                  background: selectedCategories.includes(cat.path) ? '#3BB77E' : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', transition: 'all 0.15s',
                }}
              >
                {selectedCategories.includes(cat.path) && (
                  <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
              <span style={{ fontSize: '14px', color: 'var(--text-body)', fontWeight: 500 }}>{cat.text}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <p style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '10px' }}>Price Range</p>
        <div style={{ padding: '0 4px' }}>
          <input
            type="range" min="0" max="1000" step="10" value={priceRange[1]}
            onChange={e => { setPriceRange([priceRange[0], Number(e.target.value)]); setPage(1); }}
            style={{ width: '100%', accentColor: '#3BB77E' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600 }}>₹0</span>
            <span style={{ fontSize: '13px', color: '#3BB77E', fontWeight: 700 }}>₹{priceRange[1]}</span>
          </div>
        </div>
      </div>

      {/* Rating */}
      <div>
        <p style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '10px' }}>Min Rating</p>
        <div style={{ display: 'flex', gap: '6px' }}>
          {[4, 3, 2].map(r => (
            <button key={r} onClick={() => { setSelectedRating(r === selectedRating ? 0 : r); setPage(1); }}
              style={{
                padding: '5px 12px',
                border: `1.5px solid ${selectedRating === r ? '#3BB77E' : 'var(--border-main)'}`,
                background: selectedRating === r ? '#3BB77E' : 'transparent',
                color: selectedRating === r ? '#fff' : 'var(--text-body)',
                borderRadius: '999px', cursor: 'pointer', fontSize: '13px', fontWeight: 600, transition: 'all 0.15s',
              }}>
              {'★'.repeat(r)} & up
            </button>
          ))}
        </div>
      </div>

      {/* Dietary Tags */}
      <div>
        <p style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '10px' }}>Dietary & Lifestyle</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {DIETARY_TAGS.map(tag => (
            <button key={tag} onClick={() => toggleTag(tag)}
              style={{
                padding: '5px 12px',
                border: `1.5px solid ${selectedTags.includes(tag) ? '#3BB77E' : 'var(--border-main)'}`,
                background: selectedTags.includes(tag) ? '#D8EDDE' : 'transparent',
                color: selectedTags.includes(tag) ? '#3BB77E' : 'var(--text-body)',
                borderRadius: '999px', cursor: 'pointer',
                fontSize: '12px', fontWeight: 600, transition: 'all 0.15s',
                textTransform: 'capitalize',
              }}>
              {tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <div style={{ paddingTop: '32px', paddingBottom: '80px' }}>
      {/* Page heading */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(1.8rem, 3vw, 2.4rem)',
          fontWeight: 700, margin: 0,
          color: 'var(--text-heading)',
          letterSpacing: '-0.02em',
        }}>All Products</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '15px', marginTop: '6px' }}>
          Showing <strong style={{ color: 'var(--text-heading)' }}>{displayed.length}</strong> of <strong style={{ color: 'var(--text-heading)' }}>{filtered.length}</strong> products
        </p>
      </div>

      <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-start' }}>

        {/* ─── Filter Sidebar (Desktop) ─── */}
        <aside style={{
          width: '260px', flexShrink: 0,
          background: 'var(--bg-card)',
          border: '1px solid var(--border-main)',
          borderRadius: '20px',
          padding: '24px',
          position: 'sticky', top: '100px',
          maxHeight: 'calc(100vh - 120px)',
          overflowY: 'auto',
        }} className="hidden lg:block no-scrollbar">
          <Sidebar />
        </aside>

        {/* ─── Main Content ─── */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Controls Bar */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginBottom: '20px', gap: '12px', flexWrap: 'wrap',
          }}>
            {/* Mobile filter toggle */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden"
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '8px 16px',
                border: '1.5px solid var(--border-main)',
                background: 'var(--bg-surface)',
                borderRadius: '999px', cursor: 'pointer',
                fontSize: '13px', fontWeight: 600, color: 'var(--text-body)',
              }}
            >
              ⚙️ Filters {activeFilterCount > 0 && (
                <span style={{
                  background: '#3BB77E', color: '#fff',
                  borderRadius: '999px', width: '18px', height: '18px',
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '11px', fontWeight: 700,
                }}>{activeFilterCount}</span>
              )}
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginLeft: 'auto' }}>
              {/* Grid / List toggle */}
              <div style={{ display: 'flex', border: '1px solid var(--border-main)', borderRadius: '10px', overflow: 'hidden' }}>
                {['grid', 'list'].map(v => (
                  <button key={v} onClick={() => setViewMode(v)} style={{
                    padding: '7px 12px', border: 'none', cursor: 'pointer', fontSize: '14px',
                    background: viewMode === v ? '#3BB77E' : 'var(--bg-surface)',
                    color: viewMode === v ? '#fff' : 'var(--text-muted)',
                    transition: 'all 0.15s',
                  }}>
                    {v === 'grid' ? '⊞' : '☰'}
                  </button>
                ))}
              </div>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={e => { setSortBy(e.target.value); setPage(1); }}
                style={{
                  padding: '8px 14px', borderRadius: '10px',
                  border: '1px solid var(--border-main)',
                  background: 'var(--bg-surface)',
                  color: 'var(--text-body)',
                  fontSize: '13px', fontWeight: 600,
                  cursor: 'pointer', outline: 'none',
                  fontFamily: 'var(--font-body)',
                }}
              >
                {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          </div>

          {/* Product Grid */}
          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
              {Array(8).fill(0).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : displayed.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0' }}>
              <p style={{ fontSize: '48px', marginBottom: '16px' }}>🥬</p>
              <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--text-heading)', marginBottom: '8px' }}>No products found</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>Try adjusting your filters</p>
              <button onClick={resetFilters} style={{
                padding: '10px 24px', background: '#3BB77E', color: '#fff',
                border: 'none', borderRadius: '999px', cursor: 'pointer', fontWeight: 600,
              }}>Clear Filters</button>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: viewMode === 'grid'
                ? 'repeat(auto-fill, minmax(200px, 1fr))'
                : '1fr',
              gap: '20px',
            }}>
              {displayed.map(product => (
                viewMode === 'grid' ? (
                  <ProductCard key={product._id} product={product} />
                ) : (
                  <div key={product._id} style={{
                    display: 'flex', gap: '20px', alignItems: 'center',
                    background: 'var(--bg-card)', border: '1px solid var(--border-main)',
                    borderRadius: '16px', padding: '16px',
                    transition: 'box-shadow 0.2s',
                  }}>
                    <img src={product.image[0]} alt={product.name} style={{ width: '80px', height: '80px', objectFit: 'contain' }} loading="lazy" />
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>{product.category}</p>
                      <p style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '17px', color: 'var(--text-heading)', marginBottom: '4px' }}>{product.name}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 700, color: '#3BB77E' }}>₹{product.offerPrice}</span>
                      <p style={{ fontSize: '11px', color: 'var(--text-muted)', textDecoration: 'line-through' }}>₹{product.price}</p>
                    </div>
                  </div>
                )
              ))}
            </div>
          )}

          {/* Load More */}
          {!loading && page < totalPages && (
            <div style={{ textAlign: 'center', marginTop: '40px' }}>
              <button
                onClick={() => setPage(p => p + 1)}
                style={{
                  padding: '12px 40px',
                  border: '2px solid var(--border-main)',
                  background: 'var(--bg-surface)',
                  color: 'var(--text-body)',
                  borderRadius: '999px', cursor: 'pointer',
                  fontSize: '14px', fontWeight: 600,
                  transition: 'all 0.2s',
                }}
                onMouseOver={e => { e.currentTarget.style.borderColor = '#3BB77E'; e.currentTarget.style.color = '#3BB77E'; }}
                onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--border-main)'; e.currentTarget.style.color = 'var(--text-body)'; }}
              >
                Load More ({filtered.length - displayed.length} remaining)
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {sidebarOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 300, display: 'flex',
        }}>
          <div onClick={() => setSidebarOpen(false)} style={{ flex: 1, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }} />
          <div style={{
            width: '300px',
            background: 'var(--bg-card)',
            padding: '24px',
            overflowY: 'auto',
            animation: 'fadeInUp 0.25s ease',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', margin: 0, fontWeight: 600, color: 'var(--text-heading)' }}>Filters</h3>
              <button onClick={() => setSidebarOpen(false)} style={{ background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer', color: 'var(--text-muted)' }}>✕</button>
            </div>
            <Sidebar />
            <button onClick={() => setSidebarOpen(false)} style={{
              marginTop: '24px', width: '100%', padding: '14px',
              background: '#3BB77E', color: '#fff', border: 'none', borderRadius: '12px',
              fontWeight: 700, fontSize: '15px', cursor: 'pointer',
            }}>Apply Filters ({activeFilterCount})</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AllProducts