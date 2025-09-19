// src/pages/MyPage.jsx

import React, { useState, useEffect } from 'react';
import { useAuth } from '../components/auth/AuthProvider';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';
import ProductCard from '../components/marketplace/ProductCard';
import StoryCard from '../components/story/StoryCard';
import { getAllProducts, getAllStories, getFarmerById, updateUser, updateProduct, deleteProduct } from '../utils/api';
import ReviewSection from '../components/marketplace/ReviewSection';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EditProfileModal from '../components/common/EditProfileModal';
import EditProductModal from '../components/marketplace/EditProductModal';
import { DEFAULT_IMAGE_URL } from '../utils/constants';
import { useWishlist } from '../context/WishlistContext'; // useWishlist 임포트
import './MyPage.css';

const MyPage = () => {
  console.log("MyPage component rendering");
  // authLoading: AuthProvider의 로딩 상태를 명확히 구분하여 사용
  const { user, loading: authLoading, updateUserContext } = useAuth();
  const { wishlistItems } = useWishlist(); // wishlistItems 가져오기
  const [userProducts, setUserProducts] = useState([]);
  const [userStories, setUserStories] = useState([]);
  const [farmerData, setFarmerData] = useState(null);
  // pageLoading: MyPage 자체의 데이터 로딩 상태
  const [pageLoading, setPageLoading] = useState(true);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [isEditProductModalOpen, setIsEditProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    // AuthProvider의 로딩이 끝나고 user 객체가 확정된 후에 데이터 페칭 시작
    if (authLoading) {
      return; // AuthProvider가 로딩 중일 때는 아무 작업도 하지 않음
    }
    if (!user) {
      setPageLoading(false); // 사용자가 없으면 로딩 종료
      return;
    }

    const fetchData = async () => {
      try {
        setPageLoading(true); // 페이지 데이터 로딩 시작
        const [products, stories] = await Promise.all([
          getAllProducts(),
          getAllStories(),
        ]);

        console.log("Fetched products:", products);
        console.log("Fetched stories:", stories);

        setUserProducts(products.filter(p => p.farmerId === user.id));
        setUserStories(stories.filter(s => s.farmerId === user.id));

        if (user.role === 'farmer') {
          const farmer = await getFarmerById(user.id);
          setFarmerData(farmer);
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      } finally {
        setPageLoading(false); // 페이지 데이터 로딩 완료
      }
    };

    fetchData();
  }, [user, authLoading]); // authLoading을 의존성 배열에 추가

  const openEditProfileModal = () => setIsEditProfileModalOpen(true);
  const closeEditProfileModal = () => setIsEditProfileModalOpen(false);

  const openEditProductModal = (product) => {
    setEditingProduct(product);
    setIsEditProductModalOpen(true);
  };
  const closeEditProductModal = () => {
    setEditingProduct(null);
    setIsEditProductModalOpen(false);
  };

  const handleSaveProfile = async (updatedData) => {
    try {
      const updatedUser = await updateUser(user.id, updatedData);
      updateUserContext(updatedUser);

      if (user.role === 'farmer') {
        const farmer = await getFarmerById(user.id);
        setFarmerData(farmer);
      }

      alert("프로필이 성공적으로 업데이트되었습니다!");
      closeEditProfileModal();
    } catch (error) {
      console.error("Failed to update profile:", error);
      alert("프로필 업데이트에 실패했습니다.");
    }
  };

  const handleSaveProduct = async (updatedProductData) => {
    try {
      const response = await updateProduct(updatedProductData.id, updatedProductData);
      setUserProducts(userProducts.map(p => p.id === updatedProductData.id ? response : p));
      alert("상품이 성공적으로 수정되었습니다!");
      closeEditProductModal();
    } catch (error) {
      console.error("Failed to update product:", error);
      alert("상품 수정에 실패했습니다.");
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('정말로 이 상품을 삭제하시겠습니까?')) {
      try {
        await deleteProduct(productId);
        setUserProducts(userProducts.filter(p => p.id !== productId));
        alert('상품이 성공적으로 삭제되었습니다.');
      } catch (error) {
        console.error("Failed to delete product:", error);
        alert('상품 삭제에 실패했습니다.');
      }
    }
  };

  // authLoading 또는 pageLoading 중 하나라도 true이면 로딩 스피너 표시
  if (authLoading || pageLoading) {
    return <LoadingSpinner />;
  }

  // 로딩이 모두 끝난 후 사용자가 없으면 로그인 페이지로 유도
  if (!user) {
    return (
      <div className="my-page-needs-login">
        <div className="login-prompt-card">
          <h1 className="login-prompt-title">로그인이 필요합니다.</h1>
          <p className="login-prompt-text">마이페이지를 이용하려면 로그인해주세요.</p>
          <Link to="/login">
            <Button>로그인 하러가기</Button>
          </Link>
        </div>
      </div>
    );
  }
  
  const isFarmer = user.role === 'farmer';
  const mockReviews = [
    { id: 'rev001', author: '김소비', rating: 5, date: '2023-10-25', content: '정말 신선하고 맛있어요! 재구매 의사 100%입니다.' },
    { id: 'rev002', author: '박주부', rating: 4, date: '2023-10-23', content: '배송도 빠르고 상품도 좋습니다. 믿고 먹을 수 있어요.' },
  ];

  return (
    <div className="my-page">
      <section 
        className="profile-banner"
        style={{ backgroundImage: `url(${user.profileBgUrl || DEFAULT_IMAGE_URL})` }}
      >
        <div className="profile-banner-content">
          <h1 className="profile-banner-title">{isFarmer ? (farmerData?.farmName || user.name) : user.name}</h1>
          {isFarmer && (farmerData?.location || farmerData?.address) && <p className="profile-banner-location">{farmerData.location || farmerData.address}</p>}
        </div>
      </section>

      <main className="my-page-main">
        <section className="profile-details">
          <div className="profile-details-content">
            <div className="profile-header">
              <div className="profile-avatar-container">
                <img
                  src={user.profileImageUrl || DEFAULT_IMAGE_URL}
                  alt={`${user.name} 프로필 이미지`}
                  className="profile-avatar-img"
                />
              </div>

              <div className="profile-meta">
                <div className="profile-meta-top">
                  <h2 className="profile-name-details">
                    <span className="farmer-name">{user.name}</span>
                    {isFarmer && <span className="farmer-title">농부님</span>}
                  </h2>
                  <div className="profile-actions-container">
                    <Button variant="outline" onClick={openEditProfileModal}>프로필 편집</Button>
                  </div>
                </div>
                
                <div className="profile-stats">
                  <span>재배일지 <strong>{userStories.length}</strong></span>
                  <span>팔로워 <strong>0</strong></span>
                  <span>팔로우 <strong>0</strong></span>
                </div>
              </div>
            </div>

            <div className="profile-bio-container">
              <p className="profile-bio">{user.bio || '소개글이 없습니다.'}</p>
            </div>
          </div>
        </section>

        {isFarmer && (
          <section className="my-product-section">
            <div className="section-content-wrapper">
              <div className="section-header">
                <h2 className="section-title">판매 상품 ({userProducts.length})</h2>
                <Link to="/products/new" className="add-content-link">
                  <Button variant="outline">상품 등록하기</Button>
                </Link>
              </div>
              <div className="product-grid">
                {userProducts.length > 0 ? (
                  userProducts.map(product => (
                    <div key={product.id} className="product-card-wrapper">
                      <ProductCard
                        product={product}
                        hideFarmerProfile={true}
                        isMyPage={true}
                        onEdit={openEditProductModal}
                        onDelete={handleDeleteProduct}
                      />
                      
                    </div>
                  ))
                ) : (
                  <p className="empty-message">등록된 상품이 없습니다.</p>
                )}
              </div>
            </div>
          </section>
        )}

        

        <section className="my-story-section">
          <div className="section-content-wrapper">
            <div className="section-header">
              <h2 className="section-title">재배 일지 ({userStories.length})</h2>
              {isFarmer && (
                <Link to="/stories/new" className="add-content-link">
                  <Button variant="outline">재배일지 작성하기</Button>
                </Link>
              )}
            </div>
            <div className="story-grid">
              {userStories.length > 0 ? (
                userStories.map(story => (
                  <StoryCard
                    key={story.id}
                    story={{
                      ...story,
                      farmerName: user.name,
                      farmerProfileImageUrl: user.profileImageUrl
                    }}
                    hideFarmerProfile={true}
                  />
                ))
              ) : (
                <p className="empty-message">아직 작성된 재배 일지가 없습니다.</p>
              )}
            </div>
          </div>
        </section>

        {!isFarmer && (
          <ReviewSection reviews={mockReviews} />
        )}
      </main>

      {user && (
        <EditProfileModal
          isOpen={isEditProfileModalOpen}
          onClose={closeEditProfileModal}
          currentUser={user}
          onSave={handleSaveProfile}
        />
      )}

      {user && editingProduct && (
        <EditProductModal
          isOpen={isEditProductModalOpen}
          onClose={closeEditProductModal}
          product={editingProduct}
          onSave={handleSaveProduct}
        />
      )}
    </div>
  );
};

export default MyPage;