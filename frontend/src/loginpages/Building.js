import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../shared/Sidebar";
import { FormContext } from "../context/FormContext";
import { Button, Spinner } from "react-bootstrap";
import axios from "../instant/axios"; // axios instance with baseURL & credentials
import Header from "./Header";

function Building() {
  const { updateFormData } = useContext(FormContext);

  const [formData, setFormDataLocal] = useState({
    cooled: "",
    envelopeSpecs: "",
    roofInsulation: "",
    coolRoof: "",
    windowFilms: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [recordId, setRecordId] = useState(null); // Existing building record ID

  const navigate = useNavigate();

  // Fetch existing building data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("/thermal-efficiency", { withCredentials: true });
        if (res.data && res.data.length > 0) {
          const record = res.data[0];

          // Normalize fields so none are undefined/null
          const normalizedRecord = {
            cooled: record.cooled || "",
            envelopeSpecs: record.envelopeSpecs || "",
            roofInsulation: record.roofInsulation || "",
            coolRoof: record.coolRoof || "",
            windowFilms: record.windowFilms || "",
          };

          setFormDataLocal(normalizedRecord);
          setRecordId(record._id);

          // Optional: update context while debugging disabled
          // updateFormData("building", normalizedRecord);
        }
      } catch (error) {
        console.error(" Error fetching Building data:", error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // no dependencies to avoid refetching

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    const updated = { ...formData, [name]: value };
    setFormDataLocal(updated);

    // Optional: updateFormData("building", updated);
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
        // Update existing building record
        res = await axios.put(`/thermal-efficiency/${recordId}`, formData, { withCredentials: true });
      } else {
        // Create new building record
        res = await axios.post("/thermal-efficiency", formData, { withCredentials: true });
        setRecordId(res.data.record._id);
      }

      console.log(" Building data saved:", res.data);
      navigate("/equipment"); // Navigate to next page after saving
    } catch (err) {
      console.error(" Error saving Building data:", err.response?.data || err.message);
      alert("Failed to save Building data");
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

        <div className="col-md-8">
          <div className="form-section">
            <h5 className="mb-4">Building Envelope / Thermal Efficiency</h5>
            <form onSubmit={handleSubmit}>
              <div className="row mb-3">
                {[
                  { name: "cooled", placeholder: "Is Production Building Cooled?" },
                  { name: "envelopeSpecs", placeholder: "Envelope Specs" },
                  { name: "roofInsulation", placeholder: "PU/Steel Roof with Insulation" },
                  { name: "coolRoof", placeholder: "Cool Roof or Walls?" },
                  { name: "windowFilms", placeholder: "Window Films (Sky lights >300 m²)" },
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
                <button type="button" className="btn text-white" onClick={() => navigate(-1)}  style={{ backgroundColor: "#009688", border: "none" }}>
                   Previous
                </button>
                
                <Button type="submit" className="btn text-white ms-auto"  style={{ backgroundColor: "#009688", border: "none" }}>
                   Save
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

export default Building;

