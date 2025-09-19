// src/components/common/Button.jsx

import React from 'react';
import './Button.css';

const Button = ({ children, onClick, className = '', variant = 'primary', ...props }) => {
  const variantClass = `btn-${variant}`;

  return (
    <button
      onClick={onClick}
      className={`btn ${variantClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;