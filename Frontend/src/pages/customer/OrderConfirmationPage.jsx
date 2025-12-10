import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useGetOrderDetailsByIdQuery } from '../../utils/orderAPI';

const OrderConfirmationPage = () => {
    const navigate = useNavigate();
    const [params] = useSearchParams();
    const orderId = params.get("orderId");

    const { data, isLoading } = useGetOrderDetailsByIdQuery(orderId);
    const order = data?.data
    const items = data?.data?.orderItems || [];

    if (isLoading) {
        return (
            <h1>Loading...</h1>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8">
            <div className="max-w-md w-full mx-4">

                <div className="text-center mb-6">
                    <div className="text-4xl mb-3">✅</div>
                    <h1 className="text-2xl font-bold text-gray-900">Order Confirmed!</h1>
                    <p className="text-gray-600 mt-2">Thank you for your purchase</p>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Order ID:</span>
                            <span className="font-semibold">{order._id}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Tracking ID:</span>
                            <span className="font-semibold">{order.TrackingNumber}</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">Order Summary</h2>

                    <div className="space-y-3 mb-4">
                        {items.map((item) => (
                            <div key={item._id} className="flex justify-between items-center">
                                <div>
                                    <p className="font-medium text-gray-900">{item.name}</p>
                                    <p className="text-gray-500 text-sm">Qty: {item.quantity} × ₹{item.price}</p>
                                </div>
                                <p className="font-semibold text-gray-900">
                                    ₹{(item.price * item.quantity).toFixed(2)}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="space-y-2 border-t border-gray-200 pt-3">
                        <div className="flex justify-between text-lg font-bold text-gray-900 border-t border-gray-200 pt-2">
                            <span>Total</span>
                            <span>₹{order.totalPrice.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                <div className="mt-6 space-y-3">
                    <button
                        onClick={() => navigate('/myorders')}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors"
                    >
                        View My Orders
                    </button>
                    <button
                        onClick={() => navigate('/')}
                        className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                    >
                        Continue Shopping
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrderConfirmationPage;