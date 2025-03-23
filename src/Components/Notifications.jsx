import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Notifications.css";

const Notifications = ({ open, setOpen }) => {
  const [notifications, setNotifications] = useState([]);

  
  useEffect(() => {
    if (!open) return;

    const fetchNotifications = async () => {
      try {
        const response = await axios.get(
          "https://alvins.pythonanywhere.com/notifications"
        );
        console.log("API Response:", response.data); // Debugging
        setNotifications(response.data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, [open]); 

  const markAsRead = async (notificationId) => {
    try {
      console.log("Marking notification as read:", notificationId); 
      await axios.put(
        `https://alvins.pythonanywhere.com/notifications/${notificationId}`,
        { is_read: true }
      );
      setNotifications((prev) =>
        prev.map((n) =>
          n.notification_id === notificationId ? { ...n, is_read: true } : n
        )
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  return (
    <>
      {open && (
        <div className="notifications-dropdown">
          {notifications.length === 0 ? (
            <p className="no-notifications">No new notifications</p>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.notification_id}
                className={`notification-item ${notification.is_read ? "read" : "unread"}`}
                onClick={() => markAsRead(notification.notification_id)}
              >
                <p>{notification.message}</p>
                <span>{new Date(notification.created_at).toLocaleString()}</span>
              </div>
            ))
          )}
        </div>
      )}
    </>
  );
};

export default Notifications;