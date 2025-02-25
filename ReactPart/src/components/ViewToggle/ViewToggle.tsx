import React from "react";
import styles from "./ViewToggle.module.css";

interface ViewToggleProps {
  view: string;
  onViewChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

const ViewToggle: React.FC<ViewToggleProps> = ({ view, onViewChange }) => {
  return (
    <div className={styles.viewToggle}>
      <label htmlFor="view-select">Display as:</label>
      <select id="view-select" value={view} onChange={onViewChange}>
        <option value="list">List View</option>
        <option value="grid">Grid View</option>
      </select>
    </div>
  );
};

export default ViewToggle;

