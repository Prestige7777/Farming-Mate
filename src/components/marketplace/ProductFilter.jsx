// src/components/marketplace/ProductFilter.jsx

import React from 'react';
import Button from '../common/Button';
import './ProductFilter.css';

const ProductFilter = ({ onFilterChange }) => {
  const categories = ['전체', '채소', '과일', '곡물', '가공품'];
  const farmingMethods = ['전체', '유기농', '친환경', '스마트팜'];

  const [selectedCategory, setSelectedCategory] = React.useState('전체');
  const [selectedMethod, setSelectedMethod] = React.useState('전체');

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    onFilterChange({ category, method: selectedMethod });
  };

  const handleMethodChange = (method) => {
    setSelectedMethod(method);
    onFilterChange({ category: selectedCategory, method });
  };

  return (
    <div className="product-filter-container">
      <h3 className="filter-title">상품 필터</h3>
      <div className="filter-section">
        <h4 className="filter-subtitle">카테고리</h4>
        <div className="filter-buttons">
          {categories.map(category => (
            <Button
              key={category}
              onClick={() => handleCategoryChange(category)}
              variant={selectedCategory === category ? 'primary' : 'secondary'}
              className="filter-button"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>
      <div className="filter-section">
        <h4 className="filter-subtitle">재배 방식</h4>
        <div className="filter-buttons">
          {farmingMethods.map(method => (
            <Button
              key={method}
              onClick={() => handleMethodChange(method)}
              variant={selectedMethod === method ? 'primary' : 'secondary'}
              className="filter-button"
            >
              {method}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductFilter;