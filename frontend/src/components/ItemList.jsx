// src/components/ItemList.jsx
import React from 'react';
import Item from './Item';

const ItemList = ({ items, onAddToCart, onViewDetails, loggedInUser}) => {
  console.log("Items array:", items);  // Log the full items array for debugging

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {items.map((item, index) => {
        console.log(`Rendering Item with key: ${item.id || index}`); // Log each key
        return (
          <Item
          loggedInUser={loggedInUser}  // 👈 Add this
          key={item.id}
          id={item.id}
          image={item.image}
          title={item.title}
          description={item.description}
          price={item.price}
          dateAdded={item.date_added}
          ownerId={item.owner_id}
          ownerUsername={item.owner_username} // ✅ Pass ownerUsername here
          onAddToCart={() => onAddToCart(item)}
          onViewDetails={onViewDetails}
        />
        );
      })}
    </div>
  );
};

export default ItemList;
