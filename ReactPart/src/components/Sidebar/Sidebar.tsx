import React, { useState, useRef } from "react";
import styles from "./Sidebar.module.css";
import CategoriesForm from "./DisplayingCategories";
import CharitiesForm from "./DisplayingCharityNames";

type SidebarProps = {
  onFilterChange: (filters: {
    category: string;
    conditions: string[];
    charity: string;
  }) => void;
};

const Sidebar: React.FC<SidebarProps> = ({ onFilterChange }) => {
  const [category, setCategory] = useState("all");
  const [conditions, setConditions] = useState<string[]>([]);
  const [charity, setCharity] = useState("all");

  // Create refs for the select elements
  const categorySelectRef = useRef<HTMLSelectElement>(null);
  const charitySelectRef = useRef<HTMLSelectElement>(null);

  const handleConditionChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = event.target.value;
    setConditions((prevConditions) =>
      prevConditions.includes(value)
        ? prevConditions.filter((condition) => condition !== value)
        : [...prevConditions, value],
    );
  };

  const handleFilterClick = () => {
    onFilterChange({ category, conditions, charity });
  };

  const handleClearFilters = () => {
    // Reset all filter states
    setCategory("all");
    setConditions([]);
    setCharity("all");

    // Reset the select elements to their default values
    if (categorySelectRef.current) {
      categorySelectRef.current.value = "all";
    }

    if (charitySelectRef.current) {
      charitySelectRef.current.value = "all";
    }

    // Trigger filter change with default values
    onFilterChange({ category: "all", conditions: [], charity: "all" });
  };

  return (
    <div className={styles.sidebar}>
      <h2>Filters</h2>

      {/* Dynamic Category Selector */}
      <div className={styles.filter_group}>
        <label htmlFor="category-filter">Category</label>
        <CategoriesForm onSelect={setCategory} selectRef={categorySelectRef} />
      </div>

      {/* Status Checkboxes */}
      <div className={styles.filter_group}>
        <label>Status</label>
        {["live", "complete", "hidden"].map((status) => (
          <label key={status}>
            <input
              type="checkbox"
              value={status}
              className={styles.condition_filter}
              checked={conditions.includes(status)}
              onChange={handleConditionChange}
            />{" "}
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </label>
        ))}
      </div>

      {/* Dynamic Charity Selector */}
      <div className={styles.filter_group}>
        <label htmlFor="charity-filter">Charity</label>
        <CharitiesForm onSelect={setCharity} selectRef={charitySelectRef} />
      </div>

      {/* Filter Buttons */}
      <div className={styles.filter_buttons}>
        <button className={styles.filter_button} onClick={handleFilterClick}>
          Filter
        </button>
        <button className={styles.clear_button} onClick={handleClearFilters}>
          Clear Filters
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
