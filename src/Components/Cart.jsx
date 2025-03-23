import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { OrdersContext } from "./OrdersContext"; // Import OrdersContext
import { AuthContext } from "./AuthContext"; // Import AuthContext
import "./Cart.css";

const Cart = () => {
  const { user } = useContext(AuthContext); // Get the logged-in user
  const { orders, setOrders } = useContext(OrdersContext); // Use OrdersContext
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch user orders
  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return; // Ensure the user is logged in

      try {
        const response = await axios.get(`https://alvins.pythonanywhere.com/api/orders?user_id=${user.user_id}`);
        setOrders(response.data); // Update orders in context
        setLoading(false);
      } catch (error) {
        setError("Failed to fetch orders. Please try again.");
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, setOrders]);

  // Function to delete an order by order_id
  const handleDeleteOrder = async (orderId) => {
    try {
      await axios.delete(`https://alvins.pythonanywhere.com/api/orders/${orderId}`);
      // Remove the deleted order from the orders state
      setOrders(orders.filter((order) => order.order_id !== orderId));
    } catch (error) {
      setError("Failed to delete order. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
        <p>Loading orders...</p>
      </div>
    );
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="cart-container">
      <h2>Your Orders</h2>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <ul className="order-list">
          {orders.map((order) => (
            <li key={order.order_id} className="order-item">
              <p><strong>Order ID:</strong> {order.order_id}</p>
              <p><strong>Total Price:</strong> ${order.total_price}</p>
              <p><strong>Status:</strong> {order.order_status}</p>
              <p><strong>Order Date:</strong> {new Date(order.created_at).toLocaleString()}</p>
              <button
                className="delete-button"
                onClick={() => handleDeleteOrder(order.order_id)}
              >
                Delete Order
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Cart;