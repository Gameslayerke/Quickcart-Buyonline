import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import WishlistDropdown from './WishlistDropdown';
import ProfileDropdown from './ProfileDropdown';
import './Navbar.css';
import { AuthContext } from './AuthContext';
import { OrdersContext } from './OrdersContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { orders } = useContext(OrdersContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [showAnnouncement, setShowAnnouncement] = useState(true);
  const [categories, setCategories] = useState([]);
  const [isCategoriesDropdownOpen, setIsCategoriesDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  console.log("User Object:", user);

  useEffect(() => {
    axios.get('https://alvins.pythonanywhere.com/categories')
      .then((response) => {
        console.log('Categories API Response:', response.data);
        setCategories(response.data);
      })
      .catch((error) => console.error("Failed to fetch categories:", error));
  }, []);

  useEffect(() => {
    if (user) {
      axios.get(`https://alvins.pythonanywhere.com/api/notifications?userId=${user.userId}`)
        .then((response) => {
          setNotifications(response.data);
          setUnreadNotifications(response.data.length);
        })
        .catch((error) => console.error("Failed to fetch notifications:", error));
    }
  }, [user]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle('dark-mode');
  };

  const toggleCategoriesDropdown = () => {
    setIsCategoriesDropdownOpen(!isCategoriesDropdownOpen);
  };

  return (
    <>
      {}
      {showAnnouncement && (
        <div className="announcement-bar">
          <p>Free Delivery on orders over Ksh.4000</p>
          <button onClick={() => setShowAnnouncement(false)}>✕</button>
        </div>
      )}

      {}
      <nav className="navbar">
        {}
        <div className="navbar-brand">
          <span className="brand-logo">🛒</span>
          <span className="brand-name">Quick Cart</span>
        </div>

        {}
        <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? '✕' : '☰'}
        </button>

        {}
        <ul className={`navbar-links ${isMobileMenuOpen ? 'active' : ''}`}>
          <li><Link to="/" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>Home</Link></li>
          <li>
            {}
            <div className="categories-dropdown">
              <button className="categories-dropdown-button" onClick={toggleCategoriesDropdown}>
                Categories
              </button>
              {isCategoriesDropdownOpen && (
                <div className="categories-dropdown-menu">
                  {categories.map((category) => (
                    <Link
                      key={category.category_id}
                      to={`/category/${category.category_id}`}
                      className="categories-dropdown-item"
                      onClick={() => setIsCategoriesDropdownOpen(false)}
                    >
                      {category.category_name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </li>
          <li><Link to="/offers" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>Offers</Link></li>
        </ul>

        {}
        <div className="navbar-right">
          {}
          {user && (
            <div className="welcome-message">
              Welcome, {user.username || user.name || user.email || `User #${user.username}`}!
            </div>
          )}

          {}
          <WishlistDropdown userId={user?.userId} />

          {}
          <Link to="/cart" className="cart-icon">
            🛒
            {orders.length > 0 && (
              <span className="cart-counter">{orders.length}</span>
            )}
          </Link>

          {}
          <div className="notification-icon">
            🔔
            {unreadNotifications > 0 && (
              <span className="notification-counter">{unreadNotifications}</span>
            )}
            {}
            <div className="notification-dropdown">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <div key={notification.id} className="notification-item">
                    {notification.message}
                  </div>
                ))
              ) : (
                <div className="notification-item">No new notifications.</div>
              )}
            </div>
          </div>

          {}
          <button className="theme-toggle" onClick={toggleDarkMode}>
            {isDarkMode ? '☀️' : '🌙'}
          </button>

          {}
          {user ? (
            <ProfileDropdown user={user} logout={logout} />
          ) : (
            <Link to="/signin" className="login-button">Login</Link>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;