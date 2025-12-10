import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetAllOrderQuery } from '../../utils/orderAPI';
import { useGetAllProductQuery } from '../../utils/productAPI';

const AdminDashboard = () => {
    const navigate = useNavigate();

    const { data, isLoading } = useGetAllOrderQuery();
    const orderData = data?.data || [];
    const { data: product, isLoading: pLoading } = useGetAllProductQuery();
    const productData = product?.data || [];

    const totalSales = orderData.reduce((acc, item) => acc + item.totalPrice, 0);

    const pendingDeliveries = orderData.reduce((acc, order) => {
        if (order.paymentMethod === "COD" && order.isDelivered === false) {
            return acc + 1
        } else if (order.paymentMethod === "Razorpay" && order.isPaid && order.isDelivered === false) {
            return acc + 1
        } else {
            return acc
        }
    }, 0)

    const stats = {
        totalOrders: orderData.length,
        totalSales: totalSales,
        totalProducts: productData.length,
        pendingDeliveries: pendingDeliveries
    };

    if (isLoading && pLoading) {
        return (
            <h1>Loading...</h1>
        )
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Admin Dashboard</h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Overview of your store performance and activities
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <div className="flex items-center">
                        <div className="p-3 bg-gray-100 rounded-lg">
                            <span className="text-2xl">📦</span>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Total Orders</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <div className="flex items-center">
                        <div className="p-3 bg-gray-100 rounded-lg">
                            <span className="text-2xl">💰</span>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Total Sales</p>
                            <p className="text-2xl font-bold text-gray-900">₹{stats.totalSales.toLocaleString()}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <div className="flex items-center">
                        <div className="p-3 bg-gray-100 rounded-lg">
                            <span className="text-2xl">🛍️</span>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Total Products</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <div className="flex items-center">
                        <div className="p-3 bg-gray-100 rounded-lg">
                            <span className="text-2xl">🚚</span>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Pending Deliveries</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.pendingDeliveries}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-3 gap-4">
                    <button
                        onClick={() => navigate('/admin/orders')}
                        className="bg-gray-900 hover:bg-black text-white py-3 px-4 rounded-xl font-semibold transition-all duration-200 hover:shadow-lg text-sm"
                    >
                        View All Orders
                    </button>
                    <button
                        onClick={() => navigate('/admin/create-product')}
                        className="bg-gray-900 hover:bg-black text-white py-3 px-4 rounded-xl font-semibold transition-all duration-200 hover:shadow-lg text-sm"
                    >
                        Add New Product
                    </button>
                    <button
                        onClick={() => navigate('/admin/products')}
                        className="bg-gray-900 hover:bg-black text-white py-3 px-4 rounded-xl font-semibold transition-all duration-200 hover:shadow-lg text-sm"
                    >
                        Manage Products
                    </button>
                </div>
            </div>

        </div>
    );
};

export default AdminDashboard;