import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../shared/Sidebar";
import { Button, Spinner } from "react-bootstrap";
import { FormContext } from "../context/FormContext";
import axios from "../instant/axios";
import Header from "./Header";

const BASE_URL = "http://localhost:8000"; 

function DocumentsUpload() {
  const navigate = useNavigate();
  const { allFormData, updateFormData } = useContext(FormContext);

  const [files, setFiles] = useState({
    tradeLicense: null,
    plantLayout: null,
    bills: [],
    ghgReport: null,
    wwtpLayout: null,
    waterBalance: null,
    massBalance: null,
    energyBalance: null,
    manufacturingDesc: null,
  });

  const [errors, setErrors] = useState({});
  const [recordId, setRecordId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchUploads = async () => {
      try {
        const res = await axios.get("/upload-documents", {
          withCredentials: true,
        });

        if (res.data && res.data.length > 0) {
          const record = res.data[0];
          const transformed = {
            ...files,
            ...record,
            
          };
          console.log(record);
          

          setFiles(transformed);
          setRecordId(record._id);
          updateFormData("documentsUpload", transformed);
        }
      } catch (err) {
        console.error("❌ Error fetching uploads:", err.response?.data || err.message);
      } finally {
        setInitialLoading(false);
      }
    };

    fetchUploads();
  }, []);

  const handleFileChange = (e, field, multiple = false) => {
    const selectedFiles = multiple ? Array.from(e.target.files) : e.target.files[0];
    setFiles((prev) => ({ ...prev, [field]: selectedFiles }));
  };

  const renderFileNames = (file) => {
    if (!file) return null;
    if (Array.isArray(file)) return file.map((f) => f.name).join(", ");
    return file.name;
  };

  const validate = () => {
    const newErrors = {};
    if (!files.tradeLicense) newErrors.tradeLicense = "Trade/Industrial License is required.";
    if (!files.plantLayout) newErrors.plantLayout = "Plant Layout is required.";
    if (!files.bills || files.bills.length === 0) newErrors.bills = "Water & Electricity Bills are required.";
    if (!files.ghgReport) newErrors.ghgReport = "GHG Inventory Report is required.";
    if (!files.manufacturingDesc) newErrors.manufacturingDesc = "Manufacturing Process Description is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setUploading(true);
    updateFormData("documentsUpload", files);

    const formData = new FormData();
    Object.keys(files).forEach((key) => {
      const file = files[key];
      if (file) {
        if (Array.isArray(file)) {
          file.forEach((f) => formData.append(key, f));
        } else {
          formData.append(key, file);
        }
      }
    });

    try {
      const url = recordId ? `/upload-documents/${recordId}` : `/upload-documents`;
      const method = recordId ? "put" : "post";

      const response = await axios[method](url, formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200 || response.status === 201) {
        if (!recordId && response.data?.record?._id) {
          setRecordId(response.data.record._id);
        }
        navigate("/operationaldata");
      }
    } catch (err) {
      console.error("Upload failed:", err.response?.data || err.message);
      alert("Failed to upload documents. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

 const renderOldFileLink = (filePath) => {
  if (!filePath) return null;

  if (typeof filePath === "string") {
    return (
      <div>
        <a href={`${BASE_URL}${filePath}`} target="_blank" rel="noreferrer" className="text-success" download>
          Download previously uploaded file
        </a>
      </div>
    );
  }

  if (Array.isArray(filePath)) {
    return (
      <div>
        {filePath.map((path, index) => (
          <div key={index}>
            <a href={`${BASE_URL}${path}`} target="_blank" rel="noreferrer" className="text-success" download>
              Bill {index + 1}
            </a>
          </div>
        ))}
      </div>
    );
  }

  return null;
};


  return (
    <>
    <Header/>
    <div className="container col-lg-9 mt-5">
      <div className="row">
        <div className="col-md-4">
          <Sidebar />
        </div>
        <div className="col-md-8" style={{ maxHeight: "70vh", overflowY: "auto", paddingRight: "10px" }}>
          <div className="form-section">
            <h5 className="mb-4">Mandatory Documents Upload</h5>
            <form onSubmit={handleSubmit} noValidate>
              <div className="row mb-3">
                {/* ============ REPEAT FOR EACH FIELD ============ */}

                {[
                  { label: "Trade/Industrial License", key: "tradeLicense", required: true, accept: ".pdf" },
                  { label: "Plant Layout", key: "plantLayout", required: true, accept: ".pdf,.dwg" },
                  { label: "Water & Electricity Bills (12 months)", key: "bills", required: true, multiple: true },
                  { label: "GHG Inventory Report", key: "ghgReport", required: true },
                  { label: "WWTP Layout + Effluent (Optional)", key: "wwtpLayout" },
                  { label: "Water Balance Diagram (Optional)", key: "waterBalance" },
                  { label: "Mass Balance Diagram (Optional)", key: "massBalance" },
                  { label: "Energy Balance Diagram (Optional)", key: "energyBalance" },
                  {
                    label: "Manufacturing Process Description",
                    key: "manufacturingDesc",
                    required: true,
                    accept: ".pdf,.txt,.doc,.docx",
                  },
                ].map(({ label, key, required, multiple, accept }) => (
                  <div className="col-md-6 mb-3" key={key}>
                    <label className="form-label">
                      {label} {required ? "" : <small>(Optional)</small>}
                    </label>
                    <input
                      type="file"
                      className={`form-control ${errors[key] ? "is-invalid" : ""}`}
                      accept={accept}
                      multiple={multiple}
                      onChange={(e) => handleFileChange(e, key, multiple)}
                    />
                    {/* Show selected file only if user picked a new file */}
{files[key] && files[key] instanceof File && (
  <small className="text-success d-block">Selected: {renderFileNames(files[key])}</small>
)}

{/* Show existing uploaded file if available (from backend) */}
{files[key] && typeof files[key] === "string" && renderOldFileLink(files[key])}

{/* For multiple files (e.g., bills) */}
{Array.isArray(files[key]) && files[key].length > 0 && files[key][0] instanceof File && (
  <small className="text-success d-block">Selected: {renderFileNames(files[key])}</small>
)}
{Array.isArray(files[key]) && files[key].length > 0 && typeof files[key][0] === "string" && renderOldFileLink(files[key])}

                    {errors[key] && <div className="invalid-feedback">{errors[key]}</div>}
                  </div>
                ))}
              </div>

             <div className="d-flex w-100 p-3">
  {/* Previous */}
  <Button
    type="button"
    style={{ backgroundColor: "#009688", border: "none" }}
    className="text-white"
    onClick={() => navigate(-1)}
    disabled={initialLoading}
  >
    Previous
  </Button>

  {/* Save */}
  <Button
    type="submit"
    style={{ backgroundColor: "#009688", border: "none" }}
    className="text-white ms-auto"
    disabled={uploading}
  >
    {uploading ? "Uploading..." : "Save"}
  </Button>
</div>

              
            </form>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

export default DocumentsUpload;
