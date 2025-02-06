// src/api.js
export const fetchItems = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/shop/api/items/'); // Adjust the URL if needed
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log('API Response:', data); // Check the API response here
      return data;
    } catch (error) {
      console.error('Error fetching items:', error);
      return [];
    }
  };
  