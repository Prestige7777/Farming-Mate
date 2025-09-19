// src/components/common/Footer.jsx

import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="site-footer new-style">
      <div className="footer-container">
        <div className="footer-links">
          <a href="#" className="footer-link">회사소개</a>
          <a href="#" className="footer-link">이용약관</a>
          <a href="#" className="footer-link">개인정보처리방침</a>
          <a href="#" className="footer-link">고객센터</a>
          <a href="#" className="footer-link">FAQ</a>
        </div>
        <p className="footer-info">
          © 2025 Farming Mate. All rights reserved. | 주소: 서울 강남구 삼성로91길 36 4층 | 대표: 곽상윤 / 이평안 | 이메일: contact@farmingmate.com | 고객센터: 1588-XXXX
        </p>
      </div>
    </footer>
  );
};

export default Footer;