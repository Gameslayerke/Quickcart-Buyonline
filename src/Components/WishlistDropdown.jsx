import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Navbar.css';

const WishlistDropdown = ({ userId }) => {
    const [wishlistItems, setWishlistItems] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        const fetchWishlist = async () => {
            try {
                const response = await axios.get('https://alvins.pythonanywhere.com/wishlist', {
                    params: { user_id: userId },
                });
                setWishlistItems(response.data);
            } catch (error) {
                console.error("Error fetching wishlist:", error);
            }
        };
        fetchWishlist();
    }, [userId]);

    const handleRemoveItem = async (wishlistId) => {
        try {
            await axios.delete(`https://alvins.pythonanywhere.com/wishlist/${wishlistId}`);
            setWishlistItems(wishlistItems.filter(item => item.wishlist_id !== wishlistId)); 
        } catch (error) {
            console.error("Error removing wishlist item:", error);
        }
    };

    return (
        <div
            className="wishlist-dropdown"
            onMouseEnter={() => setShowDropdown(true)}
            onMouseLeave={() => setShowDropdown(false)}
        >
            <span className="nav-icon">❤️</span>
            {showDropdown && (
                <div className="dropdown-menu">
                    <h3>Wishlist</h3>
                    {wishlistItems.length > 0 ? (
                        wishlistItems.map((item) => (
                            <div key={item.wishlist_id} className="wishlist-item">
                                <p>{item.product_name}</p>
                                <button onClick={() => handleRemoveItem(item.wishlist_id)}>Remove</button>
                            </div>
                        ))
                    ) : (
                        <p>Your wishlist is empty.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default WishlistDropdown;