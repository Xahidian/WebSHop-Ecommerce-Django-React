const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Generic fetch wrapper with optional auth
const fetchWithAuth = async (endpoint, options = {}, auth = true) => {
  const headers = {
    'Content-Type': 'application/json',
    ...(auth && localStorage.getItem('access_token') && {
      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
    }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error ${response.status}: ${errorText}`);
  }

  return response.json();
};


// Example: get all items
export const fetchItems = () => fetchWithAuth('/api/items/', {}, false);

// Example: post new item
export const addItem = (itemData) =>
  fetchWithAuth('/api/items/add/', {
    method: 'POST',
    body: JSON.stringify(itemData),
  });

// Example: get all users
export const fetchUsers = () => fetchWithAuth('/api/users/', {}, false);
// User Login - Get JWT tokens
export const loginUser = async (credentials) => {
  console.log('Attempting login with:', credentials);
  const response = await fetch(`${API_BASE_URL}/api/token/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error("Login failed:", errorData); // 🔍 show exact backend error
    throw new Error(errorData.detail || 'Login failed');
  }

  return response.json();
};


// User Registration
// src/api.js

export const registerUser = async (username, email, password) => {
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/register/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Registration failed');
  }

  return response.json();
};

