// src/components/FrontPage.jsx
import React from 'react';
import ItemList from './ItemList';

const FrontPage = ({ items, onAddToCart, onViewDetails }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center mb-10">
        <h1 className="mt-4 text-4xl font-bold text-gray-900 dark:text-white">Welcome to Webshop</h1>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">Your one-stop shop for all your needs</p>
      </div>
      <ItemList items={items} onAddToCart={onAddToCart} onViewDetails={onViewDetails} />
    </div>
  );
};

export default FrontPage;