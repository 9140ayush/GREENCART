import React, { useState } from 'react'
import { categories } from '../assets/assets'
import { useAppContext } from '../context/AppContext'

const Categories = () => {
  const { navigate, searchQuery } = useAppContext()
  const [active, setActive] = useState(null)

  return (
    <div style={{ marginTop: '48px' }}>
      {/* Section heading */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(1.3rem, 2.5vw, 1.8rem)',
          fontWeight: 600,
          color: 'var(--text-heading)',
          margin: 0, whiteSpace: 'nowrap',
          letterSpacing: '-0.01em',
        }}>Shop by Category</h2>
        <div style={{ flex: 1, height: '1.5px', background: 'var(--border-soft)', borderRadius: '999px' }} />
      </div>

      {/* Horizontal scrollable pill row */}
      <div style={{
        display: 'flex',
        gap: '10px',
        overflowX: 'auto',
        paddingBottom: '8px',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
      }} className="no-scrollbar">
        {/* "All" pill */}
        <button
          onClick={() => { setActive(null); navigate('/products'); scrollTo(0, 0); }}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            padding: '9px 20px',
            borderRadius: '999px',
            border: `1.5px solid ${active === null ? '#3BB77E' : 'var(--border-main)'}`,
            background: active === null ? '#3BB77E' : 'var(--bg-surface)',
            color: active === null ? '#fff' : 'var(--text-body)',
            fontSize: '13px', fontWeight: 600,
            cursor: 'pointer',
            flexShrink: 0,
            transition: 'all 0.2s',
            transform: active === null ? 'scale(1.04)' : 'scale(1)',
          }}
        >
          🛒 <span>All</span>
        </button>

        {categories.map((category, index) => {
          const isActive = active === category.path;
          return (
            <button
              key={index}
              onClick={() => {
                setActive(category.path)
                navigate(`/products/${category.path.toLowerCase()}`)
                scrollTo(0, 0)
              }}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '9px 20px',
                borderRadius: '999px',
                border: `1.5px solid ${isActive ? '#3BB77E' : 'var(--border-main)'}`,
                background: isActive ? '#3BB77E' : 'var(--bg-surface)',
                color: isActive ? '#fff' : 'var(--text-body)',
                fontSize: '13px', fontWeight: 600,
                cursor: 'pointer',
                flexShrink: 0,
                transition: 'all 0.2s',
                transform: isActive ? 'scale(1.04)' : 'scale(1)',
                boxShadow: isActive ? '0 2px 12px rgba(59, 183, 126,0.2)' : 'none',
              }}
              onMouseOver={e => {
                if (!isActive) {
                  e.currentTarget.style.background = '#D8EDDE';
                  e.currentTarget.style.borderColor = '#3BB77E';
                  e.currentTarget.style.color = '#3BB77E';
                }
              }}
              onMouseOut={e => {
                if (!isActive) {
                  e.currentTarget.style.background = 'var(--bg-surface)';
                  e.currentTarget.style.borderColor = 'var(--border-main)';
                  e.currentTarget.style.color = 'var(--text-body)';
                }
              }}
            >
              <img src={category.image} alt={category.text} style={{ width: '20px', height: '20px', objectFit: 'contain' }} />
              <span>{category.text}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default Categories