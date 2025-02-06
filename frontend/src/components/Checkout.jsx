import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Checkout = ({ items, onProceed }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const cartItems = location.state?.items || [];  // Get items from navigation state

  // Calculate total amount based on quantity and price
  const totalAmount = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  const handleProceed = () => {
    onProceed();  // Proceed with the purchase logic
    navigate('/purchased');  // Redirect to the purchased items list after proceeding
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Checkout</h1>
      {cartItems.length === 0 ? (
        <p className="text-center text-gray-700">Your cart is empty.</p>
      ) : (
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {cartItems.map((item) => (
              <div key={item.id} className="max-w-sm rounded overflow-hidden shadow-lg bg-white hover:shadow-xl transition-shadow duration-300 ease-in-out">
                <img className="w-full h-48 object-cover" src={item.image} alt="Product" />
                <div className="px-6 py-4">
                  <div className="font-bold text-xl mb-2 text-gray-900">{item.title}</div>
                  <p className="text-gray-700 text-base mb-4">{item.description}</p>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-900 font-bold text-lg">${(item.price * item.quantity).toFixed(2)}</span> {/* Display price based on quantity */}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 text-center">
            <p className="text-xl font-bold mb-4">Total Amount: ${totalAmount.toFixed(2)}</p>
            <button
              onClick={handleProceed}
              className="text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mx-2"
            >
              Proceed
            </button>
            <button
              onClick={() => navigate('/cart')}
              className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mx-2"
            >
              Back to Cart
            </button>
          </div>
        </div>
      )}
      <div className="mt-6 text-center">
        <Link to="/" className="text-blue-600 hover:underline">Continue Shopping</Link>
      </div>
    </div>
  );
};

export default Checkout;