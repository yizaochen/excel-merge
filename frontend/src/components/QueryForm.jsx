import React from "react";

function QueryForm({ onQuery }) {
  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle form submission
    console.log("handleSubmit Click");
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Query fields */}
      <button type="submit">Query</button>
    </form>
  );
}

export default QueryForm;
