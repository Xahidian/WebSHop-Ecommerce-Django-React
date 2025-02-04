// src/components/ItemList.jsx
import React from 'react';
import Item from './Item';

const ItemList = ({ items, onAddToCart, onViewDetails }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {items.map((item) => (
        <Item key={item.id} {...item} onAddToCart={() => onAddToCart(item)} onViewDetails={onViewDetails} />
      ))}
    </div>
  );
};

export default ItemList;