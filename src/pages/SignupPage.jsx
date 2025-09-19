// src/pages/SignupPage.jsx

import React from 'react';
import AuthForm from '../components/auth/AuthForm';
import { useAuth } from '../components/auth/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './AuthPage.css';

const SignupPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSignup = async (userData) => {
    const result = await register(userData);
    if (result.success) {
      alert(result.message);
      navigate('/login');
    } else {
      alert(result.message);
    }
  };

  return (
    <div className="auth-page">
      <main className="auth-main">
        <AuthForm isLogin={false} onSubmit={handleSignup} />
        <p className="auth-link-text">
          이미 계정이 있으신가요? <Link to="/login" className="auth-link">로그인</Link>
        </p>
      </main>
    </div>
  );
};

export default SignupPage;