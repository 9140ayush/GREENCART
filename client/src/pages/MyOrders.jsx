import React, { useEffect, useState } from 'react'
import { useAppContext } from '../context/AppContext'

const STATUS_STEPS = ['Order Placed', 'Confirmed', 'Packed', 'Out for Delivery', 'Delivered']

const statusColor = (status) => {
    if (!status) return { bg: 'var(--border-soft)', text: 'var(--text-muted)' }
    const s = status.toLowerCase()
    if (s.includes('delivered')) return { bg: '#D8EDDE', text: '#29A56C' }
    if (s.includes('transit') || s.includes('delivery')) return { bg: '#FDF3DC', text: '#8B6000' }
    if (s.includes('cancel')) return { bg: '#fdecea', text: '#C0392B' }
    if (s.includes('placed')) return { bg: '#E8F4EC', text: '#3BB77E' }
    return { bg: 'var(--border-soft)', text: 'var(--text-muted)' }
}

const MyOrders = () => {
    const { axios, currency, user, navigate } = useAppContext()
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [expanded, setExpanded] = useState(null)

    const fetchOrders = async () => {
        try {
            const { data } = await axios.get('/api/order/user')
            if (data.success) {
                setOrders(data.orders)
            }
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (user) fetchOrders()
    }, [user])

    if (loading) return (
        <div style={{ padding: '64px 0', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {Array(3).fill(0).map((_, i) => (
                <div key={i} className="skeleton" style={{ height: '100px', borderRadius: '16px' }} />
            ))}
        </div>
    )

    return (
        <div style={{ paddingTop: '32px', paddingBottom: '80px' }}>
            <h1 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.8rem, 3vw, 2.4rem)',
                fontWeight: 700, color: 'var(--text-heading)',
                margin: '0 0 8px',
                letterSpacing: '-0.02em',
            }}>My Orders</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '15px', marginBottom: '32px' }}>
                {orders.length} order{orders.length !== 1 ? 's' : ''} placed
            </p>

            {orders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '80px 0' }}>
                    <p style={{ fontSize: '48px', marginBottom: '16px' }}>📦</p>
                    <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--text-heading)', marginBottom: '8px' }}>No orders yet</h3>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>Start shopping to see your orders here.</p>
                    <button onClick={() => navigate('/products')} style={{
                        padding: '12px 32px', background: '#3BB77E', color: '#fff',
                        border: 'none', borderRadius: '999px', cursor: 'pointer', fontWeight: 700, fontSize: '14px',
                    }}>Shop Now</button>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {orders.map((order, oi) => {
                        const isOpen = expanded === oi
                        const sc = statusColor(order.status)

                        return (
                            <div key={order._id || oi} style={{
                                background: 'var(--bg-card)',
                                border: '1px solid var(--border-main)',
                                borderRadius: '20px',
                                overflow: 'hidden',
                                transition: 'box-shadow 0.2s',
                                boxShadow: isOpen ? 'var(--shadow-md)' : 'none',
                            }}>
                                {/* Order Header */}
                                <div
                                    onClick={() => setExpanded(isOpen ? null : oi)}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '16px',
                                        padding: '18px 22px', cursor: 'pointer',
                                        flexWrap: 'wrap',
                                    }}
                                >
                                    {/* Product thumbnails */}
                                    <div style={{ display: 'flex', gap: '-8px' }}>
                                        {(order.items || []).slice(0, 3).map((item, i) => (
                                            <div key={i} style={{
                                                width: '48px', height: '48px',
                                                background: 'var(--bg-surface)',
                                                borderRadius: '10px',
                                                border: '2px solid var(--bg-card)',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                marginLeft: i > 0 ? '-10px' : 0,
                                                zIndex: 3 - i,
                                                position: 'relative',
                                            }}>
                                                {item.product?.image?.[0] && (
                                                    <img src={item.product.image[0]} alt="" loading="lazy"
                                                        style={{ maxWidth: '34px', maxHeight: '34px', objectFit: 'contain' }} />
                                                )}
                                            </div>
                                        ))}
                                        {order.items?.length > 3 && (
                                            <div style={{
                                                width: '48px', height: '48px',
                                                background: '#D8EDDE',
                                                borderRadius: '10px', border: '2px solid var(--bg-card)',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                marginLeft: '-10px', zIndex: 0,
                                                fontSize: '12px', fontWeight: 700, color: '#3BB77E',
                                            }}>+{order.items.length - 3}</div>
                                        )}
                                    </div>

                                    {/* Order info */}
                                    <div style={{ flex: 1, minWidth: '160px' }}>
                                        <p style={{ fontWeight: 700, fontSize: '15px', color: 'var(--text-heading)', margin: '0 0 2px' }}>
                                            {(order.items || []).length} item{order.items?.length !== 1 ? 's' : ''}
                                            {order.items?.[0]?.product?.name && ` · ${order.items[0].product.name}${order.items.length > 1 ? '...' : ''}`}
                                        </p>
                                        <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>
                                            {order.createdAt
                                                ? new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                                                : ''}
                                            {' · '}{order.paymentType}
                                        </p>
                                    </div>

                                    {/* Amount */}
                                    <div style={{ textAlign: 'right', marginLeft: 'auto' }}>
                                        <p style={{
                                            fontFamily: 'var(--font-display)',
                                            fontSize: '18px', fontWeight: 700,
                                            color: '#3BB77E', margin: '0 0 4px',
                                        }}>{currency}{order.amount}</p>

                                        {/* Status badge */}
                                        <span style={{
                                            display: 'inline-block',
                                            background: sc.bg, color: sc.text,
                                            fontSize: '11px', fontWeight: 700,
                                            padding: '3px 10px', borderRadius: '999px',
                                        }}>{order.status || 'Processing'}</span>
                                    </div>

                                    {/* Expand chevron */}
                                    <span style={{
                                        color: 'var(--text-muted)', fontSize: '18px',
                                        transition: 'transform 0.2s',
                                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                                        flexShrink: 0,
                                    }}>⌄</span>
                                </div>

                                {/* Expanded Order Detail */}
                                {isOpen && (
                                    <div style={{ borderTop: '1px solid var(--border-soft)', padding: '20px 22px', animation: 'fadeInUp 0.2s ease' }}>

                                        {/* Tracking Timeline */}
                                        {order.trackingTimeline?.length > 0 ? (
                                            <div style={{ marginBottom: '24px' }}>
                                                <p style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '16px' }}>
                                                    Tracking Timeline
                                                </p>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                                    {order.trackingTimeline.map((step, si) => (
                                                        <div key={si} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                                                            <div style={{
                                                                width: '10px', height: '10px', borderRadius: '50%',
                                                                background: '#29A56C', flexShrink: 0, marginTop: '4px',
                                                            }} />
                                                            <div>
                                                                <p style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text-heading)', margin: '0 0 2px' }}>{step.status}</p>
                                                                {step.note && <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '0 0 2px' }}>{step.note}</p>}
                                                                <p style={{ fontSize: '11px', color: 'var(--text-light)', margin: 0 }}>
                                                                    {step.timestamp ? new Date(step.timestamp).toLocaleString('en-IN') : ''}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ) : (
                                            /* Static progress bar */
                                            <div style={{ marginBottom: '24px' }}>
                                                <p style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '16px' }}>Order Progress</p>
                                                <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                                                    {STATUS_STEPS.map((step, si) => {
                                                        const isCompleted = order.status === 'Delivered' || si === 0
                                                        return (
                                                            <React.Fragment key={step}>
                                                                <div style={{
                                                                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
                                                                    flex: si < STATUS_STEPS.length - 1 ? 'none' : 1,
                                                                }}>
                                                                    <div style={{
                                                                        width: '28px', height: '28px', borderRadius: '50%',
                                                                        background: isCompleted ? '#29A56C' : 'var(--border-main)',
                                                                        color: '#fff',
                                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                                        fontSize: '12px', fontWeight: 700, flexShrink: 0,
                                                                    }}>{isCompleted ? '✓' : si + 1}</div>
                                                                    <span style={{ fontSize: '10px', fontWeight: 600, color: isCompleted ? '#3BB77E' : 'var(--text-muted)', textAlign: 'center', whiteSpace: 'nowrap' }}>
                                                                        {step}
                                                                    </span>
                                                                </div>
                                                                {si < STATUS_STEPS.length - 1 && (
                                                                    <div style={{ flex: 1, height: '2px', background: isCompleted ? '#29A56C' : 'var(--border-main)', borderRadius: '999px', marginBottom: '20px' }} />
                                                                )}
                                                            </React.Fragment>
                                                        )
                                                    })}
                                                </div>
                                            </div>
                                        )}

                                        {/* Items List */}
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                            {(order.items || []).map((item, ii) => (
                                                <div key={ii} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                                    {item.product?.image?.[0] && (
                                                        <div style={{
                                                            width: '48px', height: '48px',
                                                            background: 'var(--bg-surface)', borderRadius: '10px',
                                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                            flexShrink: 0,
                                                        }}>
                                                            <img src={item.product.image[0]} alt="" loading="lazy"
                                                                style={{ maxWidth: '36px', maxHeight: '36px', objectFit: 'contain' }} />
                                                        </div>
                                                    )}
                                                    <div style={{ flex: 1 }}>
                                                        <p style={{ fontWeight: 600, color: 'var(--text-heading)', fontSize: '14px', margin: '0 0 2px' }}>
                                                            {item.product?.name || 'Product'}
                                                        </p>
                                                        <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>
                                                            Qty: {item.quantity}
                                                        </p>
                                                    </div>
                                                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: '#3BB77E', fontSize: '15px' }}>
                                                        {currency}{item.product?.offerPrice ? item.product.offerPrice * item.quantity : '—'}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Address */}
                                        {order.address && (
                                            <div style={{
                                                marginTop: '16px', paddingTop: '16px',
                                                borderTop: '1px solid var(--border-soft)',
                                                fontSize: '13px', color: 'var(--text-muted)',
                                            }}>
                                                📍 Delivering to: {order.address.street}, {order.address.city}, {order.address.state}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

export default MyOrders