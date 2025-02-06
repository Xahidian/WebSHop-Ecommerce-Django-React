import React, { useState, useEffect } from 'react';

const PopulationDb = () => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]); // State to store fetched items
  const [users, setUsers] = useState([]); // State to store users
  const [showUsers, setShowUsers] = useState(false); // State to control displaying users
  const [showItems, setShowItems] = useState(false); // State to control displaying items

  // Function to fetch items from the backend
  const fetchItems = async () => {
    try {
      const itemsResponse = await fetch('http://127.0.0.1:8000/shop/api/items/');
      const itemsData = await itemsResponse.json();
      setItems(itemsData); // Set the fetched items to the state
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  // Function to fetch users from the backend
  const fetchUsers = async () => {
    try {
      const usersResponse = await fetch('http://127.0.0.1:8000/shop/api/users/');
      const usersData = await usersResponse.json();
      setUsers(usersData); // Set the fetched users to the state
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  // Fetch data when the component mounts
  useEffect(() => {
    fetchItems();
    fetchUsers();
  }, []);

  // Function to handle DB population request (without clearing the DB first)
  const populateDb = async () => {
    setLoading(true);
    try {
      // Make a request to populate the database
      const response = await fetch('http://127.0.0.1:8000/shop/populate-db/');
      const data = await response.json();
      setMessage(data.message); // Show success message

      // Fetch the list of items after population
      await fetchItems();

      // Fetch the list of users
      await fetchUsers();

    } catch (error) {
      setMessage('Error populating the database');
    } finally {
      setLoading(false);
    }
  };

  // Function to handle clearing the database (before repopulation)
  const clearDb = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/shop/clear-db/');
      const data = await response.json();
      setMessage(data.message); // Show success message for clearing DB
  
      // Clear the state so the tables become empty
      setUsers([]);  // Clear the users state
      setItems([]);  // Clear the items state
    } catch (error) {
      setMessage('Error clearing the database');
    }
  };

  return (
    <div className="population-container p-6">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Populate the Database</h2>

      {/* Buttons to show different data and trigger actions */}
      <div className="mb-4">
        <button 
          onClick={() => setShowUsers(!showUsers)} 
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-300">
          {showUsers ? 'Hide Users' : 'Show Users'}
        </button>
        <button 
          onClick={() => setShowItems(!showItems)} 
          className="bg-orange-600 text-white px-6 py-2 ml-4 rounded-lg hover:bg-orange-700 transition duration-300">
          {showItems ? 'Hide Items' : 'Show Items'}
        </button>
        <button 
          onClick={clearDb} 
          className="bg-red-600 text-white px-6 py-2 ml-4 rounded-lg hover:bg-red-700 transition duration-300">
          Clear DB Before Repopulation
        </button>
        <button 
          onClick={populateDb} 
          disabled={loading} 
          className="bg-green-600 text-white px-6 py-2 ml-4 rounded-lg hover:bg-green-700 transition duration-300">
          {loading ? 'Populating...' : 'Populate DB'}
        </button>
      </div>

      {message && <p className="message mt-4 text-green-600">{message}</p>}

      {/* Display the users in a table */}
      {showUsers && users.length > 0 && (
        <div className="mt-6 overflow-x-auto bg-white shadow-md rounded-lg">
          <h3 className="text-xl font-semibold mb-4 text-gray-700">Users:</h3>
          <table className="min-w-full table-auto border-collapse border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="border-b px-4 py-2 text-left text-sm text-gray-700">Username</th>
                <th className="border-b px-4 py-2 text-left text-sm text-gray-700">Password</th>
                <th className="border-b px-4 py-2 text-left text-sm text-gray-700">Email Address</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={index} className="hover:bg-gray-50 transition duration-200">
                  <td className="border-b px-4 py-2 text-sm text-gray-800 text-left">{user.username}</td>
                  <td className="border-b px-4 py-2 text-sm text-gray-800 text-left">{user.password}</td>
                  <td className="border-b px-4 py-2 text-sm text-gray-800 text-left">{user.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Display the items in a table if they exist */}
      {showItems && items.length > 0 && (
        <div className="mt-6 overflow-x-auto bg-white shadow-md rounded-lg">
          <h3 className="text-xl font-semibold mb-4 text-gray-700">Populated Items:</h3>
          <table className="min-w-full table-auto border-collapse border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="border-b px-4 py-2 text-left text-sm text-gray-700">Item Title</th>
                <th className="border-b px-4 py-2 text-left text-sm text-gray-700">Description</th>
                <th className="border-b px-4 py-2 text-left text-sm text-gray-700">Price</th>
                <th className="border-b px-4 py-2 text-left text-sm text-gray-700">Owner</th>
                <th className="border-b px-4 py-2 text-left text-sm text-gray-700">Date Added</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50 transition duration-200">
                  <td className="border-b px-4 py-2 text-sm text-gray-800 text-left">{item.title}</td>
                  <td className="border-b px-4 py-2 text-sm text-gray-800 text-left">{item.description}</td>
                  <td className="border-b px-4 py-2 text-sm text-gray-800 text-left">${item.price}</td>
                  <td className="border-b px-4 py-2 text-sm text-gray-800 text-left">{item.owner__username}</td>
                  <td className="border-b px-4 py-2 text-sm text-gray-800 text-left">{new Date(item.date_added).toLocaleDateString()}</td>
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
        .populate-button:disabled {
          background-color: #d3d3d3;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default PopulationDb;