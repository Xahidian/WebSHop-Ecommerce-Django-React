// src/components/Modal.jsx
import React from 'react';

const Modal = ({ item, onClose }) => {
  if (!item) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">{item.title}</h2>
          <button onClick={onClose} className="text-gray-900 dark:text-white">&times;</button>
        </div>
        <img src={item.image} alt={item.title} className="w-full h-48 object-cover rounded-lg mb-4" />
        <p className="text-gray-600 dark:text-gray-400 mb-4">{item.description}</p>
        <p className="text-gray-900 dark:text-white font-bold">${item.price}</p>
      </div>
    </div>
  );
};

export default Modal;