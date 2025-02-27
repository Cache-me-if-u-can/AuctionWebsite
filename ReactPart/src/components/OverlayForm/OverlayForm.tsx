import React, { useState, useEffect } from "react";
import styles from "./OverlayForm.module.css";
import {
  AuctionItem,
  AuctionStatus,
} from "../../types/AuctionItem/AuctionItem";
import { useUser } from "../../context/UserProvider"; // Import from UserProvider directly

interface OverlayFormProps {
  onClose: () => void;
  onSubmit: (listing: AuctionItem) => void;
  initialData?: Partial<AuctionItem>;
  isEditing?: boolean;
}

// First, create an interface for category data
interface Category {
  _id: string;
  categoryName: string;
}

const OverlayForm: React.FC<OverlayFormProps> = ({
  onClose,
  onSubmit,
  initialData,
  isEditing = false,
}) => {
  const { getCsrfToken, getUserType } = useUser();
  // Update the categories state type
  const [categories, setCategories] = useState<Category[]>([]);

  // Update the categories fetch with logging
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:8080/getCategoryDropdownData",
          {
            credentials: "include",
          }
        );
        if (response.ok) {
          const data = await response.json();
          console.log("Categories data received:", data); // Add logging
          if (data.categories) {
            setCategories(data.categories);
          }
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const [formData, setFormData] = useState<Omit<AuctionItem, "currentPrice">>(
    () => ({
      _id: initialData?._id || "",
      title: initialData?.title || "",
      charityId: initialData?.charityId || "",
      description: initialData?.description || "",
      startingPrice: initialData?.startingPrice || 0,
      status: initialData?.status || "live",
      categoryId: initialData?.categoryId || "",
      auctionStartDate: initialData?.auctionStartDate || "",
      auctionEndDate: initialData?.auctionEndDate || "",
      image: initialData?.image || null,
    })
  );

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8080/getUserData", {
          method: "GET",
          credentials: "include",
        });

        if (response.ok) {
          const result = await response.json();
          if (result.userType === "charity" && !isEditing) {
            setFormData((prev) => ({
              ...prev,
              charityId: result._id,
            }));
          }
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    if (!isEditing) {
      fetchUserInfo();
    }
  }, [isEditing]);

  const canEditPrice = () => {
    if (!isEditing) return true; // Always allow price editing for new items

    // Can edit price if auction is hidden (future start date)
    const startDate = new Date(formData.auctionStartDate);
    const now = new Date();
    return startDate > now;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const csrfToken = getCsrfToken();
      if (!csrfToken) {
        throw new Error("No authentication token found");
      }

      const submissionData = {
        ...formData,
        _id: initialData?._id,
        currentPrice: initialData?.currentPrice || formData.startingPrice,
      };

      if (!isEditing) {
        delete submissionData._id;
      }

      console.log("Submitting data:", submissionData);

      const endpoint = isEditing ? "updateAuctionItem" : "createAuctionItem";
      const response = await fetch(`http://127.0.0.1:8080/${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": csrfToken,
        },
        credentials: "include",
        body: JSON.stringify(submissionData),
      });

      const data = await response.json();
      console.log("Server response:", data);

      if (!response.ok) {
        throw new Error(
          data.message || `Failed to ${isEditing ? "update" : "create"} listing`
        );
      }

      onSubmit(submissionData as AuctionItem);
      onClose();
      window.location.reload();
    } catch (error) {
      console.error("Error in submission:", error);
      alert(
        error instanceof Error ? error.message : "An unexpected error occurred"
      );
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, files } = e.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  // Add a function to determine auction status
  const determineAuctionStatus = (
    startDate: Date,
    endDate: Date,
    now: Date
  ): AuctionStatus => {
    if (endDate < now) {
      return "completed";
    }
    if (startDate > now) {
      return "hidden";
    }
    return "live";
  };

  // Add date validation
  const validateDates = (startDate: Date, endDate: Date): boolean => {
    const now = new Date();

    // Check if dates are valid
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      alert("Please enter valid dates");
      return false;
    }

    // Check if end date is after start date
    if (endDate <= startDate) {
      alert("End date must be after start date");
      return false;
    }

    return true;
  };

  // Update handleEndDateChange with better error handling
  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const startDate = new Date(formData.auctionStartDate);
    const endDate = new Date(value);
    const now = new Date();

    if (!validateDates(startDate, endDate)) {
      e.target.value = formData.auctionEndDate;
      return;
    }

    // Ensure timezone consistency
    const formattedEndDate = value.slice(0, 16); // Format: YYYY-MM-DDThh:mm

    setFormData((prev) => ({
      ...prev,
      auctionEndDate: formattedEndDate,
      status: determineAuctionStatus(startDate, endDate, now),
    }));
  };

  // Update handleStartDateChange with similar improvements
  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const startDate = new Date(value);
    const endDate = formData.auctionEndDate
      ? new Date(formData.auctionEndDate)
      : null;
    const now = new Date();

    // Only validate if end date exists
    if (endDate && !validateDates(startDate, endDate)) {
      e.target.value = formData.auctionStartDate; // Reset to previous valid value
      return;
    }

    // Ensure timezone consistency
    const formattedStartDate = value.slice(0, 16); // Format: YYYY-MM-DDThh:mm

    setFormData((prev) => ({
      ...prev,
      auctionStartDate: formattedStartDate,
      status: endDate
        ? determineAuctionStatus(startDate, endDate, now)
        : "hidden",
    }));
  };

  // Update handleStartNow with better validation
  const handleStartNow = () => {
    const now = new Date();
    const endDate = formData.auctionEndDate
      ? new Date(formData.auctionEndDate)
      : null;

    // Validate end date if it exists
    if (endDate && !validateDates(now, endDate)) {
      alert("End date must be after current time");
      return;
    }

    // Format current time for datetime-local input
    const formattedNow = now.toISOString().slice(0, 16);

    setFormData((prev: Omit<AuctionItem, "currentPrice">) => ({
      ...prev,
      auctionStartDate: formattedNow,
      status: (endDate
        ? determineAuctionStatus(now, endDate, now)
        : "live") as AuctionStatus,
    }));
  };

  return (
    <div id="overlayForm" className={styles.overlay}>
      <div className={styles.overlay_content}>
        <span
          className={styles.close_button}
          id="closeButton"
          onClick={onClose}
        >
          &times;
        </span>
        <h2>{isEditing ? "Edit Listing" : "Add New Listing"}</h2>
        <form
          id="addListingForm"
          className={styles.addListingForm}
          onSubmit={handleSubmit}
        >
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            required
            onChange={handleChange}
          />

          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            required
            onChange={handleChange}
          ></textarea>

          <label htmlFor="category">Category:</label>
          <select
            id="category"
            name="categoryId"
            value={formData.categoryId}
            required
            onChange={handleChange}
          >
            <option value="">Select a category</option>
            {categories.length > 0 ? (
              categories.map((category) => {
                console.log("Rendering category:", category); // Add logging
                return (
                  <option key={category._id} value={category._id}>
                    {category.categoryName}
                  </option>
                );
              })
            ) : (
              <option value="" disabled>
                Loading categories...
              </option>
            )}
          </select>

          <label htmlFor="auctionStartDate">Auction Starts:</label>
          <input
            type="datetime-local"
            id="auctionStartDate"
            name="auctionStartDate"
            value={formData.auctionStartDate}
            onChange={handleStartDateChange}
            required
          />
          <label>
            <input type="checkbox" name="startNow" onChange={handleStartNow} />
            Start Now
          </label>

          <label htmlFor="auctionEndDate">Auction Ends:</label>
          <input
            type="datetime-local"
            id="auctionEndDate"
            name="auctionEndDate"
            value={formData.auctionEndDate}
            required
            onChange={handleEndDateChange}
            min={formData.auctionStartDate} // Prevent end date before start date
          />

          {/* Status field (read-only) */}
          <label htmlFor="status">Status:</label>
          <input
            type="text"
            id="status"
            name="status"
            value={formData.status}
            readOnly
            disabled
            title="Status is determined automatically based on dates"
          />

          <label htmlFor="bid">Starting Bid:</label>
          <input
            type="number"
            id="bid"
            name="startingPrice"
            value={formData.startingPrice}
            required
            onChange={handleChange}
            disabled={isEditing && !canEditPrice()}
            title={
              isEditing && !canEditPrice()
                ? "Cannot change price of a live auction"
                : ""
            }
          />

          {isEditing && !canEditPrice() && (
            <small
              style={{
                color: "red",
                display: "block",
                marginTop: "-10px",
                marginBottom: "10px",
              }}
            >
              Starting price cannot be changed once auction is live
            </small>
          )}

          <label htmlFor="image">Image:</label>
          <input type="file" id="image" name="image" onChange={handleChange} />

          <button type="submit">
            {isEditing ? "Save Changes" : "Add Listing"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default OverlayForm;
