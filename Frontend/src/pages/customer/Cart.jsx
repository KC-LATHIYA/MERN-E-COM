import React, { useState } from 'react';
import { useGetUserCartQuery, useRemoveItemFromCartMutation, useUpdateQuantityOfItemMutation } from '../../utils/cartAPI';
import { useAddItemToWishlistMutation } from '../../utils/wishlistAPI';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const Cart = () => {

  const { data, isLoading } = useGetUserCartQuery();
  const cartItems = data?.data?.items || [];
  const OrderSummary = data?.data;

  const [removeItemFromCart] = useRemoveItemFromCartMutation();
  const [addItemToWishlist] = useAddItemToWishlistMutation();
  const [updateQuantityOfItem] = useUpdateQuantityOfItemMutation();

  const navigate = useNavigate();

  const handleIncrement = async (id) => {
    try {
      await updateQuantityOfItem({ id: id, data: { plus: true } }).unwrap();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDecrement = async (id) => {
    try {
      await updateQuantityOfItem({ id: id, data: { minus: true } }).unwrap();
    } catch (error) {
      console.log(error);
    }
  };

  const removeFromCart = async (id) => {
    try {
      const res = await removeItemFromCart(id).unwrap();
      Swal.fire({
        icon: "success",
        title: "Product Removed",
        text: res.message || "Product Removed From Cart Successfully!",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: res.message || "Failed To Removed Product From Cart. Please Try Again.",
      });
    }
  };

  const moveToWishlist = async (id, size) => {
    try {
      const res = await addItemToWishlist({ id: id, data: { size: size } }).unwrap();
      await removeItemFromCart(id).unwrap();
      Swal.fire({
        icon: "success",
        title: "Product Added",
        text: res.message || "Product Added In Wishlist Successfully!",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error?.data?.message || "Failed To Add Item In Wishlist. Please Try Again.",
      });
    }
  };

  const subtotal = OrderSummary?.totalPrice
  const shipping = OrderSummary?.totalPrice > 1000 ? 0 : 150;
  const total = OrderSummary?.totalPrice + shipping;

  if (isLoading) {
    return (
      <h1> Cart Data Was Loading</h1>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
          <p className="text-gray-600">{cartItems.length} items in your cart</p>
        </div>

        {cartItems.length === 0 ? (

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h3>
              <p className="text-gray-600 mb-6">Add some items to your cart to get started.</p>
              <button onClick={() => navigate("/shop")} className="bg-gray-900 hover:bg-black text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300">
                Continue Shopping
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">

                <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50 border-b border-gray-200 text-sm font-semibold text-gray-700">
                  <div className="col-span-6">Product</div>
                  <div className="col-span-2 text-center">Price</div>
                  <div className="col-span-2 text-center">Quantity</div>
                  <div className="col-span-2 text-center">Total</div>
                </div>

                {cartItems.map((item) => (
                  <div key={item._id} className="grid grid-cols-12 gap-4 px-6 py-6 border-b border-gray-200 items-center hover:bg-gray-50 transition-colors duration-200">

                    <div className="col-span-6">
                      <div className="flex items-center space-x-4">
                        <img
                          src={item?.product?.images[0].url}
                          alt={item?.product?.name}
                          className="w-16 h-20 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">{item?.product?.name}</h3>
                          <p className="text-sm text-gray-500 mb-1">{item?.product?.category}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span>Size: {item.size}</span>
                          </div>
                          <div className="flex space-x-4 mt-2">
                            <button
                              onClick={() => moveToWishlist(item?.product?._id, item?.size)}
                              className="text-sm text-blue-600 hover:text-blue-800 transition-colors duration-200"
                            >
                              Move to Wishlist
                            </button>
                            <button
                              onClick={() => removeFromCart(item?.product?._id)}
                              className="text-sm text-red-600 hover:text-red-800 transition-colors duration-200"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    < div className="col-span-2 text-center" >
                      <div className="flex flex-col items-center">
                        <span className="text-lg font-semibold text-gray-900">₹{item?.product?.price}</span>
                      </div>
                    </div>

                    <div className="col-span-2">
                      <div className="flex items-center justify-center space-x-3">
                        <button
                          onClick={() => handleDecrement(item?.product?._id)}
                          className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                          </svg>
                        </button>
                        <span className="w-12 text-center font-semibold text-gray-900">{item.quantity}</span>
                        <button
                          onClick={() => handleIncrement(item?.product?._id)}
                          className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    <div className="col-span-2 text-center">
                      <span className="text-lg font-semibold text-gray-900">
                        ₹{item?.price}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <button onClick={() => navigate("/shop")} className="flex items-center text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Continue Shopping
                </button>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h3>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? 'Free' : `₹ ${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between text-lg font-semibold text-gray-900">
                      <span>Total</span>
                      <span>₹{total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <button className="w-full bg-gray-900 hover:bg-black text-white py-3 rounded-lg font-semibold text-lg transition-all duration-300 hover:shadow-lg mb-4"
                  onClick={() => navigate("/checkout")}
                >
                  Proceed to Checkout
                </button>

                <div className="text-center">
                  <div className="flex items-center justify-center space-x-2 text-sm text-gray-500 mb-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span>Secure checkout</span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Your personal data will be used to process your order and support your experience.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )
        }
      </div >
    </div >
  );
};

export default Cart;