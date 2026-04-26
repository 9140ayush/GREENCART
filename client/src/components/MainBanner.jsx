import React from 'react';
import { Link } from 'react-router-dom';
import { assets } from '../assets/assets';
import { useAppContext } from '../context/AppContext';

const MainBanner = () => {
  const { navigate } = useAppContext();

  return (
    <div className="relative w-full rounded-[32px] overflow-hidden mt-8 shadow-2xl bg-white dark:bg-[#111A15] border border-[#E8F6F0] dark:border-[#29A56C]/20 flex flex-col md:flex-row transition-colors duration-300">
      
      {/* Decorative Blur Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[50%] bg-[#3BB77E]/10 dark:bg-[#3BB77E]/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[40%] w-[30%] h-[40%] bg-[#29A56C]/10 dark:bg-[#29A56C]/5 blur-[100px] rounded-full pointer-events-none" />

      {/* Left Content Area */}
      <div className="w-full md:w-1/2 p-8 sm:p-12 md:p-16 lg:p-20 flex flex-col justify-center relative z-10">
        
        {/* Organic Badge */}
        <div className="inline-flex items-center gap-2 bg-[#E8F6F0] dark:bg-[#3BB77E]/10 border border-[#3BB77E]/20 text-[#29A56C] dark:text-[#3BB77E] px-4 py-1.5 rounded-full w-fit mb-6 animate-fadeInUp" style={{ animationDuration: '0.6s' }}>
          <span className="text-sm font-bold tracking-wider uppercase">🌿 100% Organic Produce</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 dark:text-white leading-[1.1] mb-6 tracking-tight animate-fadeInUp" style={{ animationDuration: '0.8s' }}>
          Fresh Groceries,<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3BB77E] to-[#29A56C]">
            Delivered Fast
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-md leading-relaxed animate-fadeInUp" style={{ animationDuration: '1s' }}>
          Experience the finest farm-fresh produce and everyday essentials brought directly to your door in under 30 minutes.
        </p>

        {/* Call to Action Buttons */}
        <div className="flex flex-wrap items-center gap-4 animate-fadeInUp" style={{ animationDuration: '1.2s' }}>
          <Link
            to="/products"
            className="group flex items-center gap-3 bg-[#3BB77E] hover:bg-[#29A56C] text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg shadow-[#3BB77E]/30 transition-all duration-300 transform hover:-translate-y-1"
          >
            Start Shopping
            <img src={assets.white_arrow_icon} alt="arrow" className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          
          <Link
            to="/products"
            className="group flex items-center gap-3 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white px-8 py-4 rounded-full font-bold text-lg border-2 border-gray-100 dark:border-gray-700 transition-all duration-300 transform hover:-translate-y-1"
          >
            Explore Deals
          </Link>
        </div>

        {/* Trust Indicators */}
        <div className="mt-10 pt-8 border-t border-gray-100 dark:border-gray-800 flex items-center gap-6 sm:gap-8 animate-fadeInUp" style={{ animationDuration: '1.4s' }}>
          <div className="flex flex-col">
            <span className="text-2xl font-black text-gray-900 dark:text-white">10k+</span>
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Happy Users</span>
          </div>
          <div className="w-px h-10 bg-gray-200 dark:bg-gray-800"></div>
          <div className="flex flex-col">
            <span className="text-2xl font-black text-gray-900 dark:text-white">30min</span>
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Fast Delivery</span>
          </div>
          <div className="w-px h-10 bg-gray-200 dark:bg-gray-800 hidden sm:block"></div>
          <div className="flex-col hidden sm:flex">
            <span className="text-2xl font-black text-gray-900 dark:text-white">4.9/5</span>
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Store Rating</span>
          </div>
        </div>
      </div>

      {/* Right Image Area */}
      <div className="w-full md:w-1/2 min-h-[400px] md:min-h-full relative overflow-hidden group">
        {/* The generated high-quality e-commerce photo */}
        <img
          src={assets.new_hero_image}
          alt="Fresh organic groceries"
          className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-[1.5s] ease-out"
        />
        
        {/* Subtle gradient overlay to smoothly blend the image with the left column on desktop */}
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/20 to-transparent dark:from-[#111A15] dark:via-[#111A15]/20 hidden md:block" />
        
        {/* Floating Element - Delivery Time */}
        <div className="absolute bottom-8 right-8 bg-white/90 dark:bg-[#1A261E]/90 backdrop-blur-md px-6 py-4 rounded-2xl shadow-xl border border-white/20 dark:border-white/5 animate-fadeInUp flex items-center gap-4" style={{ animationDelay: '0.8s' }}>
          <div className="w-12 h-12 bg-[#E8F6F0] dark:bg-[#3BB77E]/20 rounded-full flex items-center justify-center text-2xl">
            ⚡
          </div>
          <div>
            <p className="text-gray-900 dark:text-white font-black text-lg">Under 30 min</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Guaranteed Delivery</p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default MainBanner;