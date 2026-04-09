import React, { useEffect, useState } from 'react'
import { useAppContext } from '../context/AppContext'

const MyOrders = () => {
    const [myOrders, setMyOrders] = useState([])
    const {currency, axios, user} = useAppContext();

    const fetchMyOrders = async ()=>{
        try {
            const {data} = await axios.get('/api/order/user');
            if(data.success) {
                setMyOrders(data.orders);
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(()=>{
        if(user) {
            fetchMyOrders();
        }
    },[user])

  return (
    <div className='mt-16 pb-24 min-h-screen animate-in fade-in duration-700'>
       {/* Page Heading */}
       <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div className='flex flex-col w-max'>
                <h1 className='text-3xl md:text-4xl font-black text-heading uppercase tracking-tighter'>My Orders</h1>
                <div className='w-full h-1 bg-accent rounded-full mt-1'></div>
            </div>
            
            <p className="text-muted font-bold uppercase tracking-widest text-xs bg-surface px-4 py-2 rounded-full border border-border-soft">
                Found {myOrders.length} Previous Harvests
            </p>
        </div>

       <div className="space-y-12">
            {myOrders.map((order, index)=>(
                <div key={index} className='bg-card border border-border-main rounded-[32px] overflow-hidden shadow-2xl shadow-black/5 hover:shadow-black/20 transition-all duration-500 group'>
                    {/* Order Metadata Header */}
                    <div className='bg-surface/50 px-8 py-5 border-b border-border-soft flex flex-wrap justify-between items-center gap-6'>
                        <div className="space-y-1">
                            <p className='text-[10px] font-black text-muted uppercase tracking-[0.2em]'>Order Identity</p>
                            <p className="text-sm font-bold text-heading">#{order._id}</p>
                        </div>
                        <div className="space-y-1">
                            <p className='text-[10px] font-black text-muted uppercase tracking-[0.2em]'>Payment Mode</p>
                            <span className="text-sm font-black text-accent bg-accent/10 px-3 py-1 rounded-full border border-accent/20 uppercase tracking-widest leading-none block w-max mt-1">{order.paymentType}</span>
                        </div>
                        <div className="space-y-1">
                            <p className='text-[10px] font-black text-muted uppercase tracking-[0.2em]'>Fulfillment Amount</p>
                            <p className="text-xl font-black text-heading">{currency}{order.amount}</p>
                        </div>
                    </div>

                    {/* Order Items List */}
                    <div className="divide-y divide-border-soft">
                        {order.items.map((item, i)=>(
                            <div 
                                key={i}
                                className='p-8 flex flex-col md:flex-row md:items-center justify-between gap-10 hover:bg-surface/30 transition-colors'
                            >
                                <div className='flex items-center gap-8'>
                                    <div className='bg-surface border border-border-soft p-4 rounded-2xl group-hover:scale-105 transition-transform duration-500'>
                                        <img src={item.product.image[0]} alt="" className='w-20 h-20 object-contain drop-shadow-xl'/>
                                    </div>
                                    <div className='space-y-1.5'>
                                        <h2 className='text-xl font-black text-heading leading-tight group-hover:text-accent transition-colors'>{item.product.name}</h2>
                                        <div className="flex items-center gap-3">
                                            <p className="text-[10px] font-black text-muted uppercase tracking-widest">{item.product.category}</p>
                                            <span className="w-1.5 h-1.5 bg-border-soft rounded-full"></span>
                                            <p className="text-xs font-bold text-body">Quantity: <span className="text-accent">{item.quantity || "1"}</span></p>
                                        </div>
                                    </div>
                                </div>

                                <div className='flex flex-wrap md:flex-col items-center md:items-end gap-6 md:gap-3'>
                                    <div className="space-y-1 text-right">
                                        <p className='text-[10px] font-black text-muted uppercase tracking-[0.2em]'>Order Status</p>
                                        <p className="text-sm font-bold text-heading flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                            {order.status}
                                        </p>
                                    </div>
                                    <div className="space-y-1 text-right">
                                        <p className='text-[10px] font-black text-muted uppercase tracking-[0.2em]'>Harvest Date</p>
                                        <p className="text-sm font-bold text-body">{new Date(order.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                                    </div>
                                </div>

                                <div className="text-right flex flex-col items-end">
                                    <p className='text-[10px] font-black text-muted uppercase tracking-[0.2em] mb-1'>Item Total</p>
                                    <p className='text-2xl font-black text-accent'>
                                        {currency}{item.product.offerPrice * item.quantity}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
       </div>

       {myOrders.length === 0 && (
            <div className="flex flex-col items-center justify-center py-48 space-y-8 animate-in fade-in zoom-in duration-500 text-center">
                <div className="w-32 h-32 bg-surface rounded-[40px] flex items-center justify-center text-6xl shadow-inner border border-border-soft">🏺</div>
                <div className="space-y-2">
                    <h2 className="text-3xl font-black text-heading uppercase tracking-tighter">Your order vault is empty</h2>
                    <p className="text-muted font-bold uppercase tracking-widest text-xs">Start your first harvest today</p>
                </div>
                <button onClick={() => window.location.href = '/products'} className="px-12 py-4 bg-accent text-white font-black rounded-full shadow-xl shadow-accent/20 hover:scale-105 active:scale-95 transition-all text-sm uppercase tracking-widest">
                    Catalogue
                </button>
            </div>
       )}
    </div>
  )
}

export default MyOrders