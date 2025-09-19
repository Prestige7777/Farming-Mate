// src/components/auth/AuthForm.jsx

import React from 'react';
import Button from '../common/Button';
import './AuthForm.css';

const AuthForm = ({ isLogin, onSubmit }) => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [username, setUsername] = React.useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      onSubmit({ email, password });
    } else {
      onSubmit({ email, password, username });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <h2 className="form-title">{isLogin ? '로그인' : '회원가입'}</h2>
      {!isLogin && (
        <div className="input-group">
          <label className="input-label" htmlFor="username">
            이름
          </label>
          <input
            type="text"
            id="username"
            className="form-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required={!isLogin}
          />
        </div>
      )}
      <div className="input-group">
        <label className="input-label" htmlFor="email">
          이메일
        </label>
        <input
          type="email"
          id="email"
          className="form-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="input-group">
        <label className="input-label" htmlFor="password">
          비밀번호
        </label>
        <input
          type="password"
          id="password"
          className="form-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <Button type="submit" className="submit-btn">
        {isLogin ? '로그인' : '회원가입'}
      </Button>
    </form>
  );
};

export default AuthForm;