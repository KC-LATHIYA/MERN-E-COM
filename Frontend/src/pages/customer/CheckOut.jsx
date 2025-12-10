import React, { useState,useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useGetUserCartQuery } from '../../utils/cartAPI';
import { useCreateOrderMutation, useVerifyPaymentMutation } from '../../utils/orderAPI';

const CheckoutPage = () => {
    const navigate = useNavigate();
    const [selectedAddress, setSelectedAddress] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('');
    const user = useSelector((state) => state.authSlice.user);

    const [CreateOrder] = useCreateOrderMutation();
    const [VerifyPayment] = useVerifyPaymentMutation();

    const { data, refetch } = useGetUserCartQuery();
    const cartItems = data?.data?.items || [];
    const OrderSummary = data?.data;

    const total = OrderSummary?.totalPrice

    const handleAddressSelect = () => {
        setSelectedAddress(user?.address);
    };

    const handlePlaceOrder = async () => {
        try {
            const res = await CreateOrder({ shippingAddress: selectedAddress, paymentMethod: paymentMethod }).unwrap();

            if (paymentMethod === "COD") {
                navigate(`/payment?status=success&orderid=${res.data._id}`);
                return;
            }

            if (paymentMethod === "Razorpay") {
                const { razorpayOrder, orderId, key } = res.data
                openRazorpay(razorpayOrder, orderId, key);
            }

        } catch (error) {
            console.log(error);
        }
    };

    const openRazorpay = (razorpayOrder, orderId, key) => {
        const option = {
            key,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
            name: "CLOSET & CO",
            description: "Online Payment",
            order_id: razorpayOrder.id,
            handler: async (response) => {
                try {
                    await VerifyPayment({
                        orderId: orderId,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_signature: response.razorpay_signature,
                    });
                    navigate(`/payment?status=success&orderid=${orderId}`);
                } catch (error) {
                    navigate(`/payment?status=fail&orderid=${orderId}`)
                }
            },
            modal: {
                ondismiss: () => {
                    navigate(`/payment?status=fail&orderid=${orderId}`)
                }
            },
            theme: { color: "#3399cc" },
        }
        const rez = new window.Razorpay(option);
        rez.open();
    }

    useEffect(() => {
        refetch();
    }, [handlePlaceOrder])


    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    <div className="space-y-6">

                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-semibold text-gray-900">Shipping Address</h2>
                                <button
                                    onClick={() => navigate("/profile")}
                                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                                >
                                    + Add / Edit
                                </button>
                            </div>

                            {user?.address ? (
                                <label className="flex items-start p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-200">
                                    <input
                                        type="radio"
                                        name="address"
                                        checked={selectedAddress === user?.address}
                                        onChange={handleAddressSelect}
                                        className="mt-1 text-blue-600 focus:ring-blue-500"
                                    />
                                    <div className="ml-3 flex-1">
                                        <p className="font-medium text-gray-900">{user?.name}</p>
                                        <p className="text-gray-600 text-sm">{user?.address?.street}</p>
                                        <p className="text-gray-600 text-sm">
                                            {user?.address?.city}, {user?.address?.state} {user?.address?.zipCode}
                                        </p>
                                        <p className="text-gray-600 text-sm">{user?.mobileno}</p>
                                    </div>
                                </label>
                            ) : (
                                <p className="text-gray-500 text-sm">No address found. Please add one in your profile.</p>
                            )}
                        </div>

                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Method</h2>

                            <div className="space-y-3">
                                <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${paymentMethod === 'online' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="Razorpay"
                                        checked={paymentMethod === 'Razorpay'}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className="text-blue-600 focus:ring-blue-500"
                                    />
                                    <div className="ml-3 flex items-center justify-between w-full">
                                        <div>
                                            <span className="font-medium text-gray-900">Online Payment</span>
                                            <p className="text-sm text-gray-600">PayPal, GPay, etc.</p>
                                        </div>
                                    </div>
                                </label>

                                <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${paymentMethod === 'cod' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="COD"
                                        checked={paymentMethod === 'COD'}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className="text-blue-600 focus:ring-blue-500"
                                    />
                                    <div className="ml-3">
                                        <span className="font-medium text-gray-900">Cash on Delivery</span>
                                        <p className="text-sm text-gray-600">Pay when you receive the order</p>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">

                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">Order Items</h3>
                            <div className="space-y-4">
                                {cartItems.map((item) => (
                                    <div key={item.product._id} className="flex items-center space-x-4 py-3 border-b border-gray-100 last:border-b-0">
                                        <img
                                            src={item.product.images[0].url}
                                            alt={item.product.name}
                                            className="w-14 h-14 object-cover rounded-lg"
                                        />
                                        <div className="flex-1">
                                            <h4 className="font-medium text-gray-900 text-sm">{item.product.name}</h4>
                                            <div className="flex items-center space-x-3 text-xs text-gray-600 mt-1">
                                                <span>Size: {item.size}</span>
                                                <span>Qty: {item.quantity}</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold text-gray-900 text-sm">
                                                ₹{item.price}
                                            </p>
                                            <p className="text-xs text-gray-500"> ₹{item.product.price} each</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-8">
                            <h3 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h3>

                            {selectedAddress && (
                                <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                                    <h4 className="font-medium text-gray-900 text-sm mb-1">Shipping to:</h4>
                                    <div className="text-xs text-gray-600">
                                        <p className="font-medium">{user?.firstname}</p>
                                        <p>{selectedAddress?.street}</p>
                                        <p>{selectedAddress?.city}, {selectedAddress?.state}</p>
                                    </div>
                                </div>
                            )}

                            <div className="flex justify-between text-lg font-semibold text-gray-900 border-t border-gray-200 pt-3">
                                <span>Total</span>
                                <span>₹{total}</span>
                            </div>

                            <button
                                onClick={handlePlaceOrder}
                                disabled={!selectedAddress && !paymentMethod}
                                className={`w-full mt-6 py-3 px-6 rounded-lg font-semibold text-lg transition-all duration-200 ${selectedAddress && paymentMethod
                                    ? 'bg-green-600 hover:bg-green-700 text-white hover:shadow-lg transform hover:scale-105'
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    }`}
                            >
                                {selectedAddress ?
                                    `Place Order -  ₹${total.toFixed(2)}` :
                                    'Select Address to Continue'
                                }
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
