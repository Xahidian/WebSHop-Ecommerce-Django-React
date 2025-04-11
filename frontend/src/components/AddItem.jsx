import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const AddItem = ({ onItemAdded }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!title || !description || !price) {
      alert('Please fill in all required fields.');
      return;
    }
  
    const token = localStorage.getItem('access_token');
    console.log("🚀 JWT Token being sent:", token);
    
    if (!token) {
      alert('You must be logged in to add an item.');
      return;
    }
  
    try {
      // If you don't want to send image as part of FormData, leave as JSON.
      // Otherwise, change to FormData (see below if needed).
      const response = await fetch(`${API_BASE_URL}/api/items/add/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          description,
          price,
          // If your backend accepts an image, you'll need to switch to FormData
        }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.error || 'Failed to add item');
      }
  
      alert('Item added successfully!');
      
      // Call the callback with the new item data
      if (onItemAdded) onItemAdded(data);
      
      // Navigate to /items
      navigate('/items');
    } catch (err) {
      console.error(err);
      alert('An error occurred: ' + err.message);
    }
  };
  
  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Add New Item</h1>
      <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Title *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Item Title"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Description *</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Item Description"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Price ($) *</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Item Price"
            required
            min="1"
            step="0.10"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Image (Optional)</label>
          <input
            type="file"
            onChange={handleImageChange}
            className="w-full p-2 border border-gray-300 rounded"
            accept="image/*"
          />
        </div>
        <div className="flex justify-between">
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Add Item
          </button>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddItem;
