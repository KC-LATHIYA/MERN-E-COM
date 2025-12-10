import React, { useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

const PaymentStatusPage = () => {
    const navigate = useNavigate();
    const [params] = useSearchParams();
    const status = params.get("status");
    const orderid = params.get("orderid");

    const isSuccess = status === 'success';

    useEffect(() => {
        if (isSuccess) {
            setTimeout(() => {
                navigate(`/order/confirmation?orderId=${orderid}`);
            }, 2000);
        }
    }, [])

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="max-w-sm w-full mx-4 text-center">

                <div className="text-6xl mb-4">
                    {isSuccess ? '✅' : '❌'}
                </div>

                <h1 className={`text-2xl font-bold mb-3 ${isSuccess ? 'text-green-600' : 'text-red-600'}`}>
                    {isSuccess ? 'Payment Successful' : 'Payment Failed'}
                </h1>

                <p className="text-gray-600 mb-6">
                    {isSuccess ? 'Your payment was processed successfully.' : 'We could not process your payment. Please try again.'}
                </p>

                {
                    isSuccess ? (
                        <div></div>
                    ) : (
                        <button
                            onClick={() => navigate('/checkout')}
                            className="w-full py-3 px-4 rounded-lg font-semibold text-white bg-red-600 hover:bg-red-700"
                        >
                            Try Again
                        </button>
                    )
                }

            </div>
        </div >
    );
};

export default PaymentStatusPage;