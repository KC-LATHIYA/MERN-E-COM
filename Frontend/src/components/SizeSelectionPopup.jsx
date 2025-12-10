import React from 'react';

const SizeSelectionPopup = ({ 
  isOpen, 
  onClose, 
  product, 
  onSizeSelect 
}) => {
  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all">
      
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-4 mb-4">
            <img
              src={product.images[0]?.url}
              alt={product.name}
              className="w-16 h-16 object-cover rounded-lg"
            />
            <div>
              <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                {product.name}
              </h3>
              <p className="text-lg font-bold text-gray-900 mt-1">
                ₹{product.price}
              </p>
            </div>
          </div>
          <p className="text-sm text-gray-600">Select your preferred size</p>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-4 gap-3 mb-6">
            {product.sizes && product.sizes.map((size, index) => (
              <button
                key={index}
                onClick={() => onSizeSelect(product, size)}
                className="py-3 px-4 border-2 border-gray-300 rounded-xl text-sm font-semibold text-gray-700 hover:border-gray-900 hover:bg-gray-50 transition-all duration-200 active:scale-95"
              >
                {size.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-200"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SizeSelectionPopup;