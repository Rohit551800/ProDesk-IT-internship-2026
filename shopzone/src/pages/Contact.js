import React, { useState } from 'react';
import './Contact.css';

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="contact-page">
      <div className="contact-layout">
        <div className="contact-info">
          <h1>GET IN<br /><span>TOUCH</span></h1>
          <p>Have questions about an order or product? We're here to help.</p>
          <div className="contact-details">
            <p>📧 support@shopzone.com</p>
            <p>📞 1-800-SHOPZONE</p>
            <p>🕐 Mon–Fri, 9am–6pm EST</p>
          </div>
        </div>

        <div className="contact-form-wrap">
          {submitted ? (
            <div className="success-msg">
              <h2>✓ Message Sent!</h2>
              <p>We'll get back to you within 24 hours.</p>
            </div>
          ) : (
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name</label>
                <input type="text" placeholder="Your name" required />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" placeholder="you@example.com" required />
              </div>
              <div className="form-group">
                <label>Subject</label>
                <input type="text" placeholder="How can we help?" required />
              </div>
              <div className="form-group">
                <label>Message</label>
                <textarea rows="5" placeholder="Tell us more..." required></textarea>
              </div>
              <button type="submit" className="send-btn">Send Message →</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}