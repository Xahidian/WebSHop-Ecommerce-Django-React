import React, { useState, useEffect } from 'react';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const EditAccount = () => {
  const [tab, setTab] = useState('profile'); // 'profile' or 'inventory'
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [inventory, setInventory] = useState({ on_sale: [], sold: [] });

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!oldPassword || !newPassword || !confirmNewPassword) {
      setError('Please fill in all fields.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setError('New passwords do not match.');
      return;
    }

    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${API_BASE_URL}/api/change-password/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          old_password: oldPassword,
          new_password: newPassword
        })
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.error || 'Password update failed.');
        return;
      }

      setSuccess(data.message || 'Password updated!');
      setOldPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (err) {
      console.error(err);
      setError('An error occurred.');
    }
  };

  useEffect(() => {
    if (tab === 'inventory') {
      const fetchInventory = async () => {
        try {
          const token = localStorage.getItem('access_token');
          const res = await fetch(`${API_BASE_URL}/api/user-inventory/`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          const data = await res.json();
          setInventory(data);
        } catch (err) {
          console.error('Failed to fetch inventory:', err);
        }
      };
      fetchInventory();
    }
  }, [tab]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6">My Account</h1>

      {/* Tabs */}
      <div className="flex justify-center space-x-4 mb-8">
        <button
          onClick={() => setTab('profile')}
          className={`px-4 py-2 font-medium border rounded ${tab === 'profile' ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 border-blue-600'}`}
        >
          Edit Profile
        </button>
        <button
          onClick={() => setTab('inventory')}
          className={`px-4 py-2 font-medium border rounded ${tab === 'inventory' ? 'bg-green-600 text-white' : 'bg-white text-green-600 border-green-600'}`}
        >
          Inventory
        </button>
      </div>

      {/* Tab Content */}
      {tab === 'profile' && (
        <form onSubmit={handlePasswordSubmit} className="max-w-md mx-auto">
          {error && <div className="text-red-500 text-center mb-4">{error}</div>}
          {success && <div className="text-green-500 text-center mb-4">{success}</div>}

          <label className="block mb-2 font-medium">Old Password</label>
          <input type="password" className="w-full mb-4 p-2 border rounded" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />

          <label className="block mb-2 font-medium">New Password</label>
          <input type="password" className="w-full mb-4 p-2 border rounded" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />

          <label className="block mb-2 font-medium">Confirm New Password</label>
          <input type="password" className="w-full mb-4 p-2 border rounded" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} />

          <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">Update Password</button>
        </form>
      )}

      {tab === 'inventory' && (
        <div>
          {/* On Sale */}
          {inventory.on_sale?.length > 0 && (
            <div className="mt-6">
              <h2 className="text-2xl font-semibold text-green-700 text-center mb-4">🛍️ Items On Sale</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {inventory.on_sale.map(item => (
                  <div key={item.id} className="p-4 border rounded shadow bg-white">
                    <h3 className="font-bold text-lg">{item.title}</h3>
                    <p>{item.description}</p>
                    <p>Price: ${item.price}</p>
                    <p>Quantity: {item.quantity}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sold Items */}
          {inventory.sold?.length > 0 && (
            <div className="mt-10">
              <h2 className="text-2xl font-semibold text-red-700 text-center mb-4">❌ Sold Out Items</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {inventory.sold.map(item => (
                  <div key={item.id} className="p-4 border rounded shadow bg-gray-100">
                    <h3 className="font-bold text-lg">{item.title}</h3>
                    <p>{item.description}</p>
                    <p>Price: ${item.price}</p>
                    <p className="text-red-600 font-semibold">Sold Out</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EditAccount;
