import React, { useState } from "react";

const UploadCard = ({ title, onUpload, accept = ".csv,.xlsx" }) => {
  const [file, setFile] = useState(null);

  const handleAction = () => {
    if (!file) return alert("Please select a file first");
    onUpload(file);
  };

  return (
    <div className="upload-card">
      <h3>{title}</h3>
      <input type="file" accept={accept} onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleAction}>Upload</button>
      
      
    </div>
  );
};

export default UploadCard;