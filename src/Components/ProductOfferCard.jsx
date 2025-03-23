import React, { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom"; // Added Link
import axios from "axios";
import "./ProductOfferCard.css";

const ProductOfferCard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Get the product data from location.state
  const { product } = location.state || {};

  if (!product) {
    navigate("/"); 
    return null;
  }

  const validatePhoneNumber = (phone) => /^254\d{9}$/.test(phone);

  const handleBuyNow = async () => {
    const user_id = localStorage.getItem("user_id"); // Check if the user is logged in

    if (!user_id) {

      navigate("/signin", { state: { from: "product-offer", productId: product.id } });
      return;
    }

    setPaymentError(""); 
    setPaymentSuccess(false);

    if (!phone) {
      setPaymentError("Please enter your phone number.");
      return;
    }
    if (!validatePhoneNumber(phone)) {
      setPaymentError("Invalid phone number. Use format: 2547XXXXXXXX.");
      return;
    }

    setPaymentLoading(true);

    try {
      const formData = new URLSearchParams();
      formData.append("amount", product.original_price);
      formData.append("phone", phone);

      const response = await axios.post(
        "https://alvins.pythonanywhere.com/api/mpesa_payment",
        formData,
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
      );

      if (response.data.success) {
        setPaymentSuccess(true);
      } else {
        setPaymentError(response.data.message || "Payment failed. Try again.");
      }
    } catch (err) {
      setPaymentError("An error occurred. Please try again.");
    } finally {
      setPaymentLoading(false);
    }
  };

  return (
    <div className="product-offer-card-container">
      <div className="product-offer-image-section">
        <img src={product.image_url} alt={product.title} className="product-offer-image" />
      </div>

      <div className="product-offer-details-section">
        <h1 className="product-offer-title">{product.title}</h1>
        <p className="product-offer-description">{product.description}</p>

        <div className="product-offer-prices">
          <span className="original-price">Original Price: KSh {product.original_price}</span>
          <span className="discounted-price">Discounted Price: KSh {product.discounted_price}</span>
          <span className="discount-percentage">{product.discount_percentage}% OFF</span>
        </div>

        <div className="payment-section">
          {!localStorage.getItem("user_id") ? (
            <p className="login-prompt">
              You must be <Link to="/signin" state={{ from: "product-offer", productId: product.id }}>logged in</Link> to proceed with payment.
            </p>
          ) : (
            <>
              <p>Enter your phone number to pay via M-Pesa:</p>
              <input
                type="text"
                placeholder="2547XXXXXXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="phone-input"
              />
              {paymentError && <p className="error-message">{paymentError}</p>}
              {paymentSuccess && (
                <p className="success-message">Payment initiated! Check your phone.</p>
              )}
            </>
          )}
        </div>

        <div className="product-offer-actions">
          <button
            className="buy-now-btn"
            onClick={handleBuyNow}
            disabled={paymentLoading || !localStorage.getItem("user_id")} 
          >
            {paymentLoading ? <span className="spinner"></span> : "Buy Now"}
          </button>
        </div>

        <button className="back-btn" onClick={() => navigate("/")}>
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default ProductOfferCard;