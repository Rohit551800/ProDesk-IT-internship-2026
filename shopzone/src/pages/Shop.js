import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Shop.css';

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('https://dummyjson.com/products?limit=30')
      .then((r) => r.json())
      .then((data) => {
        setProducts(data.products);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load products.');
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="page-status">Loading products...</div>;
  if (error) return <div className="page-status error">{error}</div>;

  return (
    <div className="shop">
      <div className="shop-header">
        <h1>ALL PRODUCTS</h1>
        <p>{products.length} items found</p>
      </div>

      <div className="products-grid">
        {products.map((product) => (
          <Link to={`/product/${product.id}`} key={product.id} className="product-card">
            <div className="product-img">
              <img src={product.thumbnail} alt={product.title} />
            </div>
            <div className="product-info">
              <p className="product-category">{product.category}</p>
              <h3 className="product-title">{product.title}</h3>
              <p className="product-price">${product.price.toFixed(2)}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}