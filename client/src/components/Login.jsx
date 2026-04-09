import React from 'react'
import {useAppContext} from '../context/AppContext'
import toast from 'react-hot-toast';

const Login = () => {
    const { setShowUserLogin, setUser, axios, navigate } = useAppContext();
    const [state, setState] = React.useState("login");
    const [name, setName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");

    const onSubmitHandler = async (event)=>{
        try {
            event.preventDefault();

            const {data} = await axios.post(`/api/user/${state}`, {
                name, email, password
            });
            if(data.success) {
                navigate('/')
                setUser(data.user)
                setShowUserLogin(false)
            } else {
                toast.error(data.message)
            }         
        } catch (error) {
            toast.error(error.message)
        }
    }

  return (
    <div onClick={()=> setShowUserLogin(false)} className='fixed inset-0 z-[200] flex items-center justify-center bg-black/60 dark:bg-black/80 backdrop-blur-sm px-6 animate-in fade-in duration-300'>
        <form 
            onSubmit={onSubmitHandler} 
            onClick={(e)=>e.stopPropagation()} 
            className="flex flex-col gap-6 m-auto items-start p-10 md:p-12 w-full max-w-[420px] rounded-[40px] shadow-2xl border border-border-main bg-card animate-in zoom-in-95 duration-300"
        >
            <div className="w-full text-center space-y-2 mb-4">
                <h1 className="text-3xl font-black text-heading uppercase tracking-tighter">
                    {state === "login" ? "Welcome Back" : "Start Fresh"}
                </h1>
                <p className="text-xs font-bold text-muted uppercase tracking-[0.25em]">GreenCart Community Portal</p>
            </div>

            {state === "register" && (
                <div className="w-full space-y-1.5">
                    <label className="text-[10px] font-black text-muted uppercase tracking-widest px-1">Full Name</label>
                    <input 
                        onChange={(e) => setName(e.target.value)} value={name} 
                        placeholder="John Doe" 
                        className="w-full bg-surface border border-border-soft rounded-2xl py-4 px-6 focus:ring-4 focus:ring-accent/10 focus:border-accent/40 outline-none transition-all font-bold text-heading placeholder:text-muted/40" 
                        type="text" required 
                    />
                </div>
            )}
            
            <div className="w-full space-y-1.5">
                <label className="text-[10px] font-black text-muted uppercase tracking-widest px-1">Email Address</label>
                <input 
                    onChange={(e) => setEmail(e.target.value)} value={email} 
                    placeholder="name@example.com" 
                    className="w-full bg-surface border border-border-soft rounded-2xl py-4 px-6 focus:ring-4 focus:ring-accent/10 focus:border-accent/40 outline-none transition-all font-bold text-heading placeholder:text-muted/40" 
                    type="email" required 
                />
            </div>

            <div className="w-full space-y-1.5">
                <label className="text-[10px] font-black text-muted uppercase tracking-widest px-1">Password</label>
                <input 
                    onChange={(e) => setPassword(e.target.value)} value={password} 
                    placeholder="••••••••" 
                    className="w-full bg-surface border border-border-soft rounded-2xl py-4 px-6 focus:ring-4 focus:ring-accent/10 focus:border-accent/40 outline-none transition-all font-bold text-heading placeholder:text-muted/40" 
                    type="password" required 
                />
            </div>

            <button className="w-full py-5 bg-accent text-white font-black rounded-full shadow-xl shadow-accent/20 hover:bg-primary-dull hover:-translate-y-1 active:scale-95 transition-all text-sm uppercase tracking-widest mt-4">
                {state === "register" ? "Create Account" : "Access Account"}
            </button>

            <div className="w-full text-center mt-2">
                {state === "register" ? (
                    <p className="text-xs font-bold text-muted">
                        Already have account? <span onClick={() => setState("login")} className="text-accent cursor-pointer hover:underline underline-offset-4">Click here to Login</span>
                    </p>
                ) : (
                    <p className="text-xs font-bold text-muted">
                        Don't have an account? <span onClick={() => setState("register")} className="text-accent cursor-pointer hover:underline underline-offset-4">Click here to Sign Up</span>
                    </p>
                )}
            </div>
        </form>
    </div>
  )
}

export default Login