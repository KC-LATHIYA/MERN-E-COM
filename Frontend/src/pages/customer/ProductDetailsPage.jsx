import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useGetProductByIdQuery } from '../../utils/productAPI';
import { useAddItemIncartMutation, useGetUserCartQuery, useUpdateQuantityOfItemMutation } from '../../utils/cartAPI';
import { useAddItemToWishlistMutation, useGetUserWishlistQuery, useRemoveItemFromWishlistMutation } from '../../utils/wishlistAPI';
import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';

const ProductDetailsPage = () => {

  const user = useSelector((state) => state.authSlice.user);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  const { productId } = useParams();
  const { data, isLoading } = useGetProductByIdQuery(productId);
  const product = data?.data || [];
  const [AddItemIncart] = useAddItemIncartMutation();
  const [UpdateQuantityOfItem] = useUpdateQuantityOfItemMutation();
  const [AddItemToWishlist] = useAddItemToWishlistMutation();
  const [RemoveItemFromWishlist] = useRemoveItemFromWishlistMutation();
  const navigate = useNavigate();

  const { data: cartData } = useGetUserCartQuery();
  const cart = cartData?.data?.items || [];
  const { data: wishlistData } = useGetUserWishlistQuery();
  const wishlist = wishlistData?.data?.products || [];

  const existedInCart = cart.find((item) => item.product._id === productId);
  const existedInWishlist = wishlist.some((item) => item.product._id === productId);

  const handleAddToCart = async (id) => {
    if (user) {
      if (!selectedSize) {
        alert('Please select size and color');
        return;
      }
      try {
        const res = await AddItemIncart({ id: id, data: { quantity: quantity, size: selectedSize } }).unwrap();
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
      }
    } else {
      navigate("/signin");
    }
  };

  const handleAddToWishlist = async (id) => {
    if (user) {
      try {
        const res = await AddItemToWishlist({ id: id, data: { size: selectedSize } }).unwrap();
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
      }
    } else {
      navigate("/signin");
    }
  };

  const handleRemoveFromWishlist = async (id) => {
    if (user) {
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
          text: error?.data?.message || "Failed Removed Product From Wishlist. Please Try Again.",
        });
      }
    } else {
      navigate("/signin");
    }
  };

  const increaseQuantity = () => {
    if (quantity < product.countInStock) {
      setQuantity(quantity + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

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
    <div className="min-h-screen bg-white">

      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-4">
              <li>
                <Link to="/" className="text-gray-400 hover:text-gray-500 transition-colors duration-200">
                  Home
                </Link>
              </li>
              <li>
                <svg className="flex-shrink-0 h-5 w-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </li>
              <li>
                <Link to="/" className="text-gray-400 hover:text-gray-500 transition-colors duration-200">
                  {product.category}
                </Link>
              </li>
              <li>
                <svg className="flex-shrink-0 h-5 w-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </li>
              <li>
                <span className="text-gray-600 font-medium">{product.name}</span>
              </li>
            </ol>
          </nav>
        </div>
      </div>


      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          <div className="space-y-4">

            <div className="bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={product.images[selectedImage].url}
                alt={product.name}
                className="w-full h-96 object-cover"
              />
            </div>

            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((image, index) => (
                  <button
                    key={image.public_id}
                    onClick={() => setSelectedImage(index)}
                    className={`bg-gray-100 rounded-lg overflow-hidden border-2 ${selectedImage === index ? 'border-blue-500' : 'border-transparent'
                      } transition-all duration-200 hover:border-blue-300`}
                  >
                    <img
                      src={image.url}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-20 object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">

            <div className="space-y-2">
              <span className="inline-block bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                {product.category}
              </span>
            </div>

            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>

            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className={`w-5 h-5 ${star <= product?.totalRating ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="ml-2 text-sm text-gray-600">
                  {product?.totalRating?.toFixed(1)} ({product.reviews.length} reviews)
                </span>
              </div>
            </div>

            <div className="flex items-baseline space-x-4">
              <span className="text-3xl font-bold text-gray-900">₹{product.price}</span>
            </div>

            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full mr-2 ${product.countInStock > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className={`text-sm font-medium ${product.countInStock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {product.countInStock > 0 ? `${product.countInStock} in stock` : 'Out of stock'}
              </span>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">Size</label>
              <div className="flex flex-wrap gap-3">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 border-2 rounded-lg text-sm font-medium transition-all duration-200 ${selectedSize === size
                      ? 'border-gray-900 bg-gray-900 text-white'
                      : 'border-gray-300 text-gray-700 hover:border-gray-400'
                      }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {
                existedInCart ? (
                  <div></div>
                ) : (
                  <div className="flex items-center space-x-4">
                    <label className="text-sm font-medium text-gray-700">Quantity:</label>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={decreaseQuantity}
                        disabled={quantity <= 1}
                        className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                        </svg>
                      </button>
                      <span className="w-12 text-center font-semibold text-gray-900 text-lg">{quantity}</span>
                      <button
                        onClick={increaseQuantity}
                        disabled={quantity >= product.countInStock}
                        className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )
              }

              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                {
                  existedInCart ? (
                    <div className="flex-1 flex items-center justify-between bg-gray-900 text-white py-3 px-6 rounded-lg font-semibold text-lg transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">

                      <button
                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-800 disabled:hover:bg-transparent disabled:opacity-50 transition-colors duration-200"
                        onClick={() => handleDecrement(product._id)}
                        disabled={existedInCart.quantity <= 1}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                        </svg>
                      </button>

                      <span className="text-lg font-semibold mx-4 min-w-8 text-center">{existedInCart.quantity}</span>

                      <button
                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-800 disabled:hover:bg-transparent disabled:opacity-50 transition-colors duration-200"
                        onClick={() => handleIncrement(product._id)}
                        disabled={existedInCart.quantity >= product.countInStock}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleAddToCart(product._id)}
                      disabled={product.countInStock === 0 || !selectedSize}
                      className="flex-1 bg-gray-900 hover:bg-black text-white py-3 px-6 rounded-lg font-semibold text-lg transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <span>Add to Cart</span>
                    </button>
                  )
                }
                {existedInWishlist ? (

                  < button
                    onClick={() => handleRemoveFromWishlist(product._id)}
                    className="px-6 py-3 border-2 border-red-500 bg-red-500 text-white rounded-lg hover:bg-red-600 hover:border-red-600 transition-all duration-200 font-semibold flex items-center justify-center space-x-2"
                  >
                    <svg className="w-5 h-5" fill="white" stroke="white" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <span>In Wishlist</span>
                  </button>
                ) : (

                  <button
                    onClick={() => handleAddToWishlist(product._id)}
                    className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 font-semibold flex items-center justify-center space-x-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <span>Wishlist</span>
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>

        <div className="mt-16">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'description', name: 'Description' },
                { id: 'reviews', name: `Reviews (${product.reviews.length})` },
                { id: 'shipping', name: 'Shipping & Returns' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${activeTab === tab.id
                    ? 'border-gray-900 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                >
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          <div className="py-8">
            {activeTab === 'description' && (
              <div className="prose max-w-none">
                <p className="text-gray-600 leading-relaxed">{product.description}</p>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-6">
                {product.reviews.length > 0 ? (
                  product.reviews.map((review) => (
                    <div key={review._id} className="border-b border-gray-200 pb-6 last:border-b-0">
                      <div className="flex items-center space-x-4 mb-3">
                        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                          <span className="text-gray-600 font-semibold">
                            {review.username.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{review.username}</h4>
                          <div className="flex items-center space-x-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <svg
                                key={star}
                                className={`w-4 h-4 ${star <= review.rating ? 'text-yellow-400' : 'text-gray-300'
                                  }`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                            <span className="text-sm text-gray-500 ml-2">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-600">{review.comment}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-8">No reviews yet.</p>
                )}
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className="space-y-4 text-gray-600">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Shipping Information</h4>
                  <p>Free standard shipping on orders over $100. Express shipping available for an additional fee.</p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Standard Shipping: 3-5 business days</li>
                    <li>Express Shipping: 1-2 business days</li>
                    <li>International Shipping: 7-14 business days</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Return Policy</h4>
                  <p>We offer a 30-day return policy for all unworn items with original tags attached.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div >
    </div >
  );
};

export default ProductDetailsPage;