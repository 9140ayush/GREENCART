import React from 'react'
import ProductCard from './ProductCard'
import { useAppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'

const BestSeller = () => {
    const { products } = useAppContext();
    const navigate = useNavigate();

    return (
        <div style={{ marginTop: '64px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '28px' }}>
                <div>
                    <h2 style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 'clamp(1.4rem, 2.5vw, 1.9rem)',
                        fontWeight: 600,
                        color: 'var(--text-heading)',
                        margin: 0, letterSpacing: '-0.015em',
                        whiteSpace: 'nowrap',
                    }}>Best Sellers</h2>
                    <p style={{ fontSize: '14px', color: 'var(--text-muted)', margin: '4px 0 0', fontWeight: 500 }}>
                        Loved by thousands of customers
                    </p>
                </div>
                <div style={{ flex: 1, height: '1.5px', background: 'var(--border-soft)', borderRadius: '999px' }} />
                <button
                    onClick={() => { navigate('/products'); scrollTo(0, 0); }}
                    style={{
                        padding: '8px 18px',
                        border: '1.5px solid var(--border-main)',
                        background: 'var(--bg-surface)',
                        color: 'var(--text-body)',
                        borderRadius: '999px', cursor: 'pointer',
                        fontSize: '13px', fontWeight: 600,
                        transition: 'all 0.2s', whiteSpace: 'nowrap',
                    }}
                    onMouseOver={e => { e.currentTarget.style.borderColor = '#3BB77E'; e.currentTarget.style.color = '#3BB77E'; }}
                    onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--border-main)'; e.currentTarget.style.color = 'var(--text-body)'; }}
                >
                    View All →
                </button>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))',
                gap: '20px',
            }}>
                {products.filter(p => p.inStock).slice(0, 6).map((product, index) => (
                    <ProductCard key={index} product={product} />
                ))}
            </div>
        </div>
    )
}

export default BestSeller