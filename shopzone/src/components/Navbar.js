import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Navbar.css';

export default function Navbar() {
  const { cartCount, isLoggedIn, logout } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        SHOP<span>ZONE</span>
      </Link>

      <div className="navbar-links">
        <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>Home</NavLink>
        <NavLink to="/shop" className={({ isActive }) => isActive ? 'active' : ''}>Shop</NavLink>
        <NavLink to="/contact" className={({ isActive }) => isActive ? 'active' : ''}>Contact</NavLink>
        <NavLink to="/orders" className={({ isActive }) => isActive ? 'active' : ''}>Orders</NavLink>
        {isLoggedIn && (
          <NavLink to="/checkout" className={({ isActive }) => isActive ? 'active' : ''}>Checkout</NavLink>
        )}
      </div>

      <div className="navbar-right">
        {isLoggedIn ? (
          <button className="btn-ghost" onClick={handleLogout}>Logout</button>
        ) : (
          <Link to="/login" className="btn-ghost">Login</Link>
        )}
        <Link to="/cart" className="cart-btn">
          🛒
          {cartCount > 0 && <span className="badge">{cartCount}</span>}
        </Link>
      </div>
    </nav>
  );
}