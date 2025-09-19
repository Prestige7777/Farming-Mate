import React, { useState, useEffect } from "react";
import ProductSection from "../components/home/ProductSection";
import { getProductsByTag, getAllFarmers } from "../utils/api";

import "./EcoFriendlyPage.css";

const EcoFriendlyPage = () => {
  const [ecoFriendlyProducts, setEcoFriendlyProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [products, farmers] = await Promise.all([
          getProductsByTag("친환경"),
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
        setEcoFriendlyProducts(productsWithFarmerInfo);
      } catch (err) {
        setError(err.message);
        console.error("Failed to fetch eco-friendly products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (    <div className="eco-friendly-page">
      <h1 className="page-title">파밍메이트 친환경 상품</h1>
      {loading ? (
        <p>데이터를 불러오는 중...</p>
      ) : error ? (
        <p>오류: {error}</p>
      ) : (
        <div className="eco-friendly-products-section">
          <ProductSection products={ecoFriendlyProducts} pageSize={12} />
        </div>
      )}
    </div>
  );
};

export default EcoFriendlyPage;