// src/components/story/StoryCard.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { DEFAULT_IMAGE_URL } from '../../utils/constants';
import { useAuth } from '../auth/AuthProvider';
import './StoryCard.css';

const StoryCard = ({ story, hideFarmerProfile }) => {
  const { user } = useAuth();
  const profileLink = user && user.id === story.farmerId ? '/mypage' : `/farmers/${story.farmerId}/public`;

  const KebabIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 8C13.1 8 14 7.1 14 6C14 4.9 13.1 4 12 4C10.9 4 10 4.9 10 6C10 7.1 10.9 8 12 8ZM12 10C10.9 10 10 10.9 10 12C10 13.1 10.9 14 12 14C13.1 14 14 13.1 14 12C14 10.9 13.1 10 12 10ZM12 16C10.9 16 10 16.9 10 18C10 19.1 10.9 20 12 20C13.1 20 14 19.1 14 18C14 16.9 13.1 16 12 16Z" fill="#555"/>
    </svg>
  );

  return (
    <div className="story-card">
      {!hideFarmerProfile && (
        <div className="story-header">
          <Link to={profileLink} className="farmer-info-link">
            <img src={story.farmerProfileImageUrl || DEFAULT_IMAGE_URL} alt={story.farmerName} className="farmer-profile-image" />
            <div className="farmer-details">
              <span className="farmer-name">{story.farmerName} 농부님</span>
              <span className="separator">.</span>
              <span className="story-date">{new Date(story.date).toLocaleDateString('ko-KR', { month: 'numeric', day: 'numeric' })}</span>
            </div>
          </Link>
          <button className="story-options-button">
            <KebabIcon />
          </button>
        </div>
      )}
      
      <Link to={`/stories/${story.id}`} className="story-card-link">
        <img
          src={story.images && story.images.length > 0 ? story.images[0] : DEFAULT_IMAGE_URL}
          alt={story.title}
          className="story-image"
        />
      </Link>

      <div className="story-body-content">
        <h3 className="story-title">
          {story.title}
        </h3>
      </div>

      <div className="story-footer">
        <p className="story-content-snippet">{story.content.substring(0, 100)}...</p>
      </div>

      <div className="story-stats">
        <span>
          <svg viewBox="0 0 24 24" aria-hidden="true" width="1em" height="1em" fill="currentColor" style={{ verticalAlign: 'middle', marginRight: '4px' }}>
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
          {story.likes ? story.likes.length : 0}
        </span>
        <span>
          <svg viewBox="0 0 24 24" aria-hidden="true" width="1em" height="1em" fill="currentColor" style={{ verticalAlign: 'middle', marginRight: '4px' }}>
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V2zm0 14H6l-2 2V4h16v12z" />
          </svg>
          {story.comments ? story.comments.length : 0}
        </span>
      </div>
    </div>
  );
};

export default StoryCard;
