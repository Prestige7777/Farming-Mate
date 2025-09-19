// src/pages/ProductListPage.jsx

import React, { useState, useEffect } from 'react';
import ProductCard from '../components/marketplace/ProductCard';
import ProductFilter from '../components/marketplace/ProductFilter';
import { getAllProducts } from '../utils/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import './ProductListPage.css';

const ProductListPage = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ category: '전체', method: '전체' });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const products = await getAllProducts();
        setAllProducts(products);
        setFilteredProducts(products);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    let tempProducts = allProducts;

    if (newFilters.category !== '전체') {
      tempProducts = tempProducts.filter(p => p.tags.includes(newFilters.category.toLowerCase()));
    }
    if (newFilters.method !== '전체') {
      tempProducts = tempProducts.filter(p => p.tags.includes(newFilters.method.toLowerCase()));
    }
    setFilteredProducts(tempProducts);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="product-list-page">
      <main className="product-list-main">
        <h1 className="page-title">모든 상품</h1>
        <div className="content-container">
          <div className="sidebar">
            <ProductFilter onFilterChange={handleFilterChange} />
          </div>
          <div className="main-content">
            {filteredProducts.length === 0 ? (
              <p className="no-products-message">
                선택하신 필터에 해당하는 상품이 없습니다.
              </p>
            ) : (
              <div className="product-grid">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductListPage;
