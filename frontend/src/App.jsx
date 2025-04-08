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
  const [loggedInUser, setLoggedInUser] = useState(localStorage.getItem('username') || '');


  useEffect(() => {
    const getItems = async () => {
      const fetchedItems = await fetchItems();
      setItems(fetchedItems);
    };
    getItems();
  }, []);

  const handleAddToCart = async (item) => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      alert("You must be logged in to add items to cart.");
      return;
    }
  
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/add-to-cart/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ item_id: item.id })
      });
  
      const data = await response.json();
  
      if (response.ok) {
        // ✅ Update the cart state so the cart icon shows +1
        setCart((prevCart) => {
          const existingItem = prevCart.find((cartItem) => cartItem.id === item.id);
          if (existingItem) {
            return prevCart.map((cartItem) =>
              cartItem.id === item.id
                ? { ...cartItem, quantity: cartItem.quantity + 1 }
                : cartItem
            );
          } else {
            return [...prevCart, { ...item, quantity: 1 }];
          }
        });
  
        alert("✅ Item added to cart.");
      } else {
        alert(`❌ ${data.error || "Failed to add item."}`);
      }
    } catch (error) {
      console.error("Add to cart error:", error);
      alert("❌ Network error.");
    }
  };
  
  
  
  
  

  const handleIncreaseQuantity = (item) => {
    setCart((prevCart) =>
      prevCart.map((cartItem) =>
        cartItem.id === item.id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      )
    );
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

 const handleProceed = async () => {
  const token = localStorage.getItem("access_token");

  if (!token) {
    alert("❌ You must be logged in to complete the purchase.");
    return;
  }

  try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/checkout/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ items: cart })
    });

    const data = await response.json();

    if (response.ok) {
      setPurchasedItems((prev) => [...prev, ...cart]);
      setCart([]);
      alert("✅ Purchase successful!");
    } else {
      alert(`❌ ${data.error || "Checkout failed."}`);
    }
  } catch (err) {
    console.error("Purchase error:", err);
    alert("❌ Purchase failed due to network error.");
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
      <Navbar
 cartCount={cart.reduce((acc, item) => acc + item.quantity, 0)}

  onSearch={handleSearch}
  loggedInUser={loggedInUser}
  onLogout={() => {
    setLoggedInUser('');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('username');
  }}
/>

        <div className="container mx-auto p-4 flex-grow">
          <Routes>
            <Route path="/" element={<FrontPage items={filteredItems} onAddToCart={handleAddToCart} onViewDetails={handleViewDetails} />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login onLogin={setLoggedInUser} />} />


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