import { Link, NavLink, Outlet } from "react-router-dom";
import { assets } from "../../assets/assets";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const SellerLayout = () => {

    const { axios, navigate } = useAppContext();

    const sidebarLinks = [
        { name: "Add Product", path: "/seller", icon: assets.add_icon },
        { name: "Product List", path: "/seller/product-list", icon: assets.product_list_icon },
        { name: "Orders", path: "/seller/orders", icon: assets.order_icon },
    ];
    
    const logout = async ()=>{
        try {
            const {data} = await axios.get('/api/seller/logout');
            if(data.success) {
                toast.success(data.message)
                navigate('/')
            } else {
                toast.error(data.message)
            }
        } catch (error) {
                toast.error(error.message)
        }
    }

    return (
        <div className="flex flex-col min-h-screen bg-page">
            <header className="flex items-center justify-between px-6 md:px-10 border-b border-border-main py-4 bg-card sticky top-0 z-[100] backdrop-blur-md">
                <Link to={'/'}>
                    <img src={assets.logo} alt="logo" className="cursor-pointer w-34 md:w-38 dark:brightness-200 contrast-125 transition-all"/>
                </Link>
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold text-xs shadow-inner">A</div>
                        <p className="hidden sm:block text-sm font-black text-heading uppercase tracking-widest">Admin Dashboard</p>
                    </div>
                    <button onClick={logout} className='border border-border-main text-muted hover:text-red-500 hover:bg-red-500/5 hover:border-red-500/30 rounded-full text-xs font-black uppercase tracking-widest px-6 py-2 transition-all cursor-pointer'>Logout</button>
                </div>
            </header>
            
            <div className="flex flex-1">
                <aside className="md:w-72 w-20 border-r h-[calc(100vh-73px)] border-border-main bg-card pt-6 flex flex-col sticky top-[73px]">
                    <div className="px-4 mb-6">
                        <p className="hidden md:block text-[10px] font-black text-muted uppercase tracking-[0.25em] px-4">Management</p>
                    </div>
                    <nav className="space-y-2 px-3">
                        {sidebarLinks.map((item) => (
                            <NavLink to={item.path} key={item.name} end={item.path === "/seller"}
                                className={({isActive})=>`flex items-center py-4 px-4 gap-4 rounded-2xl transition-all duration-300 group
                                    ${isActive 
                                        ? "bg-accent/10 border border-accent/20 text-accent shadow-lg shadow-accent/5 font-black"
                                        : "text-body hover:bg-surface border border-transparent"
                                    }`
                                }
                            >
                                <div className="p-2 rounded-xl group-hover:scale-110 transition-transform dark:invert opacity-80 group-[.active]:opacity-100 group-[.active]:invert-0">
                                    <img src={item.icon} alt="" className="w-6 h-6"/>
                                </div>
                                <p className="md:block hidden text-sm tracking-wide">{item.name}</p>
                            </NavLink>
                        ))}
                    </nav>

                    <div className="mt-auto p-6">
                         <div className="hidden md:block p-6 bg-surface rounded-[24px] border border-border-soft">
                             <p className="text-xs font-black text-heading mb-2">Need help?</p>
                             <p className="text-[10px] text-muted leading-relaxed font-bold">Access seller documentation or contact support specialized for merchants.</p>
                         </div>
                    </div>
                </aside>
                
                <main className="flex-1 bg-page p-6 md:p-12 overflow-y-auto">
                    <Outlet/>
                </main>
            </div>
        </div>
    );
};

export default SellerLayout;