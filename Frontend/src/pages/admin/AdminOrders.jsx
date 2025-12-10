import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetAllOrderQuery, useMarkedAsDeliverMutation, useMarkedAsPaidMutation } from '../../utils/orderAPI';
import Swal from 'sweetalert2';

const AdminOrders = () => {
    const navigate = useNavigate();

    const { data } = useGetAllOrderQuery();
    const orders = data?.data || [];

    const [MarkedAsDeliver] = useMarkedAsDeliverMutation();
    const [MarkedAsPaid] = useMarkedAsPaidMutation();

    const markAsPaid = async (orderId) => {
        try {
            const res = await MarkedAsPaid(orderId).unwrap();
            Swal.fire({
                icon: "success",
                title: "Marked As Paid",
                text: res.message || "Order Payment Status Updated Successfully!",
            });
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: error?.data?.message || "Failed To Update Payment Status. Please Try Again.",
            });
        }
    };

    const markAsDelivered = async (orderId) => {
        try {
            const res = await MarkedAsDeliver(orderId).unwrap();
            Swal.fire({
                icon: "success",
                title: "Marked As Delivered",
                text: res.message || "Order Delivered Status Updated Successfully!",
            });
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: error?.data?.message || "Failed To Update Delivered Status. Please Try Again.",
            });
        }
    };

    const viewOrderDetails = (orderId) => {
        navigate(`/admin/order-details/${orderId}`);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Order Management</h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Manage and track all customer orders efficiently
                </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Order ID
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    User
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Total
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Payment
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Paid
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Delivered
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {orders.map((order) => (
                                <tr key={order._id} className="hover:bg-gray-50 transition-colors duration-200">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        #{order._id}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        <div>
                                            <p className="font-semibold">{order.user.firstname}</p>
                                            <p className="text-gray-500 text-xs">{order.user.email}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                                        ₹{order.totalPrice}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                                        <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs font-medium">
                                            {order.paymentMethod}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${order.isPaid
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-red-100 text-red-700'
                                            }`}>
                                            {order.isPaid ? '✅ Paid' : '❌ Unpaid'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {
                                            order.paymentMethod === "Razorpay" && order.isPaid === false ? (
                                                <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-700">
                                                    ❌ Canceled
                                                </span>
                                            ) : (
                                                <span
                                                    className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${order.isDelivered
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-yellow-100 text-yellow-700"
                                                        }`}
                                                >
                                                    {order.isDelivered ? "🚚 Delivered" : "⏳ Pending"}
                                                </span>
                                            )
                                        }
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">

                                        {order.paymentMethod === "COD" && !order.isPaid && (
                                            <button
                                                onClick={() => markAsPaid(order._id)}
                                                className="bg-gray-900 hover:bg-black text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 hover:shadow-md"
                                            >
                                                Mark Paid
                                            </button>
                                        )}
                                        {order.isPaid && !order.isDelivered && (
                                            <button
                                                onClick={() => markAsDelivered(order._id)}
                                                className="bg-gray-900 hover:bg-black text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 hover:shadow-md"
                                            >
                                                Mark Delivered
                                            </button>
                                        )}

                                        <button
                                            onClick={() => viewOrderDetails(order._id)}
                                            className="bg-gray-900 hover:bg-black text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 hover:shadow-md"
                                        >
                                            View Details
                                        </button>

                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminOrders;