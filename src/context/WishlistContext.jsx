import React, { createContext, useContext, useState, useEffect } from 'react';
import { getWishlist, addToWishlist, removeFromWishlist } from '../utils/api';
import { useAuth } from '../components/auth/AuthProvider';

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlist = async () => {
      if (user && user.id) {
        setLoading(true);
        try {
          const items = await getWishlist(user.id);
          setWishlistItems(items);
        } catch (error) {
          console.error("Failed to fetch wishlist:", error);
          setWishlistItems([]);
        } finally {
          setLoading(false);
        }
      } else {
        setWishlistItems([]);
        setLoading(false);
      }
    };
    fetchWishlist();
  }, [user]);

  const addOrRemoveFromWishlist = async (productId) => {
    if (!user) {
      alert('로그인 후 관심 상품을 이용해주세요.');
      return;
    }

    const existingItem = wishlistItems.find(item => item.productId === productId && item.userId === user.id);

    try {
      if (existingItem) {
        await removeFromWishlist(existingItem.id);
        setWishlistItems(wishlistItems.filter(item => item.id !== existingItem.id));
        alert('관심 상품에서 제거되었습니다.');
      } else {
        const newItem = {
          userId: user.id,
          productId: productId,
        };
        const response = await addToWishlist(newItem);
        setWishlistItems([...wishlistItems, response]);
        alert('관심 상품에 추가되었습니다.');
      }
    } catch (error) {
      console.error("Failed to update wishlist:", error);
      alert('관심 상품 업데이트에 실패했습니다.');
    }
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some(item => item.productId === productId && item.userId === user?.id);
  };

  return (
    <WishlistContext.Provider value={{ wishlistItems, loading, addOrRemoveFromWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
