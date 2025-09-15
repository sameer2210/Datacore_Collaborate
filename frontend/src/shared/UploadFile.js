import React, { useRef, useState } from "react";
import { Form } from "react-bootstrap";
import { Upload } from "react-bootstrap-icons";

const FileUploadBox = ({ name, onFileSelected }) => {
  const fileInputRef = useRef(null);
  const [fileName, setFileName] = useState("");

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      setFileName(file.name);
      onFileSelected(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setFileName(file.name);
      onFileSelected(file);
    }
  };

  const handleClickBrowse = () => {
    fileInputRef.current.click();
  };

  return (
    <div
      className="rounded p-4 text-center"
      style={{
        cursor: "pointer",
        minHeight: "180px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        borderColor: "#09ac9f",
        border: "2px solid #09ac9f",
        borderStyle: "dotted"
      }}
      onClick={handleClickBrowse}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <div>
        <Upload size={40} className="text-primary mb-3" />
        <p className="mb-0">
          Drag and Drop or{" "}
          <span
            className="text-primary"
            onClick={(e) => {
              e.stopPropagation();
              handleClickBrowse();
            }}
            style={{ textDecoration: "underline", cursor: "pointer" }}
          >
            Browse File
          </span>
        </p>
        {fileName && <p className="text-success mt-2">Selected: {fileName}</p>}
        <Form.Control
          type="file"
          name={name}
          className="d-none"
          ref={fileInputRef}
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
};

export default FileUploadBox;
