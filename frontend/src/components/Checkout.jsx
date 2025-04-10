// src/components/Checkout.jsx
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { handlePay } from './paymentService'; // Adjust the path if necessary



const Checkout = ({ items, onProceed, setCart }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const cartItems = location.state?.items || []; // Get items from navigation state

  // Calculate total amount based on quantity and price
  const totalAmount = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // Loading state to indicate the purchase is processing
  const [isLoading, setIsLoading] = useState(false);

  // Shipping details state (basic example)
  const [shippingDetails, setShippingDetails] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    email: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingDetails((prevState) => ({ ...prevState, [name]: value }));
  };

  // Converted handleProceed for asynchronous processing
  const handleProceed = async () => {
    setIsLoading(true);
    try {
      const result = await handlePay(cartItems, toast);
  
      if (!result.success) {
        if (result.reason === "PRICE_CHANGED") {
          toast.error("Prices were updated. Please review your cart.");
          setCart(result.updatedCart); // ⬅️ Update prices visually
        }
        setIsLoading(false);
        return;
      }
  
      // ✅ Clear cart only if purchase was successful
      if (typeof window !== 'undefined') {
        localStorage.removeItem("cart");
      }
      setCart([]);
      navigate('/purchased');
  
    } catch (error) {
      toast.error('There was an error completing your purchase. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  
  

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold text-center mb-8">Checkout</h1>
      
      {cartItems.length === 0 ? (
        <p className="text-center text-gray-700">Your cart is empty.</p>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column: Shipping Details */}
          <div className="flex-1 bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Shipping Details (Optional)</h2>
            <form className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-gray-700">Full Name</label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={shippingDetails.name}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  className="mt-1 w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label htmlFor="address" className="block text-gray-700">Address</label>
                <input
                  type="text"
                  name="address"
                  id="address"
                  value={shippingDetails.address}
                  onChange={handleInputChange}
                  placeholder="123 Main St"
                  className="mt-1 w-full border rounded px-3 py-2"
                />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label htmlFor="city" className="block text-gray-700">City</label>
                  <input
                    type="text"
                    name="city"
                    id="city"
                    value={shippingDetails.city}
                    onChange={handleInputChange}
                    placeholder="City"
                    className="mt-1 w-full border rounded px-3 py-2"
                  />
                </div>
                <div className="flex-1">
                  <label htmlFor="state" className="block text-gray-700">State</label>
                  <input
                    type="text"
                    name="state"
                    id="state"
                    value={shippingDetails.state}
                    onChange={handleInputChange}
                    placeholder="State"
                    className="mt-1 w-full border rounded px-3 py-2"
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label htmlFor="zip" className="block text-gray-700">Zip Code</label>
                  <input
                    type="text"
                    name="zip"
                    id="zip"
                    value={shippingDetails.zip}
                    onChange={handleInputChange}
                    placeholder="Zip Code"
                    className="mt-1 w-full border rounded px-3 py-2"
                  />
                </div>
                <div className="flex-1">
                  <label htmlFor="email" className="block text-gray-700">Email</label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={shippingDetails.email}
                    onChange={handleInputChange}
                    placeholder="you@example.com"
                    className="mt-1 w-full border rounded px-3 py-2"
                  />
                </div>
              </div>
            </form>
          </div>

          {/* Right Column: Order Summary */}
          <div className="w-full lg:w-1/3 bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between items-center">
                  <div className="flex items-center">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="ml-4">
                      <p className="font-medium">{item.title}</p>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
            <hr className="my-4" />
            <div className="flex justify-between text-lg font-semibold">
              <span>Total:</span>
              <span>${totalAmount.toFixed(2)}</span>
            </div>
            <button
              onClick={handleProceed}
              disabled={isLoading}
              className="mt-6 w-full bg-green-600 text-white py-3 rounded hover:bg-green-700"
            >
              {isLoading ? 'Processing...' : 'Place Order'}
            </button>
          </div>
        </div>
      )}

      <div className="mt-6 text-center">
        <Link to="/cart" className="text-blue-600 hover:underline">
          Back to Cart
        </Link>
      </div>
      <div className="mt-4 text-center">
        <Link to="/" className="text-blue-600 hover:underline">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default Checkout;
