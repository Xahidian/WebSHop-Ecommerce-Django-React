import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ItemList from './components/ItemList';
import SignUp from './components/SignUp';
import Login from './components/Login';
import AddItem from './components/AddItem';
import FrontPage from './components/FrontPage';
import Navbar from './components/Navbar';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import Modal from './components/Modal';
import Purchased from './components/Purchased';
import EditAccount from './components/EditAccount';
import PopulationDb from './components/PopulationDb'; // Corrected import for PopulationDb component
import { fetchItems } from './api'; // Import the fetchItems function

const App = () => {
  const [cart, setCart] = useState([]);
  const [purchasedItems, setPurchasedItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [items, setItems] = useState([]); // State to store fetched items

  useEffect(() => {
    const getItems = async () => {
      const fetchedItems = await fetchItems();
      setItems(fetchedItems);
    };
    getItems();
  }, []);

  const handleAddToCart = (item) => {
    setCart((prevCart) => [...prevCart, item]);
  };

  const handleIncreaseQuantity = (item) => {
    setCart((prevCart) => {
      const newCart = [...prevCart];
      const index = newCart.findIndex(cartItem => cartItem.id === item.id);
      if (index !== -1) {
        newCart[index].quantity = (newCart[index].quantity || 1) + 1;  // Increase quantity
      } else {
        newCart.push({...item, quantity: 1});  // If item is not in the cart, add it with quantity 1
      }
      return newCart;
    });
  };
  
  const handleDecreaseQuantity = (item) => {
    setCart((prevCart) => {
      const newCart = [...prevCart];
      const index = newCart.findIndex(cartItem => cartItem.id === item.id);
      if (index !== -1 && newCart[index].quantity > 1) {
        newCart[index].quantity -= 1;  // Decrease quantity
      } else {
        newCart.splice(index, 1);  // Remove item if quantity is 1
      }
      return newCart;
    });
  };
  

  const handleCheckout = () => {
    setPurchasedItems(cart);  // Store cart items in purchasedItems
    setCart([]);  // Clear cart after purchase
  };

  const handleProceed = () => {
    if (cart.length > 0) {
      // Add cart items to purchasedItems
      setPurchasedItems((prevPurchasedItems) => [...prevPurchasedItems, ...cart]);
      setCart([]);  // Clear cart after purchase
      alert('Purchase successful! Check "Purchased Items" for details.');
    }
  };

  const handleViewDetails = (item) => {
    setSelectedItem(item);
  };

  const handleCloseModal = () => {
    setSelectedItem(null);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const filteredItems = items.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar cartCount={cart.length} onSearch={handleSearch} />
        <div className="container mx-auto p-4 flex-grow">
          <Routes>
            <Route path="/" element={<FrontPage items={filteredItems} onAddToCart={handleAddToCart} onViewDetails={handleViewDetails} />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/add-item" element={<AddItem />} />
            <Route path="/items" element={<ItemList items={filteredItems} onAddToCart={handleAddToCart} onViewDetails={handleViewDetails} />} />
            <Route path="/cart" element={<Cart items={cart} onIncreaseQuantity={handleIncreaseQuantity} onDecreaseQuantity={handleDecreaseQuantity} onCheckout={handleCheckout} />} />
            <Route path="/checkout" element={<Checkout items={cart} onProceed={handleProceed} />} />
            <Route path="/purchased" element={<Purchased items={purchasedItems} />} />
            <Route path="/edit-account" element={<EditAccount />} />
            <Route path="/populate-db" element={<PopulationDb />} /> {/* Corrected import */}
          </Routes>
        </div>
        {selectedItem && <Modal item={selectedItem} onClose={handleCloseModal} />}
      </div>
    </Router>
  );
};

export default App;