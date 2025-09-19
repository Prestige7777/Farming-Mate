// src/pages/LoginPage.jsx

import React from 'react';
import AuthForm from '../components/auth/AuthForm';
import { useAuth } from '../components/auth/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './AuthPage.css'; // SignupPage와 공통 CSS 사용

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async ({ email, password }) => {
    const result = await login(email, password);
    if (result.success) {
      alert(`${result.user.name}님 환영합니다!`);
      navigate('/');
    } else {
      alert(result.message);
    }
  };

  return (
    <div className="auth-page">
      <main className="auth-main">
        <AuthForm isLogin={true} onSubmit={handleLogin} />
        <p className="auth-link-text">
          계정이 없으신가요? <Link to="/signup" className="auth-link">회원가입</Link>
        </p>
      </main>
    </div>
  );
};

export default LoginPage;