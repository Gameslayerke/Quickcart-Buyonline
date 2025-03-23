import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";
import "./Wishlist.css";

const Wishlist = () => {
  const { user } = useContext(AuthContext);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchWishlist = async () => {
      if (!user) return; 

      try {
        const response = await axios.get(
          `https://alvins.pythonanywhere.com/api/wishlist/user/${user.user_id}`
        );
        setWishlist(response.data);
      } catch (error) {
        setError("Failed to fetch wishlist. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [user]);

  const handleRemoveItem = async (wishlistId) => {
    try {
      await axios.delete(`https://alvins.pythonanywhere.com/api/wishlist/${wishlistId}`);
      setWishlist(wishlist.filter((item) => item.wishlist_id !== wishlistId)); // Update state after deletion
    } catch (error) {
      setError("Failed to remove item. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
        <p>Loading wishlist...</p>
      </div>
    );
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="wishlist-container">
      <h2>Your Wishlist</h2>
      {wishlist.length === 0 ? (
        <p>No items in your wishlist.</p>
      ) : (
        <ul className="wishlist-list">
          {wishlist.map((item) => (
            <li key={item.wishlist_id} className="wishlist-item">
              <div className="item-details">
                <p><strong>Product Name:</strong> {item.product_name}</p>
                <p><strong>Price:</strong> ${item.price}</p>
                <p><strong>Added On:</strong> {new Date(item.created_at).toLocaleString()}</p>
              </div>
              <button
                className="remove-button"
                onClick={() => handleRemoveItem(item.wishlist_id)}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Wishlist;
