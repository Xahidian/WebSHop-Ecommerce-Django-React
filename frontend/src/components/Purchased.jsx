// src/components/Purchased.jsx
import React from 'react';

// src/components/Purchased.jsx


const Purchased = ({ items }) => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Purchased Items</h1>
      {items.length === 0 ? (
        <p className="text-center text-gray-700">You have not purchased anything yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((item, index) => (
            <div
              key={`${item.id}-${index}`} // ✅ unique key for repeated items
              className="max-w-sm rounded overflow-hidden shadow-lg bg-white hover:shadow-xl transition-shadow duration-300 ease-in-out"
            >
              <img
                className="w-full h-48 object-cover"
                src={item.image || '/image/Product1.jpg'}
                alt="Product"
              />
              <div className="px-6 py-4">
                <div className="font-bold text-xl mb-2 text-gray-900">{item.title}</div>
                <p className="text-gray-700 text-base mb-2">{item.description}</p>
                <p className="text-gray-700 text-sm mb-2">Quantity Purchased: <strong>{item.quantity}</strong></p>
                <p className="text-gray-900 font-bold text-lg">
                  Total Paid: ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Purchased;
