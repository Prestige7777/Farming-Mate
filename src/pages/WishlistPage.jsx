import React, { useState, useEffect } from 'react';
import { useAuth } from '../components/auth/AuthProvider';
import { useWishlist } from '../context/WishlistContext';
import { getAllProducts } from '../utils/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ProductCard from '../components/marketplace/ProductCard';
import './WishlistPage.css'; // CSS 파일도 함께 생성

const WishlistPage = () => {
  const { user, loading: authLoading } = useAuth();
  const { wishlistItems, loading: wishlistLoading } = useWishlist();
  const [wishlistProducts, setWishlistProducts] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    if (authLoading || wishlistLoading) {
      return;
    }

    const fetchWishlistProductDetails = async () => {
      if (!user) {
        setPageLoading(false);
        return;
      }

      setPageLoading(true);
      try {
        if (wishlistItems.length > 0) {
          const allProducts = await getAllProducts();
          const filteredProducts = allProducts.filter(p =>
            wishlistItems.some(item => item.productId === p.id)
          );
          setWishlistProducts(filteredProducts);
        } else {
          setWishlistProducts([]);
        }
      } catch (error) {
        console.error("Failed to fetch wishlist product details:", error);
        setWishlistProducts([]);
      } finally {
        setPageLoading(false);
      }
    };

    fetchWishlistProductDetails();
  }, [user, authLoading, wishlistItems, wishlistLoading]);

  if (authLoading || pageLoading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return (
      <div className="wishlist-page-needs-login">
        <h1>로그인이 필요합니다.</h1>
        <p>관심 상품을 보려면 로그인해주세요.</p>
      </div>
    );
  }

  return (
    <div className="wishlist-page">
      <h1 className="wishlist-page-title">나의 관심 상품</h1>
      <div className="product-grid">
        {wishlistProducts.length > 0 ? (
          wishlistProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              hideFarmerProfile={false}
            />
          ))
        ) : (
          <p className="empty-message">관심 상품이 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
