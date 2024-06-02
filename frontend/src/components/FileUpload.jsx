import React from "react";

function FileUpload() {
  const handleFileUpload = (event) => {
    console.log("handleFileUpload Click");
  };

  return (
    <div>
      <input type="file" multiple onChange={handleFileUpload} />
    </div>
  );
}

export default FileUpload;
