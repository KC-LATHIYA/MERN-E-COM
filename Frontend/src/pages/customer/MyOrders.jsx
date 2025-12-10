import React, { useState } from "react";
import { useGetAllOrderDetaildQuery } from "../../utils/orderAPI";
import { useNavigate } from "react-router-dom";

const MyOrders = () => {
  const { data, isLoading } = useGetAllOrderDetaildQuery();
  const orders = data?.data || [];
  const navigate = useNavigate();

  if (isLoading) {
    return <h1 className="text-center mt-10 text-lg">Loading...</h1>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-5xl mx-auto px-4">

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">My Orders</h1>
          <p className="text-gray-600 text-sm">Track and manage your orders</p>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-lg border border-gray-200">
            <p className="text-gray-700 text-base">No orders found</p>
          </div>
        ) : (

          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden"
              >
                <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                  <div>
                    <p className="text-xs text-gray-500">Tracking Number</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {order.TrackingNumber}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">
                      ₹{order.totalPrice}
                    </p>
                    {
                      order.paymentMethod === "Razorpay" && order.isPaid === false ? (
                        <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium mt-1 bg-red-100 text-red-700">
                          ❌ Canceled
                        </span>
                      ) : (
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium mt-1 ${order.isDelivered
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                            }`}
                        >
                          {order.isDelivered ? "Delivered" : "Processing"}
                        </span>
                      )
                    }
                  </div>
                </div>

                <div className="flex flex-col px-4 py-3 space-y-3">
                  {order.orderItems.map((item, i) => (
                    <div
                      key={i}
                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-gray-100 last:border-0 pb-2"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-14 h-16 object-cover rounded-md border"
                        />
                        <div className="flex-1">
                          <h3 className="text-sm font-medium text-gray-900">{item.name}</h3>
                          <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                          <p className="text-sm text-gray-800 font-medium">₹{item.price}</p>
                        </div>
                      </div>

                      <div className="pt-1 sm:pt-0">
                        <button
                          className="px-3 py-1 text-xs bg-gray-900 text-white rounded-md hover:bg-black transition w-full sm:w-auto"
                          onClick={() => navigate(`/review/${item.productId}`)}
                        >
                          Review
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="px-4 py-2 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
                  <div className="text-xs text-gray-600">
                    <p>
                      Payment:{" "}
                      <span className="font-medium text-gray-800">
                        {order.paymentMethod}
                      </span>
                    </p>
                    <p>
                      Status:{" "}
                      {
                        order.paymentMethod === "Razorpay" && order.isPaid === false ? (
                          <span className="font-medium text-red-700">
                            Failed
                          </span>
                        ) : (
                          <span
                            className={`font-medium ${order.isPaid ? "text-green-600" : "text-red-600"
                              }`}
                          >
                            {order.isPaid ? "Paid" : "Pending"}
                          </span>
                        )
                      }
                    </p>
                  </div>
                  <button className="px-3 py-1 text-xs bg-gray-900 text-white rounded-md hover:bg-black transition"
                    onClick={() => navigate(`/order-details?orderId=${order._id}`)}>
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div >
  );
};

export default MyOrders;