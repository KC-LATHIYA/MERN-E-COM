import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetOrderDetailsByIdAdminQuery } from '../../utils/orderAPI';

const AdminOrderDetails = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();

    const { data, isLoading } = useGetOrderDetailsByIdAdminQuery(orderId);
    const order = data?.data

    if (isLoading) {
        return <h1 className="text-center mt-10 text-lg font-semibold">Loading...</h1>;
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between mb-8">
                <div className="text-center flex-1">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Details</h1>
                    <p className="text-gray-600">Order #{order._id}</p>
                </div>
                <button
                    onClick={() => navigate('/admin/orders')}
                    className="bg-gray-900 hover:bg-black text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:shadow-lg"
                >
                    Back to Orders
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Items</h2>
                        <div className="space-y-4">
                            {order.orderItems.map((item) => (
                                <div key={item._id} className="flex items-center space-x-4 border-b border-gray-100 pb-4 last:border-b-0">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-16 h-16 object-cover rounded-lg"
                                    />
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-900">{item.name}</h3>
                                        <p className="text-gray-600 text-sm">
                                            Size: {item.size}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-gray-900">₹{item.price}</p>
                                        <p className="text-gray-500 text-sm">Qty: {item.quantity}</p>
                                        <p className="font-bold text-gray-900">₹{(item.price * item.quantity).toFixed(2)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Shipping Address</h2>
                        <div className="text-gray-600 space-y-2">
                            <p className="font-semibold text-gray-900">{order.user.firstname}</p>
                            <p>{order.shippingAddress.street}</p>
                            <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                            <p>{order.shippingAddress.country}</p>
                            <p className="mt-3 text-sm bg-gray-100 px-3 py-2 rounded-lg">+91 {order.user.mobileno}</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Status:</span>
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${order.isPaid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                    }`}>
                                    {order.isPaid ? 'Paid' : 'Unpaid'}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Delivery:</span>
                                {
                                    order.paymentMethod === "Razorpay" && order.isPaid === false ? (
                                        <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-700">
                                            ❌ Canceled
                                        </span>
                                    ) : (
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${order.isDelivered ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {order.isDelivered ? 'Delivered' : 'Processing'}
                                        </span>
                                    )
                                }
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Payment Method:</span>
                                <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs font-medium capitalize">
                                    {order.paymentMethod}
                                </span>
                            </div>
                            <div className="border-t border-gray-200 pt-3">
                                <div className="flex justify-between text-lg font-bold text-gray-900">
                                    <span>Total:</span>
                                    <span>₹{order.totalPrice}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Customer Info</h2>
                        <div className="space-y-3 text-gray-600">
                            <div>
                                <p className="font-semibold text-gray-900">Name</p>
                                <p>{order.user.firstname}</p>
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900">Email</p>
                                <p>{order.user.email}</p>
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900">Phone</p>
                                <p>+91 {order.user.mobileno}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default AdminOrderDetails;