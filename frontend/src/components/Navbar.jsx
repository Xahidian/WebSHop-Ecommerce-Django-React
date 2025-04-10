import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ cartCount, onSearch, loggedInUser, onLogout }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <nav className="bg-white shadow-md dark:bg-gray-800">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/">
          <img
            alt="Your Company"
            src="/image/logo.png"
            className="h-10 w-auto"
          />
        </Link>

        {/* Search Bar */}
        <div className="flex space-x-4 items-center">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search..."
            className="px-4 py-2 border rounded-lg shadow-sm"
          />

          {/* Authenticated View */}
          {loggedInUser ? (
            <>
              <span className="text-gray-800 dark:text-white font-medium">
                Hello, {loggedInUser}
              </span>

              <Link
                to="/account"
                className="bg-gray-100 text-gray-800 px-4 py-2 rounded border border-gray-300 hover:bg-gray-200 font-medium"
              >
                Edit Account
              </Link>

              <Link
                to="/add-item"
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 font-medium"
              >
                Add Item
              </Link>

              <Link
                to="/myitems"
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 font-medium"
              >
                My Items
              </Link>

              <button
                onClick={onLogout}
                className="text-red-600 hover:underline font-semibold"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-indigo-600 hover:underline font-medium"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="text-indigo-600 hover:underline font-medium"
              >
                Sign Up
              </Link>
            </>
          )}

          {/* Populate DB Button - always visible */}
          <Link
            to="/populate-db"
            className="bg-blue-100 text-blue-800 px-4 py-2 rounded border border-blue-400 hover:bg-blue-200 font-medium"
          >
            Populate DB
          </Link>

          {/* Cart Icon with Badge */}
          <Link
            to="/cart"
            className="relative text-gray-900 dark:text-white hover:underline"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M17 13a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
