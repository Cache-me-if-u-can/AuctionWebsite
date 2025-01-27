import React, { useState } from 'react';
import styles from  "./Sidebar.module.css";

const Sidebar: React.FC = () => {
  const [category, setCategory] = useState('all');
  const [conditions, setConditions] = useState<string[]>([]);
  const [charity, setCharity] = useState('all');

  const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory(event.target.value);
  };

  const handleConditionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setConditions(prevConditions =>
      prevConditions.includes(value)
        ? prevConditions.filter(condition => condition !== value)
        : [...prevConditions, value]
    );
  };

  const handleCharityChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setCharity(event.target.value);
  };

  return (
    <div className={styles.sidebar}>
      <h2>Filters</h2>
      <div className={styles.filter_group}>
        <label htmlFor="category-filter">Category</label>
        <select id="category-filter" value={category} onChange={handleCategoryChange}>
          <option value="all">All</option>
          <option value="electronics">Electronics</option>
          <option value="furniture">Furniture</option>
          <option value="art">Art</option>
        </select>
      </div>
      <div className={styles.filter_group}>
        <label>Status</label>
        <label>
          <input
            type="checkbox"
            value="live"
            className={styles.condition_filter}
            checked={conditions.includes('live')}
            onChange={handleConditionChange}
          />{' '}
          Live
        </label>
        <label>
          <input
            type="checkbox"
            value="complete"
            className={styles.condition_filter}
            checked={conditions.includes('complete')}
            onChange={handleConditionChange}
          />{' '}
          Complete
        </label>
        <label>
          <input
            type="checkbox"
            value="hidden"
            className={styles.condition_filter}
            checked={conditions.includes('hidden')}
            onChange={handleConditionChange}
          />{' '}
          Hidden
        </label>
      </div>
      <div className={styles.filter_group}>
        <label htmlFor="charity-filter">Charity</label>
        <select id="charity-filter" value={charity} onChange={handleCharityChange}>
          <option value="all">All</option>
          <option value="goodwill">Goodwill</option>
          <option value="mentalhealthaberdeen">Mental Health Aberdeen</option>
          <option value="salvationarmy">Salvation Army</option>
        </select>
      </div>
    </div>
  );
};

export default Sidebar;