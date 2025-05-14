// src/components/Purchased.jsx
import React, { useEffect, useState } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Purchased = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchPurchases = async () => {
      const token = localStorage.getItem('access_token');
      try {
        const res = await fetch(`${API_BASE_URL}/api/user-purchases/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error("Failed to fetch purchases");
        const data = await res.json();
        setItems(data);
      } catch (err) {
        console.error("Error loading purchases:", err);
      }
    };

    fetchPurchases();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold text-center mb-8">Purchase History</h1>
      {items.length === 0 ? (
        <p className="text-center text-gray-600">You have not purchased anything yet.</p>
      ) : (
        <div className="space-y-6">
          {items.map((item, index) => (
            <div
              key={`${item.id}-${index}`}
              className="flex flex-col md:flex-row items-center bg-white shadow-lg rounded-lg overflow-hidden"
            >
              <img
                src={item.image || '/image/Product1.jpg'}
                alt={item.title}
                className="w-full md:w-1/3 h-48 object-cover"
              />
              <div className="p-6 flex-1">
                <h2 className="text-2xl font-semibold mb-2">{item.title}</h2>
                <p className="text-gray-700 mb-2">{item.description}</p>
                <p className="text-gray-600 mb-2">
                  Quantity Purchased: <span className="font-semibold">{item.quantity}</span>
                </p>
                <p className="text-gray-800 font-bold text-xl">
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
