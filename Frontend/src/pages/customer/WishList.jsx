import React from 'react';
import { useGetUserWishlistQuery, useRemoveItemFromWishlistMutation } from '../../utils/wishlistAPI';
import { useAddItemIncartMutation } from '../../utils/cartAPI';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const WishList = () => {

  const [RemoveItemFromWishlist] = useRemoveItemFromWishlistMutation();
  const [AddItemIncart] = useAddItemIncartMutation();

  const { data, isLoading } = useGetUserWishlistQuery();
  const wishlistItems = data?.data?.products || [];

  const navigate = useNavigate();

  const removeFromWishlist = async (id) => {
    try {
      const res = await RemoveItemFromWishlist(id).unwrap();
      Swal.fire({
        icon: "success",
        title: "Product Removed",
        text: res.message || "Product Removed From Wishlist Successfully!",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: res.message || "Failed To Removed Product From Wishlist. Please Try Again.",
      });
    }
  };

  const moveToCart = async (id, size) => {
    try {
      const res = await AddItemIncart({ id: id, data: { size: size, quantity: 1 } }).unwrap();
      await RemoveItemFromWishlist(id).unwrap();
      Swal.fire({
        icon: "success",
        title: "Product Added",
        text: res.message || "Product Added In Cart Successfully!",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error?.data?.message || "Failed To Add Item In Cart. Please Try Again.",
      });
    }
  };

  if (isLoading) {
    return <h1>Loading...</h1>
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Wishlist</h1>
          <p className="text-gray-600">Your saved items ({wishlistItems.length})</p>
        </div>

        {wishlistItems.length === 0 ? (

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Your wishlist is empty</h3>
              <p className="text-gray-600 mb-6">Save items you love to your wishlist for later.</p>
              <button onClick={() => navigate("/shop")} className="bg-gray-900 hover:bg-black text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300">
                Continue Shopping
              </button>
            </div>
          </div>
        ) : (

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">

            <div className="hidden md:block">
              <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50 border-b border-gray-200 text-sm font-semibold text-gray-700">
                <div className="col-span-6">Product</div>
                <div className="col-span-2 text-center">Price</div>
                <div className="col-span-2 text-center">Stock Status</div>
                <div className="col-span-2 text-center">Actions</div>
              </div>

              {wishlistItems.map((item) => (
                <div key={item.product._id} className="grid grid-cols-12 gap-4 px-6 py-6 border-b border-gray-200 items-center hover:bg-gray-50 transition-colors duration-200">

                  <div className="col-span-6">
                    <div className="flex items-center space-x-4">
                      <img
                        src={item.product.images[0].url}
                        alt={item.product.name}
                        className="w-16 h-20 object-cover rounded-lg"
                      />
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">{item.product.name}</h3>
                        <p className="text-sm text-gray-500 mb-1">{item.product.category}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>Size: {item.size}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-span-2 text-center">
                    <div className="flex flex-col items-center">
                      <span className="text-lg font-semibold text-gray-900">₹{item.product.price}</span>
                    </div>
                  </div>

                  <div className="col-span-2 text-center">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${item.product.countInStock
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                      }`}>
                      {item.product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>

                  <div className="col-span-2">
                    <div className="flex flex-col space-y-2">
                      <button
                        onClick={() => moveToCart(item.product._id, item.size)}
                        disabled={item.product.countInStock < 0}
                        className={`w-full px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${item.product.countInStock > 0
                          ? 'bg-gray-900 hover:bg-black text-white hover:shadow-lg'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          }`}
                      >
                        Add to Cart
                      </button>
                      <button
                        onClick={() => removeFromWishlist(item.product._id)}
                        className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="md:hidden">
              {wishlistItems.map((item) => (
                <div key={item._id} className="p-4 border-b border-gray-200">
                  <div className="flex space-x-4">
                    <img
                      src={item.product.images[0].url}
                      alt={item.product.name}
                      className="w-20 h-24 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold text-gray-900">{item.product.name}</h3>
                          <p className="text-sm text-gray-500">{item.product.category}</p>
                        </div>
                        <button
                          onClick={() => removeFromWishlist(item.product._id)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>

                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                        <span>Size: {item.size}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                          <span className="text-lg font-semibold text-gray-900">${item.product.price}</span>
                        </div>

                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${item.product.countInStock > 0
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                          }`}>
                          {item.product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </div>

                      <button
                        onClick={() => moveToCart(item)}
                        disabled={item.product.countInStock < 0}
                        className={`w-full mt-3 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${item.product.countInStock > 0
                          ? 'bg-gray-900 hover:bg-black text-white'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          }`}
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default WishList;