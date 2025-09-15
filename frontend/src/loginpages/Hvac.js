import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../shared/Sidebar";
import { FormContext } from "../context/FormContext";
import { Button, Spinner } from "react-bootstrap";
import axios from "../instant/axios"; // axios instance with baseURL & credentials
import Header from "./Header";

function Hvac() {
  const { updateFormData } = useContext(FormContext);

  const [formData, setFormDataLocal] = useState({
    chillers: "",
    chillerType: "",
    coolingTowers: "",
    vfds: "",
    calorifiers: "",
    fahus: "",
    ahus: "",
    fcus: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [recordId, setRecordId] = useState(null); // Existing HVAC record ID

  const navigate = useNavigate();

  // Fetch existing HVAC data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("/hvac", { withCredentials: true });
        if (res.data && res.data.length > 0) {
          const record = res.data[0];

          // Normalize fields so none are undefined/null
          const normalizedRecord = {
            chillers: record.chillers || "",
            chillerType: record.chillerType || "",
            coolingTowers: record.coolingTowers || "",
            vfds: record.vfds || "",
            calorifiers: record.calorifiers || "",
            fahus: record.fahus || "",  // make sure spelling matches backend!
            ahus: record.ahus || "",
            fcus: record.fcus || "",
          };

          setFormDataLocal(normalizedRecord);
          setRecordId(record._id);
          // Comment out updateFormData during debugging
          // updateFormData("hvac", normalizedRecord);
        }
      } catch (error) {
        console.error(" Error fetching HVAC data:", error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Removed updateFormData dependency to avoid re-renders

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log("Input changed:", name, value); // Debug line

    const updated = { ...formData, [name]: value };
    setFormDataLocal(updated);

    // Comment out during debugging; re-enable once stable
    // updateFormData("hvac", updated);
  };

  // Validate inputs before submit
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

  // Handle form submission (create or update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      let res;
      if (recordId) {
        // Update existing HVAC record
        res = await axios.put(`/hvac/${recordId}`, formData, { withCredentials: true });
      } else {
        // Create new HVAC record
        res = await axios.post("/hvac", formData, { withCredentials: true });
        setRecordId(res.data.record._id);
      }

      console.log(" HVAC data saved:", res.data);
      navigate("/scada");
    } catch (err) {
      console.error(" Error saving HVAC data:", err.response?.data || err.message);
      alert("Failed to save HVAC data");
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
            <h5 className="mb-4">HVAC & Refrigeration</h5>
            <form onSubmit={handleSubmit}>
              <div className="row mb-3">
                {[
                  { name: "chillers", placeholder: "Chillers – Quantity + Capacity" },
                  { name: "chillerType", placeholder: "Chiller Type" },
                  { name: "coolingTowers", placeholder: "Cooling Towers (spec)" },
                  { name: "vfds", placeholder: "VFDs for HVAC" },
                  { name: "calorifiers", placeholder: "Calorifiers" },
                  { name: "fahus", placeholder: "No. Of FAHUs and their capacity" },
                  { name: "ahus", placeholder: "No. Of AHUs and their capacity" },
                  { name: "fcus", placeholder: "No. Of FCUs and their capacity" },
                ].map(({ name, placeholder }) => (
                  <div className="col-md-12 mb-3" key={name}>
                    <input
                      type="text"
                      name={name}
                      value={formData[name] || ""}
                      onChange={handleChange}
                      className={`form-control ${errors[name] ? "is-invalid" : ""}`}
                      placeholder={placeholder}
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

export default Hvac;
