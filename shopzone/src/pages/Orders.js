import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Orders.css';

export default function Orders() {
  const { orders } = useCart();

  if (orders.length === 0) {
    return (
      <div className="orders-empty">
        <div className="empty-icon">📦</div>
        <h2>No Orders Yet</h2>
        <p>Once you place an order, it will appear here.</p>
        <Link to="/shop" className="browse-btn">Start Shopping →</Link>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="orders-header">
        <h1>MY ORDERS</h1>
        <p>{orders.length} order{orders.length > 1 ? 's' : ''} placed</p>
      </div>

      <div className="orders-list">
        {orders.map((order) => (
          <div className="order-card" key={order.id}>
            <div className="order-card-header">
              <div>
                <p className="order-id">Order #{order.id}</p>
                <p className="order-date">{order.date}</p>
              </div>
              <div className="order-status">
                <span className="status-badge">{order.status}</span>
                <p className="order-total-label">Total: <strong>${order.total.toFixed(2)}</strong></p>
              </div>
            </div>

            <div className="order-items-list">
              {order.items.map((item) => (
                <div className="order-line" key={item.id}>
                  <img src={item.thumbnail} alt={item.title} />
                  <div className="order-line-info">
                    <p className="order-line-title">{item.title}</p>
                    <p className="order-line-meta">
                      Qty: {item.qty} &nbsp;·&nbsp; ${item.price.toFixed(2)} each
                    </p>
                  </div>
                  <p className="order-line-subtotal">${(item.price * item.qty).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}