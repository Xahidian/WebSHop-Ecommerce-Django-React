import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EditableItemCard from './EditableItemCard';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const MyItems = () => {
  const [inventory, setInventory] = useState({ on_sale: [], sold: [] });
  const [purchasedItems, setPurchasedItems] = useState([]);
  const [activeTab, setActiveTab] = useState('on_sale');
  const [notLoggedIn, setNotLoggedIn] = useState(false);
  const navigate = useNavigate();

  const fetchData = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      setNotLoggedIn(true);
      return;
    }

    try {
      const inventoryRes = await fetch(`${API_BASE_URL}/api/user-inventory/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const inventoryData = await inventoryRes.json();

      const purchaseRes = await fetch(`${API_BASE_URL}/api/user-purchases/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const purchaseData = await purchaseRes.json();

      setInventory(inventoryData);
      setPurchasedItems(purchaseData);
    } catch (err) {
      console.error("Error loading inventory or purchases:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (notLoggedIn) {
    return (
      <div className="container mx-auto p-4 text-center">
        <h1 className="text-3xl font-bold text-red-600 mb-4">🔒 Access Denied</h1>
        <p className="text-lg text-gray-700">
          You need to{' '}
          <span
            className="text-blue-600 font-semibold cursor-pointer"
            onClick={() => navigate('/login')}
          >
            log in
          </span>{' '}
          to view your items.
        </p>
      </div>
    );
  }

  const renderContent = () => {
    if (activeTab === 'on_sale') {
      return inventory.on_sale?.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {inventory.on_sale.map((item) => (
            <EditableItemCard
              key={item.id}
              item={item}
              API_BASE_URL={API_BASE_URL}
              refreshInventory={fetchData}
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No items on sale.</p>
      );
    }

    if (activeTab === 'sold') {
      return inventory.sold?.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
{inventory.sold.map((item) => (
  <div key={item.id} className="border rounded shadow bg-gray-100 overflow-hidden">
    <img
      src={item.image || '/image/Product1.jpg'}
      alt={item.title}
      className="w-full h-48 object-cover"
    />
    <div className="p-4">
      <h3 className="font-bold text-lg">{item.title}</h3>
      <p>{item.description}</p>
      <p>Price: ${item.price}</p>
      <p className="text-red-600 font-semibold">Sold Out</p>
    </div>
  </div>
))}

        </div>
      ) : (
        <p className="text-center text-gray-500">No sold items.</p>
      );
    }

    if (activeTab === 'purchased') {
      return purchasedItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
{purchasedItems.map((item, index) => (
  <div key={`${item.id}-${index}`} className="border rounded shadow bg-white overflow-hidden">
    <img
      src={item.image || '/image/Product1.jpg'}
      alt={item.title}
      className="w-full h-48 object-cover"
    />
    <div className="p-4">
      <h3 className="text-xl font-bold">{item.title}</h3>
      <p className="text-gray-700">{item.description}</p>
      <p>Quantity: <strong>{item.quantity}</strong></p>
      <p className="text-blue-600 font-semibold">
        Total: ${(item.price * item.quantity).toFixed(2)}
      </p>
    </div>
  </div>
))}

        </div>
      ) : (
        <p className="text-center text-gray-500">You haven't purchased anything yet.</p>
      );
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6">🧺 My Items</h1>

      {/* Tab Buttons */}
      <div className="flex justify-center space-x-4 mb-6">
        <button
          onClick={() => setActiveTab('on_sale')}
          className={`px-4 py-2 rounded font-medium ${
            activeTab === 'on_sale'
              ? 'bg-green-600 text-white'
              : 'bg-white border border-green-600 text-green-600'
          }`}
        >
          🛒 On Sale
        </button>
        <button
          onClick={() => setActiveTab('sold')}
          className={`px-4 py-2 rounded font-medium ${
            activeTab === 'sold'
              ? 'bg-red-600 text-white'
              : 'bg-white border border-red-600 text-red-600'
          }`}
        >
          ❌ Sold
        </button>
        <button
          onClick={() => setActiveTab('purchased')}
          className={`px-4 py-2 rounded font-medium ${
            activeTab === 'purchased'
              ? 'bg-blue-600 text-white'
              : 'bg-white border border-blue-600 text-blue-600'
          }`}
        >
          🎁 Purchased
        </button>
      </div>

      {renderContent()}
    </div>
  );
};

export default MyItems;
