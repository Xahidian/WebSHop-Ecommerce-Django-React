// src/components/Item.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Item = ({ id, image, title, description, price, dateAdded, onAddToCart, onViewDetails }) => {
  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg bg-white hover:shadow-xl transition-shadow duration-300 ease-in-out">
      <img className="w-full h-48 object-cover" src={image || '/image/Product1.jpg'} alt="Product" />
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2 text-gray-900">{title}</div>
        <p className="text-gray-700 text-base mb-4">{description}</p>
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-900 font-bold text-lg">${price}</span>
          <span className="text-gray-600 text-sm">
            {dateAdded ? new Date(dateAdded).toLocaleDateString() : 'No Date'}
          </span>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => onViewDetails({ id, image, title, description, price, dateAdded })}
            className="w-full text-center text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5"
          >
            View Details
          </button>
          <button
            onClick={onAddToCart}
            className="w-full text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};


export default Item;