import React, { useState, useEffect } from "react";
import styles from "./NotificationBell.module.css";
import { Notification } from "../../types/Notification/Notification";

const NotificationBell: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  //!TODO: Implement endpoints in the backend
  const fetchNotifications = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8080/notifications", {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setNotifications(data);
        setUnreadCount(data.filter((n: Notification) => !n.read).length);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8080/notifications/${notificationId}/read`,
        {
          method: "PUT",
          credentials: "include",
        },
      );
      if (response.ok) {
        fetchNotifications();
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000); // Poll every minute
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.notificationBell}>
      <button
        className={styles.bellButton}
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
        </svg>
        {unreadCount > 0 && <span className={styles.badge}>{unreadCount}</span>}
      </button>

      {showDropdown && (
        <div className={styles.dropdown}>
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <div
                key={notification._id}
                className={`${styles.notification} ${!notification.read ? styles.unread : ""}`}
                onClick={() => markAsRead(notification._id)}
              >
                <p>{notification.message}</p>
                <small>
                  {new Date(notification.createdAt).toLocaleString()}
                </small>
              </div>
            ))
          ) : (
            <p className={styles.noNotifications}>No notifications</p>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
