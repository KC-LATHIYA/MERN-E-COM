import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetProductByIdQuery, useUpdateProductMutation } from '../../utils/productAPI';
import Swal from 'sweetalert2';

const AdminEditProduct = () => {
    const navigate = useNavigate();
    const { productId } = useParams();

    const [UpdateProduct, { isLoading: button }] = useUpdateProductMutation();
    const { data, isLoading } = useGetProductByIdQuery(productId);
    const product = data?.data;

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        category: "",
        price: "",
        countInStock: "",
        sizes: [],
        images: []
    });
    const [previewUrls, setPreviewUrls] = useState([]);
    const [deleteImages, setDeleteImages] = useState([]);

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {

            let data = new FormData();

            data.append("name", formData.name);
            data.append("category", formData.category);
            data.append("description", formData.description);
            data.append("price", formData.price);
            data.append("countInStock", formData.countInStock);

            deleteImages.map(image => {
                data.append("deleteImage", image)
            })

            formData.sizes.map(size => {
                data.append("sizes", size);
            });

            formData.images.map(img => {
                data.append("images", img);
            });

            const res = await UpdateProduct({ id: productId, data }).unwrap();

            Swal.fire({
                icon: "success",
                title: "Product Updated",
                text: res.message || "Product Updated Successfully!",
            });

            navigate("/admin/products");

        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: error?.data?.message || "Failed Update Product. Please Try Again.",
            });
        }
    };

    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name || "",
                description: product.description || "",
                category: product.category || "",
                price: product.price || "",
                countInStock: product.countInStock || "",
                sizes: product.sizes || [],
                images: product.images || []
            })
            setPreviewUrls(product.images.map(img => img.url))
        }
    }, [product]);

    const handleImageChange = (e) => {

        const files = Array.from(e.target.files);

        if (files.length + formData.images.length > 5) {
            alert("you can upload maximum 5 images only");
            return
        }

        const newImagePreview = files.map(file => URL.createObjectURL(file));

        setPreviewUrls(prev => [...prev, ...newImagePreview])
        setFormData(prev => ({
            ...prev,
            images: [...prev.images, ...files]
        }));

    }

    const handleRemoveImage = (index) => {

        const deleteImage = formData.images[index];

        if (deleteImage?.public_id) {
            setDeleteImages(prev => [...prev, deleteImage.public_id]);
        }

        setPreviewUrls(prev => prev.filter((_, i) => i !== index));
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));;
    }

    if (isLoading) {
        return (
            <h1>Loading...</h1>
        )
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between mb-8">
                <div className="text-center flex-1">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Product</h1>
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
                        {categories.map(category => (
                            <option key={category} value={category}>{category}</option>
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
                            <label key={size} className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={(formData.sizes || []).includes(size.toLocaleLowerCase())}
                                    onChange={() => handleSizeChange(size.toLocaleLowerCase())}
                                    className="mr-2"
                                />
                                {size}
                            </label>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Current Images</label>
                    <div className="flex space-x-2">
                        {previewUrls.length > 0 && (
                            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                                {previewUrls.map((img, index) => (
                                    <div key={index} className="relative">
                                        <img
                                            src={img.url || img}
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
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Update Images (Max 5)</label>
                    <input
                        type="file"
                        multiple
                        onChange={handleImageChange}
                        accept="image/*"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                </div>

                <button
                    type="submit"
                    disabled={button}
                    className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-200 hover:shadow-lg ${button ? "bg-gray-600 text-white cursor-not-allowed" : "bg-gray-900 hover:bg-black text-white"}`}
                >
                    {button ? "Updating..." : "Update Product"}
                </button>
            </form>
        </div>
    );
};

export default AdminEditProduct;