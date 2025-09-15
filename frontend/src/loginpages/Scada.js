import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../shared/Sidebar";
import { FormContext } from "../context/FormContext";
import axios from "../instant/axios"; // Axios instance with baseURL & credentials
import Header from "./Header";

function Scada() {
  const navigate = useNavigate();
  const { updateFormData } = useContext(FormContext);

  const [formData, setFormDataLocal] = useState({
    scadaPresent: "",
    scadaFeatures: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [recordId, setRecordId] = useState(null); // Existing SCADA record ID

  // Fetch existing SCADA data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("/scada", { withCredentials: true });
        if (res.data && res.data.length > 0) {
          const record = res.data[0];
          const normalizedRecord = {
            scadaPresent: record.scadaPresent || "",
            scadaFeatures: record.scadaFeatures || "",
          };
          setFormDataLocal(normalizedRecord);
          setRecordId(record._id);
          // updateFormData("scada", normalizedRecord); // optional, enable if needed
        }
      } catch (error) {
        console.error("❌ Error fetching SCADA data:", error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...formData, [name]: value };
    setFormDataLocal(updated);
    // updateFormData("scada", updated); // optional during debugging
  };

  // Validate inputs before submit
  const validate = () => {
    const newErrors = {};
    if (!formData.scadaPresent.trim()) {
      newErrors.scadaPresent = "SCADA/BMS Present field is required";
    }
    if (!formData.scadaFeatures.trim()) {
      newErrors.scadaFeatures = "SCADA Features field is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission (create or update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      let res;
      if (recordId) {
        // Update existing SCADA record
        res = await axios.put(`/scada/${recordId}`, formData, { withCredentials: true });
      } else {
        // Create new SCADA record
        res = await axios.post("/scada", formData, { withCredentials: true });
        setRecordId(res.data.record._id);
      }

      console.log(" SCADA data saved:", res.data);
      updateFormData("scada", formData); // Save to context after successful save
      navigate("/building");
    } catch (err) {
      console.error(" Error saving SCADA data:", err.response?.data || err.message);
      alert("Failed to save SCADA data");
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status"></div>
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
            <h5 className="mb-4">SCADA / BMS Systems</h5>
            <form onSubmit={handleSubmit}>
              <div className="row mb-3">
                <div className="col-md-12 mb-3">
                  <input
                    type="text"
                    name="scadaPresent"
                    className={`form-control ${errors.scadaPresent ? "is-invalid" : ""}`}
                    placeholder="SCADA / BMS Present?"
                    value={formData.scadaPresent}
                    onChange={handleChange}
                  />
                  {errors.scadaPresent && (
                    <div className="invalid-feedback">{errors.scadaPresent}</div>
                  )}
                </div>

                <div className="col-md-12 mb-3">
                  <input
                    type="text"
                    name="scadaFeatures"
                    className={`form-control ${errors.scadaFeatures ? "is-invalid" : ""}`}
                    placeholder="SCADA Features"
                    value={formData.scadaFeatures}
                    onChange={handleChange}
                  />
                  {errors.scadaFeatures && (
                    <div className="invalid-feedback">{errors.scadaFeatures}</div>
                  )}
                </div>
              </div>

              <div className="d-flex w-100 p-3">
                <button
                style={{ backgroundColor: "#009688", border: "none" }}
                  type="button"
                  className="btn text-white"
                  onClick={() => {
                    updateFormData("scada", formData); // save before going back
                    navigate(-1);
                  }}
                >
                 Previous
                </button>
                <button type="submit" className="btn text-white ms-auto"   style={{ backgroundColor: "#009688", border: "none" }}>
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

export default Scada;
