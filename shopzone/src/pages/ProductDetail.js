import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './ProductDetail.css';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    fetch(`https://dummyjson.com/products/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const handleAdd = () => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) return <div className="page-status">Loading...</div>;
  if (!product || product.message) return <div className="page-status error">Product not found.</div>;

  return (
    <div className="product-detail">
      <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>

      <div className="pd-layout">
        <div className="pd-images">
          <img src={product.thumbnail} alt={product.title} className="pd-main-img" />
          {product.images?.slice(0, 3).map((img, i) => (
            <img key={i} src={img} alt="" className="pd-thumb" />
          ))}
        </div>

        <div className="pd-info">
          <p className="pd-category">{product.category}</p>
          <h1 className="pd-title">{product.title}</h1>
          <div className="pd-rating">
            {'★'.repeat(Math.round(product.rating))}{'☆'.repeat(5 - Math.round(product.rating))}
            <span> ({product.rating})</span>
          </div>
          <p className="pd-price">${product.price?.toFixed(2)}</p>
          {product.discountPercentage > 0 && (
            <p className="pd-discount">-{product.discountPercentage?.toFixed(1)}% off</p>
          )}
          <p className="pd-desc">{product.description}</p>
          <p className="pd-stock">
            {product.stock > 0 ? `✓ In stock (${product.stock})` : '✗ Out of stock'}
          </p>

          <button
            className={`add-btn ${added ? 'added' : ''}`}
            onClick={handleAdd}
            disabled={product.stock === 0}
          >
            {added ? '✓ Added to Cart!' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
}