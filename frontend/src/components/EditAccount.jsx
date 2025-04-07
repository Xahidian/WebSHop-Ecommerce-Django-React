import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


const EditAccount = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
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
 // assuming you store JWT token here
      console.log('JWT Token:', token); // 🔍 this will print in browser console
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
  
      setSuccess(data.message || 'Password updated successfully!');
      setOldPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
  
      setTimeout(() => {
        navigate('/profile');
      }, 2000);
    } catch (err) {
      console.error(err);
      setError('An error occurred. Please try again.');
    }
  };
  

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Edit Account</h1>
      
      {/* Error and Success Messages */}
      {error && <div className="text-red-500 text-center mb-4">{error}</div>}
      {success && <div className="text-green-500 text-center mb-4">{success}</div>}
      
      {/* Form */}
      <form onSubmit={handleSubmit} className="max-w-md mx-auto">
        <div className="mb-4">
          <label htmlFor="oldPassword" className="block text-lg font-medium text-gray-700">Old Password</label>
          <input
            type="password"
            id="oldPassword"
            className="w-full p-2 mt-2 border border-gray-300 rounded-lg"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="newPassword" className="block text-lg font-medium text-gray-700">New Password</label>
          <input
            type="password"
            id="newPassword"
            className="w-full p-2 mt-2 border border-gray-300 rounded-lg"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="confirmNewPassword" className="block text-lg font-medium text-gray-700">Confirm New Password</label>
          <input
            type="password"
            id="confirmNewPassword"
            className="w-full p-2 mt-2 border border-gray-300 rounded-lg"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            required
          />
        </div>
        
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded-lg mt-4">Update Password</button>
      </form>
    </div>
  );
};

export default EditAccount;
