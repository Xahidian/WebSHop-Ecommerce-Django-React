import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../api';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await loginUser({ username, password });
  
      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);
      localStorage.setItem('username', username); // ✅ Add this
      console.log('Attempting login with:', { username, password });

      onLogin(username); // Update parent state
      navigate('/');
    } catch (err) {
      console.error("Login failed:", err);  // <-- show real backend error
      setError(err.message || 'Login failed');
    }
    
  };
  

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img src="/image/logo.png" alt="logo" className="mx-auto h-10 w-auto" />
        <h2 className="mt-10 text-center text-2xl font-bold tracking-tight text-gray-900">Sign in to your account</h2>
        {error && <p className="mt-2 text-red-600 text-sm text-center">{error}</p>}
      </div>

      <form onSubmit={handleSubmit} className="mt-10 space-y-6 sm:w-full sm:max-w-sm sm:mx-auto">
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-900">Username</label>
          <input
            id="username"
            name="username"
            type="text"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-900">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <button type="submit" className="w-full bg-[#61e3e5] text-white font-semibold py-2 rounded hover:bg-[#4db8b9]">
            Sign in
          </button>
        </div>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        Not a member? <a href="/signup" className="font-semibold text-[#61e3e5] hover:text-[#4db8b9]">Sign up</a>
      </p>
    </div>
  );
};

export default Login;
