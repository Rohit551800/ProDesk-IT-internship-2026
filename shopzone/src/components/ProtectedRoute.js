import React from 'react';
import { Navigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function ProtectedRoute({ children }) {
  const { isLoggedIn } = useCart();
  return isLoggedIn ? children : <Navigate to="/login" replace />;
}