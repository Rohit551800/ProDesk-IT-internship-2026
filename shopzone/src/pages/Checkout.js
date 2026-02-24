import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Checkout.css';

export default function Checkout() {
  const { cart, cartTotal, placeOrder } = useCart();
  const navigate = useNavigate();

  const handlePlaceOrder = () => {
    placeOrder();
    navigate('/orders');
  };

  return (
    <div className="checkout-page">
      <h1>CHECKOUT</h1>
      <div className="checkout-layout">
        <form className="checkout-form" onSubmit={(e) => { e.preventDefault(); handlePlaceOrder(); }}>
          <h2>Shipping Details</h2>
          <div className="form-row">
            <div className="form-group">
              <label>First Name</label>
              <input type="text" placeholder="John" required />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input type="text" placeholder="Doe" required />
            </div>
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" placeholder="john@example.com" required />
          </div>
          <div className="form-group">
            <label>Address</label>
            <input type="text" placeholder="123 Main Street" required />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>City</label>
              <input type="text" placeholder="New York" required />
            </div>
            <div className="form-group">
              <label>ZIP Code</label>
              <input type="text" placeholder="10001" required />
            </div>
          </div>

          <h2>Payment</h2>
          <div className="form-group">
            <label>Card Number</label>
            <input type="text" placeholder="4242 4242 4242 4242" required />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Expiry</label>
              <input type="text" placeholder="MM/YY" required />
            </div>
            <div className="form-group">
              <label>CVV</label>
              <input type="text" placeholder="123" required />
            </div>
          </div>

          <button type="submit" className="place-order-btn">
            Place Order — ${cartTotal.toFixed(2)}
          </button>
        </form>

        <div className="order-review">
          <h2>Order Review</h2>
          {cart.map((item) => (
            <div className="order-item" key={item.id}>
              <img src={item.thumbnail} alt={item.title} />
              <div>
                <p className="order-item-title">{item.title}</p>
                <p className="order-item-meta">x{item.qty} — ${(item.price * item.qty).toFixed(2)}</p>
              </div>
            </div>
          ))}
          <div className="order-total">
            <span>Total</span>
            <span>${cartTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}