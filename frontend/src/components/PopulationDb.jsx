import React, { useState } from 'react';

const PopulationDb = () => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]); // State to store fetched items
  const [users, setUsers] = useState([]); // State to store users
  const [showUsers, setShowUsers] = useState(false); // State to control displaying users
  const [showItems, setShowItems] = useState(false); // State to control displaying items

  // Function to handle DB population request
  const populateDb = async () => {
    setLoading(true);
    try {
      // Clear the existing data before repopulation
      const clearResponse = await fetch('http://127.0.0.1:8000/shop/clear-db/');
      const clearData = await clearResponse.json();
      if (clearData.message !== 'Database cleared') {
        setMessage('Failed to clear database before repopulation.');
        return;
      }

      // Make a request to populate the database
      const response = await fetch('http://127.0.0.1:8000/shop/populate-db/');
      const data = await response.json();
      setMessage(data.message); // Show success message

      // Fetch the list of items after population
      const itemsResponse = await fetch('http://127.0.0.1:8000/shop/api/items/');
      const itemsData = await itemsResponse.json();
      setItems(itemsData); // Set the fetched items to the state

      // Fetch the list of users
      const usersResponse = await fetch('http://127.0.0.1:8000/shop/api/users/');
      const usersData = await usersResponse.json();
      setUsers(usersData); // Set the fetched users to the state

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
      <h2 className="text-2xl font-semibold mb-4">Populate the Database</h2>

      {/* Buttons to show different data and trigger actions */}
      <div className="mb-4">
        <button 
          onClick={() => setShowUsers(!showUsers)} 
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-300">
          {showUsers ? 'Hide Users' : 'Show Users'}
        </button>
        <button 
          onClick={() => setShowItems(!showItems)} 
          className="bg-orange-500 text-white px-6 py-2 ml-4 rounded-lg hover:bg-orange-700 transition duration-300">
          {showItems ? 'Hide Items' : 'Show Items'}
        </button>
        <button 
          onClick={clearDb} 
          className="bg-red-500 text-white px-6 py-2 ml-4 rounded-lg hover:bg-red-700 transition duration-300">
          Clear DB Before Repopulation
        </button>
        <button 
          onClick={populateDb} 
          disabled={loading} 
          className="bg-green-500 text-white px-6 py-2 ml-4 rounded-lg hover:bg-green-700 transition duration-300">
          {loading ? 'Populating...' : 'Populate DB'}
        </button>
      </div>

      {message && <p className="message mt-4 text-green-600">{message}</p>}

      {/* Display the users in a table */}
      {showUsers && users.length > 0 && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-4">Users:</h3>
          <table className="min-w-full table-auto border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="border-b px-4 py-2 text-left">Username</th>
                <th className="border-b px-4 py-2 text-left">Password</th>
                <th className="border-b px-4 py-2 text-left">Email Address</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={index}>
                  <td className="border-b px-4 py-2">{user.username}</td>
                  <td className="border-b px-4 py-2">{user.password}</td>
                  <td className="border-b px-4 py-2">{user.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Display the items in a table if they exist */}
      {showItems && items.length > 0 && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-4">Populated Items:</h3>
          <table className="min-w-full table-auto border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="border-b px-4 py-2 text-left">Item Title</th>
                <th className="border-b px-4 py-2 text-left">Description</th>
                <th className="border-b px-4 py-2 text-left">Price</th>
                <th className="border-b px-4 py-2 text-left">Owner</th>
                <th className="border-b px-4 py-2 text-left">Date Added</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index}>
                  <td className="border-b px-4 py-2">{item.title}</td>
                  <td className="border-b px-4 py-2">{item.description}</td>
                  <td className="border-b px-4 py-2">${item.price}</td>
                  <td className="border-b px-4 py-2">{item.owner__username}</td>
                  <td className="border-b px-4 py-2">{new Date(item.date_added).toLocaleDateString()}</td>
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