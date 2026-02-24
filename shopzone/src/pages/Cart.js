import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Cart.css';

export default function Cart() {
  const { cart, removeFromCart, updateQty, cartTotal, clearCart } = useCart();

  if (cart.length === 0) {
    return (
      <div className="cart-empty">
        <h2>Your cart is empty</h2>
        <Link to="/shop" className="shop-link">Start Shopping →</Link>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-header">
        <h1>YOUR CART</h1>
        <button className="clear-btn" onClick={clearCart}>Clear All</button>
      </div>

      <div className="cart-layout">
        <div className="cart-items">
          {cart.map((item) => (
            <div className="cart-item" key={item.id}>
              <img src={item.thumbnail} alt={item.title} />
              <div className="cart-item-info">
                <h3>{item.title}</h3>
                <p className="cart-item-price">${item.price.toFixed(2)} each</p>
              </div>
              <div className="cart-item-controls">
                <button onClick={() => updateQty(item.id, item.qty - 1)}>−</button>
                <span>{item.qty}</span>
                <button onClick={() => updateQty(item.id, item.qty + 1)}>+</button>
              </div>
              <p className="cart-item-subtotal">${(item.price * item.qty).toFixed(2)}</p>
              <button className="remove-btn" onClick={() => removeFromCart(item.id)}>✕</button>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h2>Order Summary</h2>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>${cartTotal.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span>Free</span>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <span>${cartTotal.toFixed(2)}</span>
          </div>
          <Link to="/checkout" className="checkout-btn">Proceed to Checkout →</Link>
        </div>
      </div>
    </div>
  );
}