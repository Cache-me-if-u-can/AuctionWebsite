import React, { useState, useEffect } from 'react';

interface CategoriesFormProps {
  onSelect: (category: string) => void;
}

const CategoriesForm: React.FC<CategoriesFormProps> = ({ onSelect }) => {
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:8080/getCategories');
        if (!response.ok) throw new Error('Failed to fetch categories');

        const data = await response.json();
        const sortedCategories = data.categories.sort((a: string, b: string) => a.localeCompare(b));
        setCategories(sortedCategories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="category-select">
      <select onChange={(e) => onSelect(e.target.value)} defaultValue="">
        <option disabled value="">
          -- select category --
        </option>
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CategoriesForm;
