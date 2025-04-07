import React, { useState, useEffect } from 'react';
import { fetchItems } from '../api'; // ✅ centralized API functions

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const PopulationDb = () => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [users, setUsers] = useState({ test_users: [], real_users: [] });

  const [showUsers, setShowUsers] = useState(false);
  const [showItems, setShowItems] = useState(false);
  const [dbCleared, setDbCleared] = useState(false);


  // Populate from API.js
  const loadItems = async () => {
    try {
      const data = await fetchItems();
      setItems(data);
    } catch (error) {
      console.error('Error loading items:', error);
    }
  };

  const fetchRawUsers = async () => {
    const res = await fetch(`${API_BASE_URL}/api/raw-users/`);
    const data = await res.json();
    setUsers(data); // now these users contain raw passwords
  };

  useEffect(() => {
    if (!dbCleared) {
      loadItems();
      fetchRawUsers();
    }
  }, [dbCleared]);
  

  const populateDb = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/populate-db/`);
      const data = await response.json();
      setMessage(data.message);
      await loadItems();
      await fetchRawUsers();
      setDbCleared(false); // ✅ allow loading again
    } catch (error) {
      console.error(error);
      setMessage('Error populating the database');
    } finally {
      setLoading(false);
    }
  };

  const clearDb = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/clear-db/`);
      const data = await response.json();
      setMessage(data.message);
  
      setItems([]);
      setUsers({ test_users: [], real_users: [] });
      setShowUsers(false);
      setShowItems(false);
      setDbCleared(true); // ✅ mark that DB was cleared
    } catch (error) {
      console.error(error);
      setMessage('Error clearing the database');
    }
  };
  
  

  return (
    <div className="population-container p-6">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Populate the Database</h2>

      <div className="mb-4">
        <button onClick={() => setShowUsers(!showUsers)} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
          {showUsers ? 'Hide Users' : 'Show Users'}
        </button>
        <button onClick={() => setShowItems(!showItems)} className="bg-orange-600 text-white px-6 py-2 ml-4 rounded-lg hover:bg-orange-700">
          {showItems ? 'Hide Items' : 'Show Items'}
        </button>
        <button onClick={clearDb} className="bg-red-600 text-white px-6 py-2 ml-4 rounded-lg hover:bg-red-700">
          Clear DB Before Repopulation
        </button>
        <button onClick={populateDb} disabled={loading} className="bg-green-600 text-white px-6 py-2 ml-4 rounded-lg hover:bg-green-700">
          {loading ? 'Populating...' : 'Populate DB'}
        </button>
      </div>

      {message && <p className="message mt-4 text-green-600">{message}</p>}

      {showUsers && (
  <>
    {users.test_users.length > 0 && (
      <div className="mt-6 overflow-x-auto bg-white shadow-md rounded-lg">
        <h3 className="text-xl font-semibold mb-4 text-gray-700">🧪 Test Users:</h3>
        <table className="min-w-full table-auto border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border text-sm text-gray-700 text-center">Username</th>
              <th className="px-4 py-2 border text-sm text-gray-700 text-center">Password</th>
              <th className="px-4 py-2 border text-sm text-gray-700 text-center">Email</th>
            </tr>
          </thead>
          <tbody>
            {users.test_users.map((user, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-4 py-2 border text-sm text-gray-800 text-center">{user.username}</td>
                <td className="px-4 py-2 border text-sm text-gray-800 text-center">{user.password}</td>
                <td className="px-4 py-2 border text-sm text-gray-800 text-center">{user.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}

    {users.real_users.length > 0 && (
      <div className="mt-10 overflow-x-auto bg-white shadow-md rounded-lg">
        <h3 className="text-xl font-semibold mb-4 text-gray-700">👤 Registered Users:</h3>
        <table className="min-w-full table-auto border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border text-sm text-gray-700 text-center">Username</th>
              <th className="px-4 py-2 border text-sm text-gray-700 text-center">Password</th>
              <th className="px-4 py-2 border text-sm text-gray-700 text-center">Email</th>
            </tr>
          </thead>
          <tbody>
            {users.real_users.map((user, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-4 py-2 border text-sm text-gray-800 text-center">{user.username}</td>
                <td className="px-4 py-2 border text-sm text-gray-800 text-center">{user.password}</td>
                <td className="px-4 py-2 border text-sm text-gray-800 text-center">{user.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </>
)}

      {showItems && items.length > 0 && (
        <div className="mt-6 overflow-x-auto bg-white shadow-md rounded-lg">
          <h3 className="text-xl font-semibold mb-4 text-gray-700">Populated Items:</h3>
          <table className="min-w-full table-auto border border-gray-300">
  <thead className="bg-gray-100">
    <tr>
      <th className="px-4 py-2 border text-sm text-gray-700 text-center">Item Title</th>
      <th className="px-4 py-2 border text-sm text-gray-700 text-center">Description</th>
      <th className="px-4 py-2 border text-sm text-gray-700 text-center">Price</th>
      <th className="px-4 py-2 border text-sm text-gray-700 text-center">Owner</th>
      <th className="px-4 py-2 border text-sm text-gray-700 text-center">Date Added</th>
    </tr>
  </thead>
  <tbody>
    {items.map((item, index) => (
      <tr key={index} className="hover:bg-gray-50">
        <td className="px-4 py-2 border text-sm text-gray-800 text-center">{item.title}</td>
        <td className="px-4 py-2 border text-sm text-gray-800 text-center">{item.description}</td>
        <td className="px-4 py-2 border text-sm text-gray-800 text-center">${item.price}</td>
        <td className="px-4 py-2 border text-sm text-gray-800 text-center">{item.owner}</td>
        <td className="px-4 py-2 border text-sm text-gray-800 text-center">
          {new Date(item.date_added).toLocaleDateString()}
        </td>
      </tr>
    ))}
  </tbody>
</table>

        </div>
      )}

      <style jsx>{`
        .population-container {
          text-align: center;
        }
      `}</style>
    </div>
  );
};


export default PopulationDb;
