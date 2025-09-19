// src/components/marketplace/CartItem.jsx

import React from 'react';
import Button from '../common/Button';
import { DEFAULT_IMAGE_URL } from '../../utils/constants';
import './CartItem.css';

const CartItem = ({ item, onQuantityChange, onRemove }) => {
  return (
    <div className="cart-item">
      <img
        src={item.imageUrl || DEFAULT_IMAGE_URL}
        alt={item.name}
        className="cart-item-image"
      />
      <div className="cart-item-info">
        <h3 className="cart-item-name">{item.name}</h3>
        <p className="cart-item-farmer">{item.farmerName}</p>
        <p className="cart-item-price">{item.price.toLocaleString()}원</p>
      </div>
      <div className="cart-item-actions">
        <Button variant="secondary" onClick={() => onQuantityChange(item.id, item.quantity - 1)} className="quantity-btn">-</Button>
        <span className="quantity-display">{item.quantity}</span>
        <Button variant="secondary" onClick={() => onQuantityChange(item.id, item.quantity + 1)} className="quantity-btn">+</Button>
        <Button variant="outline" onClick={() => onRemove(item.id)} className="remove-btn">삭제</Button>
      </div>
    </div>
  );
};

export default CartItem;
