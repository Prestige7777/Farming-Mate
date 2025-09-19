import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getUserById, getProductsByFarmerId, getAllStories } from '../utils/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ProductCard from '../components/marketplace/ProductCard';
import StoryCard from '../components/story/StoryCard';
import { DEFAULT_IMAGE_URL } from '../utils/constants';
import './FarmerPublicProfilePage.css';

const FarmerPublicProfilePage = () => {
  const { farmerId } = useParams();
  console.log("FarmerPublicProfilePage - farmerId from useParams:", farmerId);
  const [farmer, setFarmer] = useState(null);
  const [products, setProducts] = useState([]);
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const fetchedFarmer = await getUserById(farmerId);
        if (!fetchedFarmer) {
          setError('해당 ID의 농부를 찾을 수 없습니다.');
          setLoading(false);
          return;
        }
        if (fetchedFarmer.role !== 'farmer') {
          setError('이 사용자는 농부가 아닙니다.');
          setLoading(false);
          return;
        }
        setFarmer(fetchedFarmer);

        const [fetchedProducts, allStories] = await Promise.all([
          getProductsByFarmerId(farmerId),
          getAllStories(),
        ]);

        setProducts(fetchedProducts);
        const farmerStories = allStories.filter(story => story.farmerId === farmerId);
        setStories(farmerStories);

      } catch (err) {
        setError('농부 정보를 불러오는 데 실패했습니다.');
        console.error("Failed to fetch farmer public profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [farmerId]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div className="farmer-public-profile-error">{error}</div>;
  }

  if (!farmer) {
    return <div className="farmer-public-profile-not-found">농부를 찾을 수 없습니다.</div>;
  }

  return (
    <div className="my-page">
      {/* 1. 프로필 배너 섹션 (MyPage와 동일 구조) */}
      <section 
        className="profile-banner"
        style={{ backgroundImage: `url(${farmer.profileBgUrl || DEFAULT_IMAGE_URL})` }}
      >
        <div className="profile-banner-content">
          <h1 className="profile-banner-title">{farmer.farmName || farmer.name}</h1>
          {farmer.location && <p className="profile-banner-location">{farmer.location}</p>}
        </div>
      </section>

      <main className="my-page-main">
        {/* 2. 프로필 상세 정보 섹션 (MyPage와 동일 구조) */}
        <section className="profile-details">
          <div className="profile-details-content">
            <div className="profile-header">
              <div className="profile-avatar-container">
                <img
                  src={farmer.profileImageUrl || DEFAULT_IMAGE_URL}
                  alt={`${farmer.name} 프로필 이미지`}
                  className="profile-avatar-img"
                />
              </div>

              <div className="profile-meta">
                <div className="profile-meta-top">
                  <h2 className="profile-name-details">
                    <span className="farmer-name">{farmer.name}</span>
                    <span className="farmer-title">농부님</span>
                  </h2>
                  {/* 편집 버튼 없음 */}
                </div>
                
                <div className="profile-stats">
                  <span>게시물 <strong>{products.length + stories.length}</strong></span>
                  <span>팔로워 <strong>{120}</strong></span> {/* 임시 데이터 */}
                  <span>팔로우 <strong>{50}</strong></span> {/* 임시 데이터 */}
                </div>
              </div>
            </div>

            <div className="profile-bio-container">
              <p className="profile-bio">{farmer.bio || '소개글이 없습니다.'}</p>
            </div>
          </div>
        </section>

        {/* 2. 판매 상품 영역 */}
        <section className="my-product-section">
          <div className="section-content-wrapper">
            <div className="section-header">
              <h2 className="section-title">{farmer.name} 농부님의 상품 ({products.length})</h2>
              {/* 상품 등록하기 버튼 없음 */}
            </div>
            <div className="product-grid">
              {products.length === 0 ? (
                <p className="empty-message">등록된 상품이 없습니다.</p>
              ) : (
                products.map(product => (
                  <ProductCard key={product.id} product={product} hideFarmerProfile={true} />
                ))
              )}
            </div>
          </div>
        </section>

        {/* 3. 재배 일지 영역 */}
        <section className="my-story-section">
          <div className="section-content-wrapper">
            <div className="section-header">
              <h2 className="section-title">{farmer.name} 농부님의 재배 일지 ({stories.length})</h2>
              {/* 재배일지 작성하기 버튼 없음 */}
            </div>
            <div className="story-grid">
              {stories.length === 0 ? (
                <p className="empty-message">작성된 재배 일지가 없습니다.</p>
              ) : (
                stories.map(story => (
                  <StoryCard key={story.id} story={story} hideFarmerProfile={true} />
                ))
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default FarmerPublicProfilePage;