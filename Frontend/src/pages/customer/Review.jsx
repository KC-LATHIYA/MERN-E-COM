import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetProductByIdQuery, useReviewProductMutation } from '../../utils/productAPI';
import Swal from 'sweetalert2';

const ReviewPage = () => {
    const navigate = useNavigate();
    const { productId } = useParams();

    const { data, isLoading } = useGetProductByIdQuery(productId);
    const product = data?.data
    const [ReviewProduct] = useReviewProductMutation();

    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (rating === 0) {
                alert('Please select a rating');
                return;
            }

            if (!comment.trim()) {
                alert('Please write a review');
                return;
            }

            const res = await ReviewProduct({ id: productId, data: { rating: rating, comment: comment } }).unwrap();

            Swal.fire({
                icon: "success",
                title: "Review Added",
                text: res.message || "Review added successfully!",
            });
            navigate(-1);
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: error?.data?.message || "Failed Add Review. Please Try Again.",
            });
        }
    };

    if (isLoading) {
        return (
            <h1>Loading...</h1>
        )
    }

    return (
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

            <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Write a Review</h1>
                <p className="text-gray-600">Share your thoughts about this product</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
                <div className="flex items-center space-x-4">
                    <img
                        src={product.images[0].url}
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded"
                    />
                    <div>
                        <h2 className="font-semibold text-gray-900">{product.name}</h2>
                        <p className="text-gray-900">${product.price}</p>
                    </div>
                </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
                <form onSubmit={handleSubmit} className="space-y-6">

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Rating *
                        </label>
                        <div className="flex space-x-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    className={`text-2xl ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                >
                                    ★
                                </button>
                            ))}
                        </div>
                        {rating > 0 && (
                            <p className="text-sm text-gray-600 mt-2">
                                {rating} star{rating > 1 ? 's' : ''} selected
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Review *
                        </label>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            rows="4"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="What did you like or dislike about this product?"
                            required
                        />
                    </div>

                    <div className="flex space-x-3">
                        <button
                            type="submit"
                            className="flex-1 bg-gray-900 text-white py-3 px-4 rounded-lg font-medium hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={rating === 0 || !comment.trim()}
                        >
                            Submit Review
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ReviewPage;