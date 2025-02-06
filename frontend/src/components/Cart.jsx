// Cart.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Cart = ({ items, onIncreaseQuantity, onDecreaseQuantity, onCheckout }) => {
  const navigate = useNavigate();

  const handleCheckoutClick = () => {
    navigate('/checkout', { state: { items } });  // Pass cart items to Checkout component
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Shopping Cart</h1>
      {items.length === 0 ? (
        <p className="text-center text-gray-700">Your cart is empty.</p>
      ) : (
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {items.map((item) => (
              <div key={item.id} className="max-w-sm rounded overflow-hidden shadow-lg bg-white hover:shadow-xl transition-shadow duration-300 ease-in-out">
                <img className="w-full h-48 object-cover" src={item.image} alt="Product" />
                <div className="px-6 py-4">
                  <div className="font-bold text-xl mb-2 text-gray-900">{item.title}</div>
                  <p className="text-gray-700 text-base mb-4">{item.description}</p>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-900 font-bold text-lg">${item.price}</span>
                    <div className="flex items-center">
                      <button
                        onClick={() => onDecreaseQuantity(item)}
                        className="text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-2 py-1"
                      >
                        -
                      </button>
                      <span className="mx-2 text-gray-900 font-bold text-lg">{item.quantity || 1}</span>
                      <button
                        onClick={() => onIncreaseQuantity(item)}
                        className="text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-2 py-1"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 text-center">
            <button
              onClick={handleCheckoutClick}
              className="text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5"
            >
              Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
