// ProductCard.jsx
import React from 'react';

const Card = () => {
  return (
    <div className="w-full max-w-xs bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 font-sans overflow-hidden group">
      {/* Product Image Container */}
      <div className="relative overflow-hidden bg-gray-100">
        <img
          src="https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80"
          alt="Girls Tops"
          className="w-full h-72 sm:h-80 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Quick Actions Overlay */}
        <div className="absolute top-3 left-3">
          <span className="bg-white/95 text-gray-700 text-xs font-medium px-3 py-1.5 rounded-full backdrop-blur-sm">
            Kids
          </span>
        </div>
        
        {/* Wishlist Button */}
        <button className="absolute top-3 right-3 bg-white/95 p-2 rounded-full backdrop-blur-sm hover:bg-white transition-colors duration-200 shadow-sm">
          <svg className="w-4 h-4 text-gray-600 hover:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>

      {/* Product Info */}
      <div className="p-4 sm:p-5">
        {/* Category and Title */}
        <div className="mb-3">
          <span className="text-xs text-gray-500 font-medium tracking-wide uppercase">Kids</span>
          <h3 className="text-lg font-semibold text-gray-900 mt-1 line-clamp-2 leading-tight">Girls Tops</h3>
        </div>

        {/* Stock Status */}
        <div className="flex items-center mb-4">
          <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
          <span className="text-sm text-green-600 font-medium">In Stock</span>
        </div>

        {/* Price and Button */}
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-gray-900">$138</span>
            <span className="text-sm text-gray-500 line-through">$165</span>
            <span className="text-xs font-medium bg-green-100 text-green-700 px-2 py-1 rounded-full">16% off</span>
          </div>
          
          <button className="bg-gray-900 hover:bg-black text-white px-5 py-3 text-sm font-medium rounded-lg transition-all duration-200 hover:shadow-lg active:scale-95 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default Card;