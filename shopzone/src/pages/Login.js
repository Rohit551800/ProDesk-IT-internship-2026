import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Login.css';

export default function Login() {
  const { login, isLoggedIn } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/checkout';

  if (isLoggedIn) {
    navigate(from, { replace: true });
    return null;
  }

  const handleLogin = () => {
    login();
    navigate(from, { replace: true });
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>SHOPZONE</h1>
        <p className="login-subtitle">Sign in to continue</p>

        <div className="login-info">
          <p>🔒 Protected checkout requires authentication.</p>
          <p>No account? No problem — try guest mode!</p>
        </div>

        <button className="guest-btn" onClick={handleLogin}>
          Continue as Guest →
        </button>
      </div>
    </div>
  );
}