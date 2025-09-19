import React, { useState, useEffect } from "react";
import ProductSection from "../components/home/ProductSection";
import { getProductsByTag, getAllFarmers } from "../utils/api";

import "./OrganicPage.css";

const OrganicPage = () => {
  const [organicProducts, setOrganicProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [products, farmers] = await Promise.all([
          getProductsByTag("유기농"),
          getAllFarmers(),
        ]);

        const productsWithFarmerInfo = products.map(product => {
          const farmer = farmers.find(f => f.id === product.farmerId);
          return {
            ...product,
            farmerProfileImageUrl: farmer?.profileImageUrl || '',
            farmName: farmer?.farmName || '',
            farmerName: farmer?.name || product.farmerName,
          };
        });
        setOrganicProducts(productsWithFarmerInfo);
      } catch (err) {
        setError(err.message);
        console.error("Failed to fetch organic products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="organic-page">
      <h1 className="page-title">파밍메이트 유기농 상품</h1>
      {loading ? (
        <p>데이터를 불러오는 중...</p>
      ) : error ? (
        <p>오류: {error}</p>
      ) : (
        <div className="organic-products-section">
          <ProductSection products={organicProducts} pageSize={12} />
        </div>
      )}
    </div>
  );
};

export default OrganicPage;