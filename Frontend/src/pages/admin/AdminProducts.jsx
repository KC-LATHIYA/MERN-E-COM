import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDeleteProductMutation, useGetAllProductQuery } from '../../utils/productAPI';
import Swal from 'sweetalert2';

const AdminProducts = () => {
    const navigate = useNavigate();

    const [DeleteProduct] = useDeleteProductMutation();

    const { data, isLoading } = useGetAllProductQuery();
    const products = data?.data || [];

    const deleteProduct = async (productId) => {
        try {
            const res = await DeleteProduct(productId).unwrap();
            Swal.fire({
                icon: "success",
                title: "Product Deleted",
                text: res.message || "Product Deleted Successfully!",
            });
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: error?.data?.message || "Failed Delete Product. Please Try Again.",
            });
        }
    };

    if (isLoading) {
        return (
            <h1>Loading...</h1>
        )
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Product Management</h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Manage your product catalog efficiently
                </p>
            </div>

            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900">All Products</h3>
                <button
                    onClick={() => navigate('/admin/create-product')}
                    className="bg-gray-900 hover:bg-black text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:shadow-lg"
                >
                    Add New Product
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                    <div key={product._id} className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 overflow-hidden group">
                        <div className="relative overflow-hidden bg-gray-100">
                            <img
                                src={product.images[0].url}
                                alt={product.name}
                                className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute top-3 right-3">
                                <span className={`text-xs font-bold px-2.5 py-1.5 rounded-full ${product.countInStock > 0
                                    ? 'bg-green-500 text-white'
                                    : 'bg-red-500 text-white'
                                    }`}>
                                    {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
                                </span>
                            </div>
                        </div>

                        <div className="p-4">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                                {product.name}
                            </h3>

                            <div className="space-y-2 text-sm text-gray-600 mb-4">
                                <p><strong>Category:</strong> {product.category}</p>
                                <p><strong>Price:</strong> ₹{product.price}</p>
                                <p><strong>Stock:</strong> {product.countInStock}</p>
                                <div className="flex items-center">
                                    <span className="text-xs text-gray-500 mr-2">Sizes:</span>
                                    <div className="flex space-x-1">
                                        {product.sizes.map((size, index) => (
                                            <span key={index} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                                                {size.toUpperCase()}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="flex space-x-2">
                                <button
                                    onClick={() => navigate(`/admin/edit-product/${product._id}`)}
                                    className="flex-1 bg-gray-900 hover:bg-black text-white py-2 px-3 rounded-lg font-semibold text-sm transition-all duration-200 hover:shadow-md"
                                >
                                    ✏️ Edit
                                </button>
                                <button
                                    onClick={() => deleteProduct(product._id)}
                                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded-lg font-semibold text-sm transition-all duration-200 hover:shadow-md"
                                >
                                    🗑️ Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminProducts;