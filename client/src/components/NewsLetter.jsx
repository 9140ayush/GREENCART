import React from 'react'

const NewsLetter = () => {
    
    return (
        <div className="flex flex-col items-center justify-center text-center space-y-6 mt-32 px-6 py-16 bg-surface dark:bg-card/40 rounded-[32px] border border-border-soft overflow-hidden relative group">
            <div className="relative z-10 transition-transform duration-500 group-hover:scale-[1.02]">
                <h1 className="md:text-5xl text-3xl font-black text-heading tracking-tight mb-4">
                    Never Miss a <span className="text-accent underline decoration-accent/30 underline-offset-8">Deal</span>!
                </h1>
                <p className="md:text-xl text-body font-medium max-w-lg mx-auto leading-relaxed">
                    Subscribe to get the latest offers, fresh arrivals, and exclusive discounts delivered to your inbox.
                </p>
                
                <form className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12 max-w-2xl w-full mx-auto">
                    <div className="relative w-full">
                        <input
                            className="bg-page dark:bg-surface border border-border-main rounded-full h-14 md:h-16 outline-none w-full px-8 text-heading font-medium focus:ring-4 focus:ring-accent/10 focus:border-accent/40 shadow-inner transition-all placeholder:text-muted"
                            type="email"
                            placeholder="Enter your email address"
                            required
                        />
                    </div>
                    <button type="submit" className="flex-shrink-0 px-10 h-14 md:h-16 font-black text-white bg-accent hover:bg-primary-dull transition-all shadow-xl shadow-accent/30 rounded-full cursor-pointer active:scale-95 text-lg">
                        Subscribe
                    </button>
                </form>

                <p className="mt-8 text-xs text-muted font-bold uppercase tracking-[0.2em]">Join 10,000+ Happy Customers</p>
            </div>

            {/* Premium Decorative Blobs */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-accent/5 blur-[100px] rounded-full -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-accent/5 blur-[100px] rounded-full translate-x-1/2 translate-y-1/2"></div>
        </div>
    )
}

export default NewsLetter;