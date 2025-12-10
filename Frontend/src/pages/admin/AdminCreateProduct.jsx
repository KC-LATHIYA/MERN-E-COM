import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateProductMutation } from '../../utils/productAPI';
import Swal from 'sweetalert2';

const AdminCreateProduct = () => {

    const [CreateProduct, { isLoading }] = useCreateProductMutation();

    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: '',
        price: '',
        countInStock: '',
        sizes: []
    });
    const [images, setImages] = useState([]);
    const [previewUrls, setPreviewUrls] = useState([]);


    const categories = ['Men', 'Women', 'Kids'];
    const sizeOptions = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSizeChange = (size) => {
        setFormData(prev => ({
            ...prev,
            sizes: prev.sizes.includes(size)
                ? prev.sizes.filter(s => s !== size)
                : [...prev.sizes, size]
        }));
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);

        const totalImges = images.length + files.length

        if (totalImges > 5) {
            alert("you can upload maximum 5 images only");
            return
        }

        setImages(prev => [...prev, ...files]);
        const urls = files.map(file => URL.createObjectURL(file));
        setPreviewUrls(prev => [...prev, ...urls]);
    }

    const handleRemoveImage = (index) => {
        const newImges = images.filter((_, i) => i !== index);
        const newpreview = previewUrls.filter((_, i) => i !== index);

        setImages(newImges);
        setPreviewUrls(newpreview);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            let data = new FormData();

            data.append("name", formData.name);
            data.append("description", formData.description);
            data.append("category", formData.category);
            data.append("price", formData.price);
            data.append("countInStock", formData.countInStock);

            formData.sizes.forEach(size => {
                data.append("sizes", size);
            })

            images.forEach(image => {
                data.append("images", image)
            });

            const res = await CreateProduct(data).unwrap();

            Swal.fire({
                icon: "success",
                title: "Product Created",
                text: res.message || "Product Created Successfully!",
            });

            navigate("/admin/products");

        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: error?.data?.message || "Failed Create Product. Please Try Again.",
            });
        }

    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between mb-8">
                <div className="text-center flex-1">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Product</h1>
                </div>
                <button
                    onClick={() => navigate('/admin/products')}
                    className="bg-gray-900 hover:bg-black text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:shadow-lg"
                >
                    Back to Products
                </button>
            </div>

            <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows="3"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        required
                    >
                        <option value="">Select Category</option>
                        {categories.map(category => (
                            <option key={category} value={category.toLocaleLowerCase()}>{category}</option>
                        ))}
                    </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Stock</label>
                        <input
                            type="number"
                            name="countInStock"
                            value={formData.countInStock}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sizes</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {sizeOptions.map(size => (
                            <label key={size.toLocaleLowerCase()} className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={formData.sizes.includes(size.toLocaleLowerCase())}
                                    onChange={() => handleSizeChange(size.toLocaleLowerCase())}
                                    className="mr-2"
                                />
                                {size}
                            </label>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Images (Max 5)</label>
                    <input
                        type="file"
                        multiple
                        onChange={handleImageChange}
                        accept="image/*"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                </div>

                {previewUrls.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                        {previewUrls.map((url, index) => (
                            <div key={index} className="relative">
                                <img
                                    src={url}
                                    alt={`Preview ${index + 1}`}
                                    className="w-full h-32 object-cover rounded-lg border"
                                />
                                <button
                                    type="button"
                                    onClick={() => handleRemoveImage(index)}
                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 text-xs"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-200 hover:shadow-lg ${isLoading ? "bg-gray-600 text-white cursor-not-allowed" : "bg-gray-900 hover:bg-black text-white"}`}
                >
                    {isLoading ? "Creating..." : "Create Product"}
                </button>
            </form>
        </div>
    );
};

export default AdminCreateProduct;