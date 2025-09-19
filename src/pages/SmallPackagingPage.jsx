import React, { useState, useEffect } from "react";
import ProductSection from "../components/home/ProductSection";
import { getProductsByTag, getAllFarmers } from "../utils/api";

import "./SmallPackagingPage.css";

const SmallPackagingPage = () => {
  const [smallPackagingProducts, setSmallPackagingProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [products, farmers] = await Promise.all([
          getProductsByTag("소포장"),
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
        setSmallPackagingProducts(productsWithFarmerInfo);
      } catch (err) {
        setError(err.message);
        console.error("Failed to fetch small packaging products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="small-packaging-page">
      <h1 className="page-title">파밍메이트 소포장 상품</h1>
      {loading ? (
        <p>데이터를 불러오는 중...</p>
      ) : error ? (
        <p>오류: {error}</p>
      ) : (
        <div className="small-packaging-products-section">
          <ProductSection products={smallPackagingProducts} pageSize={12} />
        </div>
      )}
    </div>
  );
};

export default SmallPackagingPage;