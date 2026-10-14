import React from "react";

const Filters = ({ handleFilterChange }) => {
  return (
    <>
      <select onChange={(e) => handleFilterChange("band", e.target.value)}>
        <option value="">All Bands</option>
        <option value="CORE">Core</option>
        <option value="MEDIUM">Medium</option>
      </select>

      <select onChange={(e) => handleFilterChange("risk", e.target.value)}>
        <option value="">All Risk</option>
        <option value="High">Risk</option>
        <option value="Safe">Safe</option>
      </select>
    </>
  );
};

export default Filters;