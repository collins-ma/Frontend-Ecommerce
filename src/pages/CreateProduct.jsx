import { useState } from 'react';
import React from 'react';
import { useCreateProductMutation } from '../features/products/productsApiSlice';
import { useGetCategoriesQuery } from '../features/categories/categoriesApiSlice';
import useDocumentTitle from '../hooks/useDocumentTitle';
const CreateProduct = () => {
  useDocumentTitle('createProduct')
  const [createProduct] = useCreateProductMutation();
  const { data: categoriesData, isLoading: isCatLoading } = useGetCategoriesQuery();

  // Convert entity adapter object to array
  const categories = categoriesData ? categoriesData.ids.map((id) => categoriesData.entities[id]) : [];

  const [name, setName] = useState('');
  const [priceKsh, setPriceKsh] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Feedback state
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    if (!image) {
      setErrorMessage('Please select an image.');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('priceKsh', priceKsh); // ✅ KSH only
    formData.append('category', category);
    formData.append('image', image);

    try {
      setIsSubmitting(true);
      await createProduct(formData).unwrap();
      setSuccessMessage('Product created successfully!');
      // Reset form
      setName('');
      setPriceKsh('');
      setCategory('');
      setImage(null);
    } catch (err) {
      console.error(err);
      setErrorMessage(err?.data?.message || 'Failed to create product');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white dark:bg-gray-800 shadow-md rounded-xl">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">Create Product</h2>

      {/* Feedback Messages */}
      {successMessage && (
        <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-lg">{successMessage}</div>
      )}
      {errorMessage && (
        <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-lg">{errorMessage}</div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Product Name */}
        <label className="flex flex-col">
          <span className="mb-1 text-gray-700 dark:text-gray-200">Product Name</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
          />
        </label>

        {/* Price */}
        <label className="flex flex-col">
          <span className="mb-1 text-gray-700 dark:text-gray-200">Price (KSH)</span>
          <input
            type="number"
            min="0"
            value={priceKsh}
            onChange={(e) => setPriceKsh(e.target.value)}
            required
            className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
          />
        </label>

        {/* Category */}
        <label className="flex flex-col">
          <span className="mb-1 text-gray-700 dark:text-gray-200">Category</span>
          {isCatLoading ? (
            <p className="text-gray-500 dark:text-gray-400">Loading categories...</p>
          ) : (
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          )}
        </label>

        {/* Image */}
        <label className="flex flex-col">
          <span className="mb-1 text-gray-700 dark:text-gray-200">Product Image</span>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            required
            className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
          />
        </label>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`mt-4 py-2 px-4 rounded-lg font-medium text-white ${
            isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isSubmitting ? 'Creating...' : 'Create Product'}
        </button>
      </form>
    </div>
  );
};

export default CreateProduct;