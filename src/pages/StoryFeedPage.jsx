// src/pages/StoryFeedPage.jsx

import React, { useState, useEffect } from 'react';
import StoryCard from '../components/story/StoryCard';
import { getAllStories, getAllFarmers } from '../utils/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import './StoryFeedPage.css';

const StoryFeedPage = () => {
  const [storiesWithFarmerInfo, setStoriesWithFarmerInfo] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        setLoading(true);
        const [stories, farmers] = await Promise.all([
          getAllStories(),
          getAllFarmers(),
        ]);

        const storiesWithInfo = stories.map(story => {
          const farmer = farmers.find(f => f.id === story.farmerId);
          return {
            ...story,
            farmerName: farmer ? farmer.name : '알 수 없는 농부',
            farmerProfileImageUrl: farmer ? farmer.profileImageUrl : 'https://placehold.co/40x40/e0e0e0/333?text=User',
          };
        });

        setStoriesWithFarmerInfo(storiesWithInfo);
      } catch (error) {
        console.error("Failed to fetch stories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="story-feed-page">
      <main className="story-feed-main">
        <h1 className="page-title">📸 파밍 스토리</h1>
        <p className="page-subtitle">농부들의 생생한 일상과 작물 재배 과정을 만나보세요!</p>
        <div className="story-grid">
          {storiesWithFarmerInfo.length === 0 ? (
            <p className="empty-message">아직 작성된 스토리가 없습니다.</p>
          ) : (
            storiesWithFarmerInfo.map(story => (
              <StoryCard key={story.id} story={story} />
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default StoryFeedPage;