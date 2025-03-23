import axios from 'axios';

const API_BASE_URL = 'https://alvins.pythonanywhere.com';

export const fetchCategories = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/categories`);
        return response.data;
    } catch (error) {
        console.error("Error fetching categories:", error);
        return [];
    }
};

export const fetchWishlist = async (userId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/wishlist`, {
            params: { user_id: userId },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching wishlist:", error);
        return [];
    }
};

export const removeFromWishlist = async (wishlistId) => {
    try {
        await axios.delete(`${API_BASE_URL}/wishlist/${wishlistId}`);
    } catch (error) {
        console.error("Error removing wishlist item:", error);
        throw error;
    }
};

export const fetchUserDetails = async (userId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/api/users/${user_Id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching user details:", error);
        throw error;
    }
};