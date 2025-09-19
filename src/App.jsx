import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';

import SmallPackagingPage from './pages/SmallPackagingPage';
import OrganicPage from './pages/OrganicPage';
import EcoFriendlyPage from './pages/EcoFriendlyPage';

// 페이지
import HomePage from './pages/HomePage';
import ProductListPage from './pages/ProductListPage';
import ProductDetailPage from './pages/ProductDetailPage';
import StoryFeedPage from './pages/StoryFeedPage';
import StoryDetailPage from './pages/StoryDetailPage';





import FarmerProfilePage from './pages/FarmerProfilePage';
import FarmerPublicProfilePage from './pages/FarmerPublicProfilePage';
import CartPage from './pages/CartPage';
import MyPage from './pages/MyPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ProfilePage from './pages/ProfilePage';
import NewProductPage from './pages/NewProductPage';
import NewStoryPage from './pages/NewStoryPage';
import WishlistPage from './pages/WishlistPage';
import SeasonalFruitspage from './pages/SeasonalFruitspage';
import VeggieSubscriptionPage from './pages/subscriptions/VeggieSubscriptionPage';
import GroupBuyListPage from './pages/groupbuy/GroupBuyListPage';
import PackagingStoryPage from './pages/stories/PackagingStoryPage';
import ReviewsEventPage from './pages/reviews/ReviewsEventPage';
import PremiumPage from './pages/PremiumPage';
import MyNewsPage from './pages/MyNewsPage';
import PaymentPage from './pages/PaymentPage';
import TransactionHistoryPage from './pages/TransactionHistoryPage';

// 관리자 페이지
import AdminDashboard from './pages/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import ProductManagement from './pages/admin/ProductManagement';
import VerificationManagement from './pages/admin/VerificationManagement';
import ContentManagement from './pages/admin/ContentManagement';
import ReportManagementPage from './pages/admin/ReportManagementPage';

// 설정 및 신고 페이지
import SettingsPage from './pages/SettingsPage';
import ReportProblemPage from './pages/ReportProblemPage';

// 레이아웃 & 보호 라우트
import SidebarLayout from './layouts/SidebarLayout';
import ProtectedRoute from './app/router/ProtectedRoute';
import AdminRoute from './app/router/AdminRoute';
import AdminLayout from './layouts/AdminLayout';
import CartSidebar from './components/marketplace/CartSidebar';

function App() {
  return (
    <CartProvider>
      <AppContent />
    </CartProvider>
  );
}

function AppContent() {
  return (
    <>
      <Routes>
        {/* 🔐 관리자 전용 라우트 */}
        <Route element={<AdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<UserManagement />} />
            <Route path="/admin/products" element={<ProductManagement />} />
            <Route path="/admin/verifications" element={<VerificationManagement />} />
            <Route path="/admin/content" element={<ContentManagement />} />
            <Route path="/admin/reports" element={<ReportManagementPage />} />
          </Route>
        </Route>

        {/* 🌐 비로그인 접근 가능 페이지 (사이드바 없음) */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* 👤 모든 사용자용 라우트 (사이드바 포함) */}
        <Route element={<SidebarLayout />}>
          {/* 비로그인 사용자도 접근 가능한 페이지 (사이드바 포함) */}
          <Route path="/" element={<HomePage />} />
          <Route path="/small-packaging" element={<SmallPackagingPage />} />
          <Route path="/organic" element={<OrganicPage />} />
          <Route path="/eco-friendly" element={<EcoFriendlyPage />} />
          <Route path="/farmers/:farmerId/public" element={<FarmerPublicProfilePage />} />
          <Route path="/products/:productId" element={<ProductDetailPage />} />
          <Route path="/products" element={<ProductListPage />} />
          <Route path="/stories" element={<StoryFeedPage />} />
          <Route path="/stories/:storyId" element={<StoryDetailPage />} />
          <Route path="/seasonal-fruits" element={<SeasonalFruitspage />} />
          <Route path="/subscriptions/veggies" element={<VeggieSubscriptionPage />} />
          <Route path="/group-buy" element={<GroupBuyListPage />} />
          <Route path="/stories/packaging" element={<PackagingStoryPage />} />
          <Route path="/reviews/event" element={<ReviewsEventPage />} />
          <Route path="/premium" element={<PremiumPage />} />
          <Route path="/mynews" element={<MyNewsPage />} />

          {/* 🔐 로그인 사용자만 접근 가능한 페이지 (사이드바 포함) */}
          <Route element={<ProtectedRoute />}>
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/report-problem" element={<ReportProblemPage />} />
            <Route path="/farmers/:farmerId" element={<FarmerProfilePage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/mypage" element={<MyPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/products/new" element={<NewProductPage />} />
            <Route path="/stories/new" element={<NewStoryPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/purchasesales" element={<TransactionHistoryPage />} />
          </Route>
        </Route>
      </Routes>
      <CartSidebar />
    </>
  );
}

export default App;
