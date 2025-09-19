// src/pages/ProductDetailPage.jsx

import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom'; // Added useNavigate
import Button from '../components/common/Button';
import ReviewSection from '../components/marketplace/ReviewSection';
import StoryCard from '../components/story/StoryCard';
import { getProductById, getFarmerById, getAllStories } from '../utils/api';
import { useCart } from '../context/CartContext'; // Import useCart
import { useWishlist } from '../context/WishlistContext'; // useWishlist 임포트
import { useAuth } from '../components/auth/AuthProvider'; // Added useAuth import
import LoadingSpinner from '../components/common/LoadingSpinner';
import './ProductDetailPage.css';

const ProductDetailPage = () => {
  const { productId } = useParams();
  const { user } = useAuth(); // Get user from AuthProvider
  const { addItem } = useCart(); // Get addItem from CartContext
  const { addOrRemoveFromWishlist, isInWishlist } = useWishlist(); // useWishlist 훅 사용
  const navigate = useNavigate(); // Import useNavigate
  const [product, setProduct] = useState(null);
  const [farmer, setFarmer] = useState(null);
  const [farmerStories, setFarmerStories] = useState([]);
  const [loading, setLoading] = useState(true);

  const isWishlisted = product ? isInWishlist(product.id) : false;

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product) return;
    addOrRemoveFromWishlist(product.id);
  };

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        const productData = await getProductById(productId);
        setProduct(productData);

        if (productData) {
          const farmerData = await getFarmerById(productData.farmerId);
          setFarmer(farmerData);

          const allStories = await getAllStories();
          const stories = allStories
            .filter(story => story.farmerId === productData.farmerId)
            .slice(0, 3);
          setFarmerStories(stories);
        }
      } catch (error) {
        console.error("Failed to fetch product details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [productId]);

  const handleAddToCart = () => {
    if (!user) {
      alert('로그인 후 장바구니에 담을 수 있습니다.');
      navigate('/login');
      return;
    }
    addItem(product, 1);
  };

  const handleBuyNow = () => {
    if (!user) {
      alert('로그인 후 바로 구매할 수 있습니다.');
      navigate('/login');
      return;
    }
    // 바로 구매 시, PaymentPage로 상품 정보와 함께 이동
    navigate('/payment', { state: { buyNowProduct: { ...product, quantity: 1 } } });
  };

  const mockReviews = [
    { id: 'rev001', author: '김소비', rating: 5, date: '2023-10-25', content: '정말 신선하고 맛있어요! 재구매 의사 100%입니다.' },
    { id: 'rev002', author: '박주부', rating: 4, date: '2023-10-23', content: '배송도 빠르고 상품도 좋습니다. 믿고 먹을 수 있어요.' },
  ];

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!product) {
    return (
      <div className="product-not-found">
        <h1 className="not-found-title">상품을 찾을 수 없습니다.</h1>
      </div>
    );
  }

  return (
    <div className="product-detail-page">
      <main className="product-detail-main">
        <div className="product-info-section">
          {/* 상품 이미지 */}
          <div className="product-image-container">
            <img
              src={product.imageUrl || 'https://via.placeholder.com/600x400?text=Product'}
              alt={product.name}
              className="product-image"
            />
            <button
              className={`wishlist-icon ${isWishlisted ? 'active' : ''}`}
              onClick={handleWishlistToggle}
              aria-label="관심 상품 추가/제거"
            >
              {isWishlisted ? '❤️' : '🤍'}
            </button>
          </div>

          {/* 상품 정보 및 구매 */}
          <div className="product-details-container">
            <h1 className="product-title">{product.name}</h1>
            <Link to={`/farmers/${farmer?.id}/public`} className="farmer-link">
              {farmer?.name} 농부님
            </Link>

            <div className="product-tags">
              {product.tags && product.tags.map((tag, index) => (
                <span key={index} className="product-tag">
                  #{tag}
                </span>
              ))}
            </div>

            <p className="product-price">{product.price.toLocaleString()}원</p>
            <p className="price-emphasis">
              <span className="emphasis-badge">💡</span> 시중 대형마트 대비 약 35% 저렴!
            </p>

            <p className="product-description">{product.description}</p>

            <div className="button-group">
              <Button className="action-button" onClick={handleAddToCart}>장바구니 담기</Button>
              <Button variant="secondary" className="action-button" onClick={handleBuyNow}>바로 구매</Button>
            </div>

            <div className="shipping-info">
              <h3 className="shipping-title">🚚 배송 정보</h3>
              <p className="shipping-text">
                - 배송 방식: 산지 직송 (평균 2~3일 소요)<br />
                - 배송비: 3,000원 (50,000원 이상 구매 시 무료)<br />
                - 신선도 유지를 위해 꼼꼼하게 포장하여 보내드립니다.
              </p>
            </div>
          </div>
        </div>

        {/* 판매 농부의 파밍스토리 */}
        {farmerStories.length > 0 && (
          <section className="farmer-story-section">
            <h2 className="section-title">
              이 상품을 키운 <Link to={`/farmers/${farmer?.id}/public`} className="farmer-link">{farmer?.name} 농부님</Link>의 파밍 스토리
            </h2>
            <div className="story-grid">
              {farmerStories.map(story => (
                <StoryCard key={story.id} story={{ ...story, farmerName: farmer.name, farmerProfileImageUrl: farmer.profileImageUrl }} />
              ))}
            </div>
            <div className="story-link-container">
                <Link to={`/farmers/${farmer?.id}/public`} className="story-link">
                    {farmer?.name} 농부님의 모든 스토리 보기 &rarr;
                </Link>
            </div>
          </section>
        )}

        {/* 리뷰 섹션 */}
        <ReviewSection reviews={mockReviews} />
      </main>
    </div>
  );
};

export default ProductDetailPage;
