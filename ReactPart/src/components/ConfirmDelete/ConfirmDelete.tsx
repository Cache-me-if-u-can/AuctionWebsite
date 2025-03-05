import React from "react";
import styles from "./ConfirmDelete.module.css";

interface ConfirmDeleteProps {
  isVisible: boolean;
  itemId: string;
  onClose: () => void;
  onConfirm: () => void;
}

const ConfirmDelete: React.FC<ConfirmDeleteProps> = ({
  isVisible,
  itemId,
  onClose,
  onConfirm,
}) => {
  if (!isVisible) return null;

  const handleDelete = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8080/deleteAuctionItem", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ _id: itemId }),
      });

      if (response.ok) {
        onConfirm();
        window.location.reload();
      } else {
        console.error("Failed to delete listing");
        alert("Failed to delete listing");
      }
    } catch (error) {
      console.error("Error deleting listing:", error);
      alert("Error deleting listing");
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.confirmBox}>
        <h3>Confirm Delete</h3>
        <p>
          Are you sure you want to delete this listing? This action cannot be
          undone.
        </p>
        <div className={styles.buttons}>
          <button className={styles.cancelButton} onClick={onClose}>
            Cancel
          </button>
          <button className={styles.confirmButton} onClick={handleDelete}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDelete;
