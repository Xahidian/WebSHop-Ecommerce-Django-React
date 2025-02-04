import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const EditAccount = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simple client-side validation
    if (!oldPassword || !newPassword || !confirmNewPassword) {
      setError('Please fill in all fields.');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setError('New passwords do not match.');
      return;
    }

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters long.');
      return;
    }

    // Assuming backend logic to update password (skip for now)
    // Simulate success
    setSuccess('Password updated successfully.');
    setError('');

    // Redirect after successful update (optional)
    setTimeout(() => {
      navigate('/profile'); // Redirect to profile page (or any other page)
    }, 2000);
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
