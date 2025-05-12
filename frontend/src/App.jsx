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
import { toast } from 'react-hot-toast';
import { Navigate } from 'react-router-dom';
import MyItems from './components/MyItems';

const App = () => {
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem('cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error('Error loading cart:', error);
      return [];
    }
  });
  
  // Separate the useEffect hooks

  const [purchasedItems, setPurchasedItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [items, setItems] = useState([]); // State to store fetched items
  const [loggedInUser, setLoggedInUser] = useState(localStorage.getItem('username') || '');



  const getItems = async () => {
    const fetchedItems = await fetchItems();
    setItems(fetchedItems);
  };
  
  useEffect(() => {
    getItems();  // Load on mount
  }, []);
  
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]); // 👈 Only runs when cart changes

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
    if (index !== -1) {
      console.log("Current quantity:", newCart[index].quantity);
      if (newCart[index].quantity > 1) {
        newCart[index].quantity -= 1;
        console.log("Decreased by 1 → now", newCart[index].quantity);
      } else {
        newCart.splice(index, 1);
        console.log("Removed item from cart");
      }
    }
    return newCart;
  });
};

  

  const handleCheckout = () => {
   // setPurchasedItems(cart);  // Store cart items in purchasedItems
  //  setCart([]);  // Clear cart after purchase
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
        setCart([]); // This will trigger the useEffect and clear localStorage
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
//search from API call
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Debounce helper (optional)
let debounceTimeout;
const handleSearch = (query) => {
  setSearchQuery(query);

  // Clear any previously scheduled API calls
  if (debounceTimeout) clearTimeout(debounceTimeout);

  debounceTimeout = setTimeout(async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/items/search/?q=${encodeURIComponent(query)}`
      );
      const data = await response.json();

      // Update items state with the results from API
      setItems(data);
    } catch (error) {
      console.error("Error performing search:", error);
    }
    console.log("Search triggered with query:", query);
  }, 300);  // Delay in milliseconds (adjust as needed)
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
   // localStorage.removeItem('cart'); // Injected fault for MR16
    toast.success("👋 Logged out successfully!");
  }}
  
/>

        <div className="container mx-auto p-4 flex-grow">
          <Routes>
          <Route
  path="/"
  element={
    <FrontPage
      items={filteredItems}
      onAddToCart={handleAddToCart}
      onViewDetails={handleViewDetails}
      loggedInUser={loggedInUser}   // 👈 pass this down
    />
  }
/>
<Route path="/login" element={<Login onLogin={setLoggedInUser} />} />
<Route path="/signup" element={<SignUp />} />



<Route
  path="/add-item"
  element={
    loggedInUser ? (
      <AddItem
        onItemAdded={(newItem) => {
          // Append the new item to the existing items state
          setItems((prevItems) => [...prevItems, newItem]);
        }}
      />
    ) : (
      <Navigate to="/login" replace />
    )
  }
/>


            <Route path="/items" element={<ItemList items={filteredItems} onAddToCart={handleAddToCart} onViewDetails={handleViewDetails} loggedInUser={loggedInUser} />} />
            <Route path="/cart" element={<Cart items={cart} onIncreaseQuantity={handleIncreaseQuantity} onDecreaseQuantity={handleDecreaseQuantity} onCheckout={handleCheckout} />} />
            <Route path="/checkout" element={<Checkout items={cart} onProceed={handleProceed} setCart={setCart} />} />
            <Route path="/purchased" element={<Purchased />} /> // remove `items` prop
            <Route path="/account" element={<EditAccount />} />
            <Route path="/populate-db" element={<PopulationDb />} /> {/* Corrected import */}
            <Route path="/myitems" element={<MyItems />} />
          </Routes>
        </div>
        {selectedItem && <Modal item={selectedItem} onClose={handleCloseModal} />}
      </div>

    

    </Router>
  );
};

export default App;