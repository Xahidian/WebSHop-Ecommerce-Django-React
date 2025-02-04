// src/components/Purchased.jsx
import React from 'react';

const Purchased = ({ items }) => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Purchased Items</h1>
      {items.length === 0 ? (
        <p className="text-center text-gray-700">You have no purchased items.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((item, index) => (
            <div key={index} className="max-w-sm rounded overflow-hidden shadow-lg bg-white hover:shadow-xl transition-shadow duration-300 ease-in-out">
              <img className="w-full h-48 object-cover" src={item.image} alt="Product" />
              <div className="px-6 py-4">
                <div className="font-bold text-xl mb-2 text-gray-900">{item.title}</div>
                <p className="text-gray-700 text-base mb-4">{item.description}</p>
                <span className="text-gray-900 font-bold text-lg">${item.price}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Purchased;
