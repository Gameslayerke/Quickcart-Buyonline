import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CountdownTimer from "./CountdownTimer"; // Import the timer component
import "./Offer.css";

const Offer = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await fetch(
          "https://alvins.pythonanywhere.com/api/getOfferProducts"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch offers");
        }
        const data = await response.json();

        // Add startTime to each offer
        const offersWithStartTime = data.offers.map((offer) => ({
          ...offer,
          startTime: new Date().toISOString(), // Current time
        }));

        setOffers(offersWithStartTime);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
  }, []);

  const handleOfferClick = (offer) => {
    navigate(`/productoffercard/${offer.id}`, { state: { product: offer } });
  };

  if (loading) {
    return <div className="loading">Loading offers...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="offer-container">
      <h1 className="offer-heading">Special Offers</h1>
      <div className="offer-list">
        {offers.map((offer) => (
          <div key={offer.id} className="offer-card">
            <div className="offer-image">
              <img src={offer.image_url} alt={offer.title} />
            </div>
            <div className="offer-details">
              <h2 className="offer-title">{offer.title}</h2>
              <p className="offer-description">{offer.description}</p>
              <div className="offer-prices">
                <span className="original-price">
                  Original Price: Ksh {offer.original_price}
                </span>
                <span className="discounted-price">
                  Discounted Price: Ksh {offer.discounted_price}
                </span>
              </div>
              <div className="offer-discount">
                <button
                  className="discount-badge"
                  onClick={() => handleOfferClick(offer)}
                >
                  {offer.discount_percentage}% OFF
                </button>
              </div>
              {/* Add the Countdown Timer */}
              <div className="offer-timer">
                <CountdownTimer startTime={offer.startTime} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Offer;