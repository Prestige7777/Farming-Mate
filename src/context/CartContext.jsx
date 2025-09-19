// src/context/CartContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCart, addToCart, updateCartItem, removeCartItem } from '../utils/api';
import { useAuth } from '../components/auth/AuthProvider'; // Corrected path

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Fetch cart on user change or component mount
  useEffect(() => {
    const fetchCart = async () => {
      if (user && user.id) {
        setLoading(true);
        try {
          const items = await getCart(user.id);
          setCartItems(items);
        } catch (error) {
          console.error("Failed to fetch cart:", error);
          setCartItems([]);
        } finally {
          setLoading(false);
        }
      } else {
        setCartItems([]); // Clear cart if no user
        setLoading(false);
      }
    };
    fetchCart();
  }, [user]);

  const addItem = async (product, quantity = 1) => {
    if (!user) {
      alert('로그인 후 장바구니를 이용해주세요.');
      return;
    }

    const existingItem = cartItems.find(item => item.productId === product.id && item.userId === user.id);

    try {
      if (existingItem) {
        const updatedQuantity = existingItem.quantity + quantity;
        const response = await updateCartItem(existingItem.id, updatedQuantity);
        setCartItems(cartItems.map(item => item.id === existingItem.id ? response : item));
      } else {
        const newItem = {
          userId: user.id,
          productId: product.id,
          name: product.name,
          price: product.price,
          imageUrl: product.imageUrl,
          quantity,
        };
        const response = await addToCart(newItem);
        setCartItems([...cartItems, response]);
      }
      alert('상품이 장바구니에 추가되었습니다.');
    } catch (error) {
      console.error("Failed to add item to cart:", error);
      alert('장바구니 추가에 실패했습니다.');
    }
  };

  const updateItemQuantity = async (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeItem(itemId);
      return;
    }
    try {
      const response = await updateCartItem(itemId, newQuantity);
      setCartItems(cartItems.map(item => item.id === itemId ? response : item));
    } catch (error) {
      console.error("Failed to update item quantity:", error);
      alert('수량 변경에 실패했습니다.');
    }
  };

  const removeItem = async (itemId) => {
    try {
      await removeCartItem(itemId);
      setCartItems(cartItems.filter(item => item.id !== itemId));
      alert('상품이 장바구니에서 제거되었습니다.');
    } catch (error) {
      console.error("Failed to remove item from cart:", error);
      alert('상품 제거에 실패했습니다.');
    }
  };

  const clearCart = async () => {
    // This would typically involve deleting all cart items for the user
    // For json-server, we might need to iterate and delete or clear the db.json cart array manually
    // For now, just clear local state
    setCartItems([]);
    // In a real app, you'd call an API to clear the backend cart
  };

  const cartTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{ cartItems, loading, addItem, updateItemQuantity, removeItem, clearCart, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);