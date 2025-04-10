import React, { useState } from 'react';
import { toast } from 'react-hot-toast'; // ✅ import toast

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const EditAccount = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!oldPassword || !newPassword || !confirmNewPassword) {
      const msg = 'Please fill in all fields.';
      setError(msg);
      toast.error(msg); // ✅ toast for empty fields
      return;
    }

    if (newPassword !== confirmNewPassword) {
      const msg = 'New passwords do not match.';
      setError(msg);
      toast.error(msg); // ✅ toast for mismatch
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
        const msg = data.error || 'Password update failed.';
        setError(msg);
        toast.error(`❌ ${msg}`); // ✅ toast for failure
        return;
      }

      const msg = data.message || 'Password updated!';
      setSuccess(msg);
      toast.success(`✅ ${msg}`); // ✅ toast for success

      setOldPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (err) {
      console.error(err);
      const msg = 'An error occurred.';
      setError(msg);
      toast.error(`❌ ${msg}`); // ✅ toast for network error
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6">My Account</h1>

      <form onSubmit={handlePasswordSubmit} className="max-w-md mx-auto">
        {error && <div className="text-red-500 text-center mb-4">{error}</div>}
        {success && <div className="text-green-500 text-center mb-4">{success}</div>}

        <label className="block mb-2 font-medium">Old Password</label>
        <input
          type="password"
          className="w-full mb-4 p-2 border rounded"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
        />

        <label className="block mb-2 font-medium">New Password</label>
        <input
          type="password"
          className="w-full mb-4 p-2 border rounded"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />

        <label className="block mb-2 font-medium">Confirm New Password</label>
        <input
          type="password"
          className="w-full mb-4 p-2 border rounded"
          value={confirmNewPassword}
          onChange={(e) => setConfirmNewPassword(e.target.value)}
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Update Password
        </button>
      </form>
    </div>
  );
};

export default EditAccount;
