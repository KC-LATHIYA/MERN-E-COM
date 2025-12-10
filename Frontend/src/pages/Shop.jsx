import React, { useState, useMemo } from 'react';
import { useGetAllProductQuery } from '../utils/productAPI';
import { Link, useNavigate } from 'react-router-dom';
import SizeSelectionPopup from '../components/SizeSelectionPopup';
import { useAddItemToWishlistMutation, useGetUserWishlistQuery, useRemoveItemFromWishlistMutation } from '../utils/wishlistAPI';
import { useAddItemIncartMutation, useGetUserCartQuery, useUpdateQuantityOfItemMutation } from '../utils/cartAPI';
import Swal from "sweetalert2";
import { useSelector } from 'react-redux';

const Shop = () => {

  const user = useSelector((state) => state.authSlice.user);
  const { data, isLoading } = useGetAllProductQuery();
  const products = data?.data || [];

  const [AddItemToWishlist] = useAddItemToWishlistMutation();
  const [RemoveItemFromWishlist] = useRemoveItemFromWishlistMutation();
  const [AddItemIncart] = useAddItemIncartMutation();
  const [UpdateQuantityOfItem] = useUpdateQuantityOfItemMutation();

  const { data: wishlistdata } = useGetUserWishlistQuery();
  const wishlist = wishlistdata?.data?.products || [];
  const { data: cartdata } = useGetUserCartQuery();
  const cart = cartdata?.data?.items || [];

  const [showSizePopup, setShowSizePopup] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showSizeCart, setShowSizeCart] = useState(false);
  const [cartItemSelected, setCartItemSelected] = useState(null);
  const navigate = useNavigate();

  const shuffleArray = (array) => {
    let products = [...array]
    for (let i = products.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [products[i], products[j]] = [products[j], products[i]]
    }
    return products
  }

  const rendomProducts = useMemo(() => shuffleArray(products), [products]);

  const isInWishlist = (productId) => {
    return wishlist.some(item => item?.product?._id === productId);
  };

  const isInCart = (productId) => {
    return cart.find(item => item?.product?._id === productId)
  }

  const handleWishlistClick = async (product) => {
    if (user) {
      try {
        if (isInWishlist(product._id)) {
          const res = await RemoveItemFromWishlist(product._id).unwrap();
          Swal.fire({
            icon: "success",
            title: "Product Removed",
            text: res.message || "Product Removed From Wishlist Successfully!",
          });
          return;
        }

        if (product.sizes && product.sizes.length > 0) {
          setSelectedProduct(product);
          setShowSizePopup(true);
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error?.data?.message || "Failed Removed Product From Wishlist. Please Try Again.",
        });
      }
    } else {
      navigate("/signin")
    }
  };

  const addToWishlist = async (product, selectedSize) => {
    try {
      const res = await AddItemToWishlist({ id: product._id, data: { size: selectedSize } }).unwrap();
      Swal.fire({
        icon: "success",
        title: "Product Added",
        text: res.message || "Item Added In Wishlist Successfully!",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error?.data?.message || "Failed To Add Item In Wishlist. Please Try Again.",
      });
    } finally {
      setShowSizePopup(false);
      setSelectedProduct(null);
    }
  };

  const closePopup = () => {
    setShowSizePopup(false);
    setSelectedProduct(null);
  };

  const handleCartClick = (product) => {
    if (user) {
      if (product.sizes && product.sizes.length > 0) {
        setCartItemSelected(product);
        setShowSizeCart(true);
      }
    } else {
      navigate("/signin")
    }
  }

  const addItemToCart = async (product, size) => {
    try {
      const res = await AddItemIncart({ id: product?._id, data: { size: size, quantity: 1 } }).unwrap();
      Swal.fire({
        icon: "success",
        title: "Product Added",
        text: res.message || "Item Added In Cart Successfully!",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error?.data?.message || "Failed To Add Item in Cart. Please Try Again.",
      });
    } finally {
      setCartItemSelected(null);
      setShowSizeCart(false);
    }
  }

  const closeCartPopup = () => {
    setShowSizeCart(false);
    setCartItemSelected(null);
  }

  const handleIncrement = async (id) => {
    try {
      await UpdateQuantityOfItem({ id: id, data: { plus: true } }).unwrap();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDecrement = async (id) => {
    try {
      await UpdateQuantityOfItem({ id: id, data: { minus: true } }).unwrap();
    } catch (error) {
      console.log(error);
    }
  };

  if (isLoading) {
    return <h1>Loading...</h1>
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      <SizeSelectionPopup
        isOpen={showSizePopup}
        onClose={closePopup}
        product={selectedProduct}
        onSizeSelect={addToWishlist}
      />

      <SizeSelectionPopup
        isOpen={showSizeCart}
        onClose={closeCartPopup}
        product={cartItemSelected}
        onSizeSelect={addItemToCart}
      />

      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Featured Products</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Discover our latest collection of trendy and comfortable clothing for the whole family
        </p>
      </div>

      {rendomProducts.length === 0 ? (
        <div className="text-center py-16">
          <h3 className="text-2xl font-semibold text-gray-700 mb-2">No Products Found</h3>
          <p className="text-gray-500">Try exploring other categories or check back later!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 sm:gap-8">
          {rendomProducts.map((product) => {
            const inWishlist = isInWishlist(product._id);
            const inCart = isInCart(product._id);
            return (
              <div
                key={product._id}
                className="w-full bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 font-sans overflow-hidden group"
              >

                <div className="relative overflow-hidden bg-gray-100">
                  <img
                    src={product.images[0]?.url}
                    alt={product.name}
                    className="w-full h-64 sm:h-72 object-cover group-hover:scale-110 transition-transform duration-500"
                  />

                  <div className="absolute top-4 left-4">
                    <span className="bg-white/95 text-gray-700 text-xs font-semibold px-3 py-1.5 rounded-full backdrop-blur-sm uppercase tracking-wide">
                      Men
                    </span>
                  </div>

                  <div className="absolute top-4 right-4">
                    <span className={`text-xs font-bold px-2.5 py-1.5 rounded-full ${product.countInStock > 0
                      ? 'bg-green-500 text-white'
                      : 'bg-red-500 text-white'
                      }`}>
                      {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>

                  <button
                    onClick={() => handleWishlistClick(product)}
                    className={`absolute bottom-4 right-4 p-2.5 rounded-full backdrop-blur-sm transition-all duration-200 shadow-sm hover:shadow-md ${inWishlist
                      ? 'bg-red-500/95 hover:bg-red-600'
                      : 'bg-white/95 hover:bg-white'
                      }`}
                  >
                    <svg
                      className={`w-4 h-4 transition-colors ${inWishlist ? 'text-white' : 'text-gray-600 hover:text-red-500'
                        }`}
                      fill={inWishlist ? "currentColor" : "none"}
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                  </button>

                  {product.countInStock === 0 && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="bg-white text-gray-900 font-semibold px-4 py-2 rounded-lg">Out of Stock</span>
                    </div>
                  )}
                </div>

                <div className="p-4 sm:p-6">
                  <Link to={`/product-details/${product._id}`}>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 leading-tight group-hover:text-gray-700 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {product.description}
                    </p>
                  </Link>

                  {product.sizes && product.sizes.length > 0 && (
                    <div className="flex items-center mb-3">
                      <span className="text-xs text-gray-500 mr-2">Sizes:</span>
                      <div className="flex space-x-1">
                        {product.sizes.map((size, index) => (
                          <span key={index} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                            {size.toUpperCase()}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {inWishlist && (
                    <div className="flex items-center mb-2">
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                        ✓ In Wishlist
                      </span>
                    </div>
                  )}

                  <div className="flex items-center mb-4">
                    <div className={`w-2 h-2 rounded-full mr-2 ${product.countInStock > 0 ? 'bg-green-500' : 'bg-red-500'
                      }`}></div>
                    <span className={`text-sm font-medium ${product.countInStock > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                      {product.countInStock > 0 ? `${product.countInStock} in stock` : 'Out of Stock'}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <span className="text-2xl font-bold text-gray-900">₹{product.price}</span>
                    </div>

                    {
                      inCart ? (
                        <div className="flex items-center justify-center w-full sm:w-auto bg-gray-900 text-white rounded-xl px-6 py-3 font-semibold text-sm sm:text-base transition-all duration-200 hover:shadow-lg active:scale-95 gap-3">

                          <button
                            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-800 hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                            onClick={() => handleDecrement(product._id)}
                            disabled={inCart.quantity <= 1}
                          >
                            <svg
                              className="w-4 h-4 sm:w-5 sm:h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                            </svg>
                          </button>

                          <span className="text-base sm:text-lg font-semibold text-center min-w-[32px]">
                            {inCart.quantity}
                          </span>

                          <button
                            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-800 hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                            onClick={() => handleIncrement(product._id)}
                            disabled={inCart.quantity >= product.countInStock}
                          >
                            <svg
                              className="w-4 h-4 sm:w-5 sm:h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                          </button>
                        </div>
                      ) : (
                        <button
                          className={`${product.countInStock > 0
                            ? 'bg-gray-900 hover:bg-black text-white hover:shadow-lg active:scale-95'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            } px-6 py-3 text-sm font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 w-full sm:w-auto`}
                          disabled={product.countInStock === 0}
                          onClick={() => handleCartClick(product)}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          {product.countInStock > 0 ? 'Add to Cart' : 'Out of Stock'}
                        </button>
                      )
                    }
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Shop;