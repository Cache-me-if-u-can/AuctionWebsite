import React, { useState, useEffect, RefObject } from "react";

interface Charity {
  _id: number;
  name: string;
  email: string;
  phoneNum: string;
  image: string;
  address: string;
  description: string;
}

interface CharitiesFormProps {
  onSelect: (charity: string) => void;
  selectRef?: RefObject<HTMLSelectElement>;
}

const CharitiesForm: React.FC<CharitiesFormProps> = ({
  onSelect,
  selectRef,
}) => {
  const [charities, setCharities] = useState<string[]>([]);

  useEffect(() => {
    const fetchCharities = async () => {
      try {
        const response = await fetch("http://localhost:8080/getCharitiesList");
        if (!response.ok) throw new Error("Failed to fetch charities");

        const data = await response.json();

        const charityNames = data
          .map((charity: Charity) => charity.name)
          .sort();
        setCharities(charityNames);
      } catch (error) {
        console.error("Error fetching charities:", error);
        setCharities([]);
      }
    };

    fetchCharities();
  }, []);

  return (
    <div className="charity-select">
      <select
        onChange={(e) => onSelect(e.target.value)}
        defaultValue="all"
        ref={selectRef}
      >
        <option value="all">All</option>
        {charities.map((charity) => (
          <option key={charity} value={charity}>
            {charity}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CharitiesForm;
