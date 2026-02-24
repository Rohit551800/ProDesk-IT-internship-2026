import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

export default function Home() {
  return (
    <div className="home">
      <div className="hero">
        <p className="hero-tag">New Collection 2026</p>
        <h1>DISCOVER<br /><span>EVERYTHING</span><br />YOU NEED</h1>
        <p className="hero-sub">
          Thousands of products. Unbeatable prices. Delivered fast.
        </p>
        <Link to="/shop" className="hero-btn">Browse Shop →</Link>
      </div>

      <div className="home-features">
        <div className="feature">
          <span>🚀</span>
          <h3>Fast Delivery</h3>
          <p>Orders shipped within 24 hours</p>
        </div>
        <div className="feature">
          <span>🔒</span>
          <h3>Secure Checkout</h3>
          <p>Your data is always protected</p>
        </div>
        <div className="feature">
          <span>↩️</span>
          <h3>Easy Returns</h3>
          <p>30-day hassle-free returns</p>
        </div>
      </div>
    </div>
  );
}