// src/components/EditableItemCard.jsx
import React, { useState } from 'react';

const EditableItemCard = ({ item, API_BASE_URL, refreshInventory }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editPrice, setEditPrice] = useState(item.price);
  const [editQuantity, setEditQuantity] = useState(item.quantity);
 
  console.log("🖼 item.image value:", item.image);
  console.log("🧾 item object:", item);
  const handleSave = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const res = await fetch(`${API_BASE_URL}/api/items/${item.id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          price: editPrice,
          quantity: editQuantity
        })
      });
      if (res.ok) {
        await refreshInventory();
        setIsEditing(false);
      } else {
        console.error('Failed to update item');
      }
    } catch (err) {
      console.error('Error while updating item:', err);
    }
  };

  return (
    
    <div className="p-4 border rounded shadow bg-white">


      {/* ✅ Display the item image if it exists */}
      {item.image && (
  <img
    src={`/image/${item.image.replace(/^.*[\\/]/, '')}`} // removes any leading paths
    alt="Item"
    className="w-full h-40 object-cover rounded mb-3"
  />
)}
  
      <h3 className="font-bold text-lg">{item.title}</h3>
      <p>{item.description}</p>
  
      {isEditing ? (
        <>
          <p>
            Price: <input type="number" value={editPrice} onChange={e => setEditPrice(e.target.value)} className="border px-2 py-1 rounded w-20" />
          </p>
          <p>
            Quantity: <input type="number" value={editQuantity} onChange={e => setEditQuantity(e.target.value)} className="border px-2 py-1 rounded w-20" />
          </p>
          <div className="mt-2 flex space-x-2">
            <button onClick={handleSave} className="bg-green-600 text-white px-3 py-1 rounded">Save</button>
            <button onClick={() => setIsEditing(false)} className="bg-gray-400 text-white px-3 py-1 rounded">Cancel</button>
          </div>
        </>
      ) : (
        <>
          <p>Price: ${item.price}</p>
          <p>Quantity: {item.quantity}</p>
          <button onClick={() => setIsEditing(true)} className="mt-2 bg-blue-600 text-white px-3 py-1 rounded">Edit</button>
        </>
      )}
    </div>
  );
  
};

export default EditableItemCard;
