import React, { useMemo, useState } from 'react';
import { useGetAllProductQuery } from '../utils/productAPI';
import { useNavigate } from 'react-router-dom';
import SizeSelectionPopup from '../components/SizeSelectionPopup';
import { useAddItemIncartMutation, useGetUserCartQuery, useUpdateQuantityOfItemMutation } from '../utils/cartAPI';
import { useGetUserWishlistQuery, useAddItemToWishlistMutation, useRemoveItemFromWishlistMutation } from '../utils/wishlistAPI';
import Swal from "sweetalert2";
import { useSelector } from 'react-redux';

const HomePage = () => {

    const user = useSelector((state) => state.authSlice.user);
    const { data, isLoading } = useGetAllProductQuery();
    const featuredProducts = data?.data || [];

    const [selectedCategory, setSelectedCategory] = useState('all');

    const shuffleArray = (array) => {
        let products = [...array]
        for (let i = products.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [products[i], products[j]] = [products[j], products[i]]
        }
        return products
    }

    const rendomProducts = useMemo(() => shuffleArray(featuredProducts), [featuredProducts])

    const categories = [
        { id: 'all', name: 'All Products' },
        { id: 'men', name: 'Men' },
        { id: 'women', name: 'Women' },
        { id: 'kids', name: 'Kids' },
    ];

    const filteredProducts = selectedCategory === 'all'
        ? rendomProducts
        : rendomProducts.filter(product =>
            product.category.toLowerCase() === selectedCategory
        );

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
    const [showSizeCart, setShowSizeCart] = useState(false)
    const [cartItemSelected, setCartItemSelected] = useState(null)
    const navigate = useNavigate();

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
        <div className="min-h-screen bg-white">
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

            <section className="relative bg-gray-900 text-white">
                <div className="absolute inset-0 bg-black/50 z-10"></div>
                <img
                    src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
                    alt="Fashion Collection"
                    className="w-full h-[600px] object-cover"
                />
                <div className="absolute inset-0 z-20 flex items-center">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h1 className="text-4xl sm:text-6xl font-bold mb-6 leading-tight">
                            Summer Fashion
                            <span className="block text-blue-400">Collection 2024</span>
                        </h1>
                        <p className="text-xl sm:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
                            Discover the latest trends in fashion with our exclusive collection
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 hover:shadow-lg">
                                Shop Now
                            </button>
                            <button className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-gray-900 px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300">
                                View Collection
                            </button>
                        </div>
                    </div>
                </div>
            </section>


            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center p-6">
                            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">Free Shipping</h3>
                            <p className="text-gray-600">Free shipping on all orders over ₹1000</p>
                        </div>

                        <div className="text-center p-6">
                            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">Quality Guarantee</h3>
                            <p className="text-gray-600">30-day money back guarantee</p>
                        </div>

                        <div className="text-center p-6">
                            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">24/7 Support</h3>
                            <p className="text-gray-600">Round-the-clock customer support</p>
                        </div>
                    </div>
                </div>
            </section>


            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    <div className="text-center mb-12">
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Featured Products</h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Discover our handpicked selection of trending fashion items
                        </p>
                    </div>

                    <div className="flex flex-wrap justify-center gap-4 mb-8">
                        {categories.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => setSelectedCategory(category.id)}
                                className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${selectedCategory === category.id
                                    ? 'bg-gray-900 text-white shadow-lg'
                                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                                    }`}
                            >
                                {category.name}
                            </button>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
                        {filteredProducts.slice(0, 4).map((product) => {
                            const inWishlist = isInWishlist(product._id);
                            const inCart = isInCart(product._id);
                            return (<div
                                key={product._id}
                                className="w-full bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 font-sans overflow-hidden group"
                            >

                                <div className="relative overflow-hidden bg-gray-100">
                                    <img
                                        src={product.images[0].url}
                                        alt={product.name}
                                        className="w-full h-64 sm:h-72 object-cover group-hover:scale-110 transition-transform duration-500"
                                    />

                                    <div className="absolute top-4 left-4">
                                        <span className="bg-white/95 text-gray-700 text-xs font-semibold px-3 py-1.5 rounded-full backdrop-blur-sm uppercase tracking-wide">
                                            {product.category}
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

                                    {product.countInStock < 0 && (
                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                            <span className="bg-white text-gray-900 font-semibold px-4 py-2 rounded-lg">Out of Stock</span>
                                        </div>
                                    )}
                                </div>

                                <div className="p-4 sm:p-6">

                                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 leading-tight group-hover:text-gray-700 transition-colors">
                                        {product.name}
                                    </h3>

                                    <div className="flex items-center mb-4">
                                        <div className={`w-2 h-2 rounded-full mr-2 ${product.countInStock > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                        <span className={`text-sm font-medium ${product.countInStock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
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
                            </div>)
                        })}
                    </div>

                    <div className="text-center mt-12">
                        <button onClick={() => navigate("/shop")} className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 hover:shadow-md">
                            View All Products
                        </button>
                    </div>
                </div>
            </section>

            <section className="py-16 bg-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Stay Updated</h2>
                    <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                        Subscribe to our newsletter and be the first to know about new collections and exclusive offers.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-300"
                        />
                        <button className="bg-gray-900 hover:bg-black text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:shadow-lg">
                            Subscribe
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;