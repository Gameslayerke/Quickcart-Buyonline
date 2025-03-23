import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from './AuthContext';
import axios from 'axios';
import './Profile.css';
import Loader from './Loader';
import { FaShoppingCart, FaHeart, FaBell } from 'react-icons/fa';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [userDetails, setUserDetails] = useState({ name: '', email: '' });
  const [orders, setOrders] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        console.log('User Object:', user); 
        const userId = user?.user_id; 
        if (!userId) {
          setError('User ID not found. Please log in.');
          setLoading(false);
          return;
        }

        const userResponse = await axios.get(`https://alvins.pythonanywhere.com/api/users/${userId}`);
        console.log('User Details Response:', userResponse); // Log the entire response
        setUserDetails({
          name: userResponse.data.username || userResponse.data.name, // Use the correct key
          email: userResponse.data.email,
        });

        const ordersResponse = await axios.get(`https://alvins.pythonanywhere.com/api/orders?userId=${userId}`);
        console.log('Orders Response:', ordersResponse); 
        setOrders(ordersResponse.data);

        const wishlistResponse = await axios.get(`https://alvins.pythonanywhere.com/api/wishlist/user/${userId}`);
        console.log('Wishlist Response:', wishlistResponse);
        setWishlist(wishlistResponse.data);

        const notificationsResponse = await axios.get(`https://alvins.pythonanywhere.com/notifications/user/${userId}`);
        console.log('Notifications Response:', notificationsResponse); 
        setNotifications(notificationsResponse.data);

        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch profile data:', err);
        setError('Failed to load profile data. Please try again later.');
        setLoading(false); 
      }
    };

    fetchProfileData();
  }, [user]);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="profile-container">
      <h1>Profile</h1>

      {}
      <div className="user-info-section">
        <img
          src="https://via.placeholder.com/150" 
          alt="Profile"
          className="profile-picture"
        />
        <p><strong>Name:</strong> {userDetails.name}</p>
        <p><strong>Email:</strong> {userDetails.email}</p>
      </div>

      {}
      <div className="order-history-section">
        <h2><FaShoppingCart /> Order History</h2>
        {orders.length > 0 ? (
          <ul>
            {orders.map((order) => (
              <li key={order.order_id}>
                Order #{order.order_id} - ${order.total_price} - {order.order_status}
              </li>
            ))}
          </ul>
        ) : (
          <p>No orders found.</p>
        )}
      </div>

      {}
      <div className="wishlist-section">
        <h2><FaHeart /> Wishlist</h2>
        {wishlist.length > 0 ? (
          <ul>
            {wishlist.map((item) => (
              <li key={item.wishlist_id}>
                {item.product_name} - ${item.price}
              </li>
            ))}
          </ul>
        ) : (
          <p>Your wishlist is empty.</p>
        )}
      </div>

      {}
      <div className="notifications-section">
        <h2><FaBell /> Notifications</h2>
        {notifications.length > 0 ? (
          <ul>
            {notifications.map((notification) => (
              <li key={notification.notification_id}>
                {notification.message}
              </li>
            ))}
          </ul>
        ) : (
          <p>No new notifications.</p>
        )}
      </div>
    </div>
  );
};

export default Profile;