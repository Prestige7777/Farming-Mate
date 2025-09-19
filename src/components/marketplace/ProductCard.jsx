// src/components/marketplace/ProductCard.jsx

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../common/Button';
import { DEFAULT_IMAGE_URL } from '../../utils/constants';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext'; // useWishlist 임포트
import { useAuth } from '../auth/AuthProvider'; // Import useAuth
import './ProductCard.css';

const ProductCard = ({ product, hideFarmerProfile, isMyPage, onEdit, onDelete }) => {
  const { addItem: addToCart } = useCart();
  const { addOrRemoveFromWishlist, isInWishlist } = useWishlist(); // useWishlist 훅 사용
  const navigate = useNavigate();
  const { user } = useAuth(); // Get authenticated user

  const isWishlisted = isInWishlist(product.id);

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addOrRemoveFromWishlist(product.id);
  };

  const handleAddToCart = (e) => {
    e.preventDefault(); // Prevent Link navigation
    e.stopPropagation(); // Prevent Link navigation
    addToCart(product);
    alert(`${product.name}이(가) 장바구니에 추가되었습니다.`);
  };

  const handleBuyNow = (e) => {
    e.preventDefault(); // Prevent Link navigation
    e.stopPropagation(); // Prevent Link navigation
    addToCart(product);
    navigate('/cart'); // Navigate to cart page after adding to cart
  };

  const profileLink = user && user.id === product.farmerId ? '/mypage' : `/farmers/${product.farmerId}/public`;

  return (
    <div className="product-card">
      {!hideFarmerProfile && (
        <div className="product-card-header">
          <Link to={profileLink} className="farmer-info-link">
            <img src={product.farmerProfileImageUrl || DEFAULT_IMAGE_URL} alt={product.farmerName} className="farmer-profile-image" />
            <span className="farmer-name">{product.farmerName} 농부님</span>
          </Link>
        </div>
      )}
      <Link to={`/products/${product.id}`} className="product-card-image-link">
        <img
          src={product.imageUrl || DEFAULT_IMAGE_URL}
          alt={product.name}
          className="product-card-image"
        />
        <button
          className={`wishlist-icon ${isWishlisted ? 'active' : ''}`}
          onClick={handleWishlistToggle}
          aria-label="관심 상품 추가/제거"
        >
          {isWishlisted ? '❤️' : '🤍'}
        </button>
      </Link>
      <div className="product-card-body">
        <h3 className="product-card-title">{product.name}</h3>
        <p className="product-card-price">{product.price ? product.price.toLocaleString() : 'N/A'}원</p>
        <p className="product-card-desc">{product.description}</p>
        <div className="product-card-tags">
          {product.tags && product.tags.map((tag, index) => (
            <span key={index} className="product-card-tag">
              #{tag}
            </span>
          ))}
        </div>
        {isMyPage && (
          <div className="product-actions my-page-actions">
            <Button variant="outline" onClick={() => onEdit(product)}>수정</Button>
            <Button variant="secondary" onClick={() => onDelete(product.id)}>삭제</Button>
          </div>
        )}
        {!isMyPage && (
          <div className="product-card-actions">
            <Button className="product-card-button" onClick={handleAddToCart}>장바구니 담기</Button>
            <Button variant="primary" className="product-card-button buy-now-button" onClick={handleBuyNow}>구매하기</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
