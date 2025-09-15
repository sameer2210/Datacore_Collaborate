import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../shared/Sidebar";
import { FormContext } from "../context/FormContext";
import { Button, Spinner } from "react-bootstrap";
import axios from "../instant/axios"; // axios instance with baseURL & credentials
import Header from "./Header";

function Equipment() {
  const { updateFormData } = useContext(FormContext);
  const navigate = useNavigate();

  const [formData, setFormDataLocal] = useState({
    equipmentName: "",
    equipmentType: "",
    batchDuration: "",
    batchesPerDay: "",
    ratedPower: "",
    installationYear: "",
    manufacturer: "",
    comments: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [recordId, setRecordId] = useState(null);

  // Fetch existing equipment data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("/equipment", { withCredentials: true });
        if (res.data && res.data.length > 0) {
          const record = res.data[0];

          const normalizedRecord = {
            equipmentName: record.equipmentName || "",
            equipmentType: record.equipmentType || "",
            batchDuration: record.batchDuration || "",
            batchesPerDay: record.batchesPerDay || "",
            ratedPower: record.ratedPower || "",
            installationYear: record.installationYear || "",
            manufacturer: record.manufacturer || "",
            comments: record.comments || "",
          };

          setFormDataLocal(normalizedRecord);
          setRecordId(record._id);

          // Optional during debugging
          // updateFormData("equipment", normalizedRecord);
        }
      } catch (error) {
        console.error(" Error fetching Equipment data:", error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...formData, [name]: value };
    setFormDataLocal(updated);

    // Optional: updateFormData("equipment", updated);
  };

  const validate = () => {
    const newErrors = {};
    Object.entries(formData).forEach(([key, value]) => {
      if (!value.trim()) {
        newErrors[key] = "This field is required";
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      let res;
      if (recordId) {
        // Update existing equipment record
        res = await axios.put(`/equipment/${recordId}`, formData, { withCredentials: true });
      } else {
        // Create new equipment record
        res = await axios.post("/equipment", formData, { withCredentials: true });
        setRecordId(res.data.record._id);
      }

      console.log(" Equipment data saved:", res.data);
      navigate("/pdf-preview");
    } catch (err) {
      console.error(" Error saving Equipment data:", err.response?.data || err.message);
      alert("Failed to save Equipment data");
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

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
            <h5 className="mb-4">Major Batch Equipment</h5>
            <form onSubmit={handleSubmit}>
              <div className="row mb-3">
                {[
                  { name: "equipmentName", label: "Equipment Name" },
                  { name: "equipmentType", label: "Equipment Type" },
                  { name: "batchDuration", label: "Batch Duration" },
                  { name: "batchesPerDay", label: "Number of Batches / Day" },
                  { name: "ratedPower", label: "Rated Power" },
                  { name: "installationYear", label: "Year of Installation" },
                  { name: "manufacturer", label: "Manufacturer / Model" },
                  { name: "comments", label: "Comments / Issues" },
                ].map(({ name, label }) => (
                  <div className="col-md-12 mb-3" key={name}>
                    <input
                      type="text"
                      name={name}
                      value={formData[name] || ""}
                      onChange={handleChange}
                      placeholder={label}
                      className={`form-control ${errors[name] ? "is-invalid" : ""}`}
                    />
                    {errors[name] && <div className="invalid-feedback">{errors[name]}</div>}
                  </div>
                ))}
              </div>

                 <div className="d-flex w-100 p-3">
  <button
    type="button"
    className="btn text-white"
    style={{ backgroundColor: "#009688", border: "none" }}
    onClick={() => navigate(-1)}
  >
    Previous
  </button>

  <button
    type="submit"
    className="btn text-white ms-auto"
    style={{ backgroundColor: "#009688", border: "none" }}
  >
    Save
  </button>
</div>
            </form>
          </div>
        </div>
      </div>
    </div>
   </>
  );
}

export default Equipment;
