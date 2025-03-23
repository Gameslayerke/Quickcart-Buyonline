import React from 'react';
import { Link } from 'react-router-dom';
import './ProfileDropdown.css'; 

const ProfileDropdown = ({ user, logout }) => {
  return (
    <div className="profile-dropdown">
      <img src="/profile.jpg" alt="Profile" className="profile-pic" />
      <span className="username">{user.username}</span>
      <div className="dropdown-content">
        <Link to="/profile">View Profile</Link>
        <Link to="/cart">Orders</Link>
        <Link to="/notifications">Notifications</Link>
        <button onClick={logout}>Logout</button>
      </div>
    </div>
  );
};

export default ProfileDropdown;