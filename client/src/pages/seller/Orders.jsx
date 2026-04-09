import React, { useEffect, useState } from 'react'
import { useAppContext } from '../../context/AppContext';
import { assets, dummyOrders } from '../../assets/assets';
import toast from 'react-hot-toast';

const Orders = () => {
    const {currency, axios} = useAppContext()
    const [ orders, setOrders ] = useState([])

    const fetchOrders = async () =>{
        try {
            const {data} = await axios.get('/api/order/seller');
            if(data.success) {
                setOrders(data.orders);
            } else {
                toast.error(data.message);  
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    useEffect(()=>{
        fetchOrders();
    },[])

  return (
        <div className='no-scrollbar flex-1 animate-in fade-in duration-500'>
            <div className="mb-10">
                <h1 className="text-3xl font-black text-heading uppercase tracking-tighter">Fulfillment</h1>
                <p className="text-muted font-bold uppercase tracking-widest text-[10px] mt-1">{orders.length} Orders Pending Processing</p>
            </div>

            <div className="space-y-6 max-w-5xl">
                {orders.map((order, index) => (
                    <div key={index} className="flex flex-col md:flex-row gap-8 justify-between p-8 rounded-[32px] bg-card border border-border-main shadow-sm hover:border-accent/30 transition-all group overflow-hidden relative">
                        <div className="flex gap-6 z-10">
                            <div className="w-16 h-16 bg-surface rounded-2xl flex items-center justify-center p-3 shadow-inner group-hover:bg-accent/10 transition-colors">
                                <img src={assets.box_icon} alt="boxIcon" className="w-8 dark:invert group-hover:scale-110 transition-transform"/>
                            </div>
                            <div className="space-y-3">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-muted uppercase tracking-widest">Items</p>
                                    {order.items.map((item, i) => (
                                        <div key={i} className="flex items-center gap-2">
                                            <p className="font-black text-heading text-base leading-tight">
                                                {item.product.name} <span className="text-accent ml-2">x{item.quantity}</span>
                                            </p>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex items-center gap-3 pt-2">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${order.isPaid ? 'bg-accent/10 border-accent/20 text-accent' : 'bg-red-500/10 border-red-500/20 text-red-500'}`}>
                                        {order.isPaid ? "Payment Verified" : "Payment Pending"}
                                    </span>
                                    <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-border-main bg-surface text-muted">
                                        {order.paymentType}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 flex flex-col md:flex-row justify-between gap-8 z-10">
                            <div className="space-y-2">
                                <p className="text-[10px] font-black text-muted uppercase tracking-widest">Shipping Detail</p>
                                <div className="text-sm font-bold text-body leading-relaxed">
                                    <p className='text-heading font-black mb-1'>{order.address.firstName} {order.address.lastName}</p>
                                    <p>{order.address.street}, {order.address.city}</p> 
                                    <p>{order.address.state}, {order.address.zipcode}, {order.address.country}</p>
                                    <p className="mt-2 text-accent font-black tracking-widest text-[10px]">📞 {order.address.phone}</p>
                                </div>
                            </div>

                            <div className="flex flex-col md:items-end justify-center min-w-[140px]">
                                <p className="text-[10px] font-black text-muted uppercase tracking-widest mb-1">Total Amount</p>
                                <p className="text-3xl font-black text-accent">{currency}{order.amount}</p>
                                <p className="text-[10px] font-bold text-muted mt-2 tracking-widest uppercase">{new Date(order.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                            </div>
                        </div>

                        {/* Subtle Background Accent */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                ))}

                {orders.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-48 bg-card border border-dashed border-border-main rounded-[32px] space-y-4">
                        <div className="text-4xl">🧾</div>
                        <h2 className="text-xl font-black text-heading uppercase tracking-tighter">No orders found</h2>
                        <p className="text-muted text-xs font-bold uppercase tracking-widest">Orders from your customers will appear here.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Orders