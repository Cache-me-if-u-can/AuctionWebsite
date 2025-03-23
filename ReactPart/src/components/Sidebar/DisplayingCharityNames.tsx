import React, { useState, useEffect, RefObject } from "react";
import { useLocation } from "react-router-dom";

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
  const location = useLocation();

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
        // Handle preselected charity from navigation
        const state = location.state as { preselectedCharity?: string };
        if (state?.preselectedCharity) {
          onSelect(state.preselectedCharity);
          if (selectRef?.current) {
            selectRef.current.value = state.preselectedCharity;
          }
        }
      } catch (error) {
        console.error("Error fetching charities:", error);
        setCharities([]);
      }
    };

    fetchCharities();
  }, [location, onSelect]);

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
