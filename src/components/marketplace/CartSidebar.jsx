// src/components/marketplace/CartSidebar.jsx

import React from 'react';
import { useCart } from '../../context/CartContext';
import Button from '../common/Button';
import CartItem from './CartItem';
import './CartSidebar.css';

const CartSidebar = () => {
  const { isCartSidebarOpen, toggleCartSidebar, cartItems, updateItemQuantity, removeItem, cartTotal } = useCart();

  const handleQuantityChange = (id, newQuantity) => {
    updateItemQuantity(id, newQuantity);
  };

  const handleRemoveItem = (id) => {
    removeItem(id);
  };

  if (!isCartSidebarOpen) return null;

  return (
    <div className="cart-sidebar-overlay" onClick={toggleCartSidebar}>
      <div className="cart-sidebar" onClick={(e) => e.stopPropagation()}>
        <div className="cart-sidebar-header">
          <h2>장바구니</h2>
          <Button onClick={toggleCartSidebar} variant="text">X</Button>
        </div>
        <div className="cart-sidebar-body">
          {cartItems.length === 0 ? (
            <p className="empty-cart-message">장바구니가 비어있습니다.</p>
          ) : (
            <div className="cart-items-list">
              {cartItems.map(item => (
                <CartItem
                  key={item.id}
                  item={item}
                  onQuantityChange={handleQuantityChange}
                  onRemove={handleRemoveItem}
                />
              ))}
            </div>
          )}
        </div>
        <div className="cart-sidebar-footer">
          <div className="cart-total">
            <span>총 상품 금액:</span>
            <span>{cartTotal.toLocaleString()}원</span>
          </div>
          <Button className="checkout-button" onClick={() => alert('결제 페이지로 이동합니다.')}>결제하기</Button>
        </div>
      </div>
    </div>
  );
};

export default CartSidebar;
