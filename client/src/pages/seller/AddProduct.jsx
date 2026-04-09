import React, { useState } from 'react'
import { assets, categories } from '../../assets/assets';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const AddProduct = () => {

    const [files, setFiles] = useState([]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [price, setPrice] = useState('');
    const [offerPrice, setOfferPrice] = useState('');

    const {axios} = useAppContext()

    const onSubmitHandler = async (event)=>{
        try {
            event.preventDefault();

            const productData = {
                name,
                description: description.split('\n'),
                category,
                price,
                offerPrice
            }

            const formData = new FormData();
            formData.append('productData', JSON.stringify(productData));
            for (let i = 0; i < files.length; i++) {
                formData.append('images', files[i])
            }

            const {data} = await axios.post('/api/product/add', formData)
            
            if(data.success) {
                toast.success(data.message)
                setName('');
                setDescription('');
                setCategory('');
                setPrice('');
                setOfferPrice('');
                setFiles([]);
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

  return (
        <div className="no-scrollbar flex-1 max-w-4xl animate-in fade-in duration-500" >
            <div className="mb-10">
                <h1 className="text-3xl font-black text-heading uppercase tracking-tighter">Add New Product</h1>
                <p className="text-muted font-bold uppercase tracking-widest text-[10px] mt-1">Inventory Management • Step 1 of 1</p>
            </div>

            <form onSubmit={onSubmitHandler} className="space-y-8 max-w-2xl">
                {/* Image Upload Section */}
                <div className="bg-card border border-border-main p-8 rounded-[32px] shadow-sm">
                    <p className="text-sm font-black text-heading uppercase tracking-widest mb-6">Product Imagery</p>
                    <div className="flex flex-wrap items-center gap-4">
                        {Array(4).fill('').map((_, index) => (
                            <label key={index} htmlFor={`image${index}`} className="group cursor-pointer">
                                <input
                                accept="image/*" 
                                onChange={(e)=>{
                                    const updatedFiles = [...files];
                                    updatedFiles[index] = e.target.files[0]
                                    setFiles(updatedFiles)
                                }}
                                type="file" id={`image${index}`} hidden 
                                />
                                <div className="w-28 h-28 bg-surface border-2 border-dashed border-border-main rounded-2xl flex items-center justify-center overflow-hidden group-hover:border-accent transition-all relative">
                                    {files[index] ? (
                                        <img className="w-full h-full object-cover" src={URL.createObjectURL(files[index])} alt="preview" />
                                    ) : (
                                        <div className="flex flex-col items-center gap-2">
                                            <img className="w-8 opacity-40 dark:invert" src={assets.upload_area} alt="upload" />
                                            <span className="text-[10px] font-black text-muted uppercase">Upload</span>
                                        </div>
                                    )}
                                </div>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Main Details Section */}
                <div className="bg-card border border-border-main p-8 rounded-[32px] shadow-sm space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-muted uppercase tracking-widest px-1" htmlFor="product-name">Product Name</label>
                        <input 
                            onChange={(e)=> setName(e.target.value)} value={name}
                            id="product-name" type="text" placeholder="Organic Green Apples" 
                            className="w-full bg-surface border border-border-main rounded-2xl py-4 px-6 focus:ring-4 focus:ring-accent/10 focus:border-accent/40 outline-none transition-all font-bold text-heading placeholder:text-muted/50" 
                            required 
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-muted uppercase tracking-widest px-1" htmlFor="product-description">Product Description</label>
                        <textarea 
                            onChange={(e)=> setDescription(e.target.value)} value={description} 
                            id="product-description" rows={4} 
                            className="w-full bg-surface border border-border-main rounded-2xl py-4 px-6 focus:ring-4 focus:ring-accent/10 focus:border-accent/40 outline-none transition-all font-bold text-heading placeholder:text-muted/50 resize-none leading-relaxed" 
                            placeholder="Fresh from the farm. Naturally sweet and crunchy..."
                        ></textarea>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-muted uppercase tracking-widest px-1" htmlFor="category">Category</label>
                            <select  
                                onChange={(e)=> setCategory(e.target.value)} value={category}
                                id="category" 
                                className="w-full bg-surface border border-border-main rounded-2xl py-4 px-6 focus:ring-4 focus:ring-accent/10 focus:border-accent/40 outline-none transition-all font-bold text-heading cursor-pointer appearance-none"
                                style={{backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%234FBF8B' stroke-width='3'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1.25rem center', backgroundSize: '1.25rem'}}
                            >
                                <option value="">Select Category</option>
                                {categories.map((item, index)=>(
                                    <option key={index} value={item.path}>{item.path}</option>
                                ))}
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-muted uppercase tracking-widest px-1" htmlFor="product-price">Normal Price</label>
                                <input  
                                    onChange={(e)=> setPrice(e.target.value)} value={price}
                                    id="product-price" type="number" placeholder="0.00" 
                                    className="w-full bg-surface border border-border-main rounded-2xl py-4 px-6 focus:ring-4 focus:ring-accent/10 focus:border-accent/40 outline-none transition-all font-bold text-heading" 
                                    required 
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-muted uppercase tracking-widest px-1" htmlFor="offer-price">Offer Price</label>
                                <input  
                                    onChange={(e)=> setOfferPrice(e.target.value)} value={offerPrice}
                                    id="offer-price" type="number" placeholder="0.00" 
                                    className="w-full bg-surface border border-border-main rounded-2xl py-4 px-6 focus:ring-4 focus:ring-accent/10 focus:border-accent/40 outline-none transition-all font-bold text-accent" 
                                    required 
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-end gap-6 pt-4">
                    <button type="button" onClick={() => navigate('/seller/product-list')} className="text-muted font-black uppercase tracking-widest text-xs hover:text-heading transition-colors cursor-pointer">Discard Draft</button>
                    <button className="px-12 py-5 bg-accent text-white font-black rounded-2xl shadow-xl shadow-accent/20 hover:bg-primary-dull hover:-translate-y-1 active:translate-y-0 transition-all uppercase tracking-[0.15em] text-sm cursor-pointer">
                        Publish Product
                    </button>
                </div>
            </form>
        </div>
    );
}

export default AddProduct