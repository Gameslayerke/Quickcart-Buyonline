import React from 'react';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <span>&copy; {currentYear} QuickCart</span>
        <span>Developed by Alvins Munene</span>
      </div>
    </footer>
  );
};

export default Footer;