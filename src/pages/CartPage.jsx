// src/pages/CartPage.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import CartItem from '../components/marketplace/CartItem';
import Button from '../components/common/Button';
import { useCart } from '../context/CartContext'; // Import useCart
import LoadingSpinner from '../components/common/LoadingSpinner'; // Import LoadingSpinner
import './CartPage.css';

const CartPage = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const { cartItems, loading, updateItemQuantity, removeItem, cartTotal } = useCart();

  if (loading) {
    return <LoadingSpinner />;
  }

  const handleQuantityChange = (id, newQuantity) => {
    updateItemQuantity(id, newQuantity);
  };

  const handleRemoveItem = (id) => {
    removeItem(id);
  };

  const totalAmount = cartTotal;

  return (
    <div className="cart-page">
      <main className="cart-main">
        <h1 className="page-title">🛒 장바구니</h1>
        {cartItems.length === 0 ? (
          <p className="empty-cart-message">장바구니가 비어있습니다.</p>
        ) : (
          <div className="cart-container">
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
            <div className="checkout-summary">
              <h2 className="summary-title">결제 요약</h2>
              <div className="summary-item">
                <span className="summary-label">총 상품 금액</span>
                <span className="summary-value">{totalAmount.toLocaleString()}원</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">배송비</span>
                <span className="summary-value">3,000원</span>
              </div>
              <div className="summary-total">
                <span>총 결제 금액</span>
                <span className="total-value">{(totalAmount + 3000).toLocaleString()}원</span>
              </div>
              <Button className="checkout-button" onClick={() => navigate('/payment')}>결제하기</Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CartPage;
