import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const CategoriesDropdown = () => {
  const [categories, setCategories] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Fetch categories from the API
  useEffect(() => {
    axios
      .get("https://alvins.pythonanywhere.com/categories")
      .then((response) => {
        console.log("Categories API Response:", response.data);
        setCategories(response.data);
      })
      .catch((error) => console.error("Failed to fetch categories:", error));
  }, []);

  // Toggle the dropdown menu
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="categories-dropdown">
      <button className="categories-dropdown-button" onClick={toggleDropdown}>
        Categories
      </button>
      {isDropdownOpen && (
        <div className="categories-dropdown-menu">
          {categories.length > 0 ? (
            categories.map((category) => (
              <Link
                key={category.category_id}
                to={`/category/${category.category_id}`} // Link to the category route
                className="categories-dropdown-item"
                onClick={() => setIsDropdownOpen(false)}
              >
                {category.category_name}
              </Link>
            ))
          ) : (
            <div className="categories-dropdown-item">No categories available</div>
          )}
        </div>
      )}
    </div>
  );
};

export default CategoriesDropdown;