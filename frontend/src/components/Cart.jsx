// Cart.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Cart = ({ items, onIncreaseQuantity, onDecreaseQuantity, onCheckout }) => {
  const navigate = useNavigate();

  const handleCheckoutClick = () => {
    navigate('/checkout', { state: { items } });  // Pass cart items to Checkout component
  };

  // Calculate total price
  const total = items.reduce(
    (acc, item) => acc + item.price * (item.quantity || 1),
    0
  );

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8 text-center">Shopping Cart</h1>
      {items.length === 0 ? (
        <p className="text-center text-gray-600">Your cart is empty.</p>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="flex-1">
            {items.map((item) => (
              <div key={item.id} className="flex items-center border-b py-4">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-24 h-24 object-cover rounded"
                />
                <div className="ml-4 flex-1">
                  <h2 className="text-xl font-semibold">{item.title}</h2>
                  <p className="text-gray-500 text-sm">{item.description}</p>
                  <p className="text-gray-700 mt-2 font-bold">
                    ${(item.price * (item.quantity || 1)).toFixed(2)}
                  </p>
                </div>
                <div className="flex items-center">
                  <button
                    onClick={() => onDecreaseQuantity(item)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    -
                  </button>
                  <span className="mx-3 text-lg">{item.quantity || 1}</span>
                  <button
                    onClick={() => onIncreaseQuantity(item)}
                    className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="w-full lg:w-1/3 border p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
            <div className="flex justify-between mb-2">
              <span>Subtotal</span>
              <span>${total.toFixed(2)}</span>
            </div>
            {/* Placeholder values for taxes and shipping fees */}
            <div className="flex justify-between mb-2">
              <span>Tax</span>
              <span>$0.00</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Shipping</span>
              <span>$0.00</span>
            </div>
            <hr className="my-4" />
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <button
              onClick={handleCheckoutClick}
              className="mt-6 w-full bg-green-600 text-white py-3 rounded hover:bg-green-700"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
