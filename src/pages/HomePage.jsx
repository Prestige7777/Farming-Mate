// src/pages/HomePage.jsx

import React, { useState, useEffect } from "react";
import Masonry from 'react-masonry-css';
import MainSlider from "../components/home/MainSlider";
import QuickActions from "../components/home/QuickActions";
import ProductSection from "../components/home/ProductSection";
import StoryCard from "../components/story/StoryCard";
import { getFeaturedProducts, getAllFarmers, getAllStories } from "../utils/api";
import logoImage from '../assets/icons/로고누끼.png';
import "./HomePage.css";
import "../styles/home/Slider.css";
import "../styles/home/quick-actions.css";
import "../styles/home/products.css";

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [popularStories, setPopularStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [products, farmers, stories] = await Promise.all([
          getFeaturedProducts(),
          getAllFarmers(),
          getAllStories(),
        ]);

        const productsWithFarmerInfo = products.map(product => {
          const farmer = farmers.find(f => f.id == product.farmerId);
          return {
            ...product,
            farmerProfileImageUrl: farmer?.profileImageUrl || '',
            farmName: farmer?.farmName || '',
            farmerName: farmer?.name || product.farmerName,
          };
        });
        setFeaturedProducts(productsWithFarmerInfo);

        const storiesWithFarmerInfo = stories.map(story => {
          const farmer = farmers.find(f => f.id === story.farmerId);
          return {
            ...story,
            farmerName: farmer ? farmer.name : '알 수 없는 농부',
            farmerProfileImageUrl: farmer ? farmer.profileImageUrl : 'https://placehold.co/40x40/e0e0e0/333?text=User',
          };
        });
        
        const sortedStories = storiesWithFarmerInfo.sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0));
        setPopularStories(sortedStories.slice(0, 9));

      } catch (err) {
        setError(err.message);
        console.error("Failed to fetch homepage data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const breakpointColumnsObj = {
    default: 3,
    992: 2,
    576: 1
  };

  return (
    <div className="home-page">
      <section className="home-hero-section">
          
        <MainSlider autoPlay={true} interval={6000} />
        <div className="home-quick-actions-container">
          <QuickActions />
        </div>
      </section>
      
      <main className="home-main">
        <div className="section-separator"></div>

        {loading ? (
          <p>데이터를 불러오는 중...</p>
        ) : error ? (
          <p>오류: {error}</p>
        ) : (
          <>
            <div id="recommended-products" className="highlight-section">
              <ProductSection products={featuredProducts} pageSize={6} />
            </div>
            <div className="section-separator"></div>
            <section id="popular-stories-section" className="popular-stories-section">
              <h2 className="section-title">인기 재배일지</h2>
              {popularStories.length === 0 ? (
                <p className="empty-message">아직 작성된 스토리가 없습니다.</p>
              ) : (
                <Masonry
                  breakpointCols={breakpointColumnsObj}
                  className="my-masonry-grid"
                  columnClassName="my-masonry-grid_column"
                >
                  {popularStories.map(story => (
                    <StoryCard key={story.id} story={story} />
                  ))}
                </Masonry>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
};

export default HomePage;