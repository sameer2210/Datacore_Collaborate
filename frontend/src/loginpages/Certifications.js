import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../shared/Sidebar";
import { FormContext } from "../context/FormContext";
import { Button, Spinner } from "react-bootstrap";
import axios from "../instant/axios"; //  Your custom axios with baseURL and credentials
import Header from "./Header";

function Certifications() {
  const { allFormData, updateFormData } = useContext(FormContext);
  const [formData, setFormDataLocal] = useState({
    isoCertified: "",
    benchmarkCertifications: "",
    wastewaterReuse: "",
    wasteToEnergy: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [recordId, setRecordId] = useState(null); // for existing record
  const navigate = useNavigate();

  //  Fetch certifications data on load
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("/certifications", { withCredentials: true });
        if (res.data && res.data.length > 0) {
          const record = res.data[0];
          setFormDataLocal(record);
          setRecordId(record._id);
          updateFormData("certifications", record); // update global context
        }
      } catch (error) {
        console.error("❌ Error fetching certifications data:", error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  //  Input change handler
  const handleChange = (e) => {
    const updated = { ...formData, [e.target.name]: e.target.value };
    setFormDataLocal(updated);
    updateFormData("certifications", updated);
  };

  //  Form validation
  const validate = () => {
    const newErrors = {};
    if (!formData.isoCertified?.trim()) newErrors.isoCertified = "This field is required";
    if (!formData.benchmarkCertifications?.trim()) newErrors.benchmarkCertifications = "This field is required";
    if (!formData.wastewaterReuse?.trim()) newErrors.wastewaterReuse = "This field is required";
    if (!formData.wasteToEnergy?.trim()) newErrors.wasteToEnergy = "This field is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  //  Form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      let res;
      if (recordId) {
        // Update
        res = await axios.put(`/certifications/${recordId}`, formData, { withCredentials: true });
      } else {
        // Create
        res = await axios.post("/certifications", formData, { withCredentials: true });
        setRecordId(res.data.record._id); // Save for future updates
      }

      console.log(" Certifications data saved:", res.data);
      navigate("/documentsupload");
    } catch (err) {
      console.error(" Error saving certifications data:", err.response?.data || err.message);
      alert("Failed to save certifications data");
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
            <h5 className="mb-4">Certifications & Compliance</h5>
            <form onSubmit={handleSubmit}>
              <div className="row mb-3">
                {[
                  { name: "isoCertified", placeholder: "ISO 50001:2018 Certified?" },
                  { name: "benchmarkCertifications", placeholder: "International Benchmark Certifications?" },
                  { name: "wastewaterReuse", placeholder: "Treated Wastewater Reuse" },
                  { name: "wasteToEnergy", placeholder: "Waste Used for Energy or Production?" }
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

export default Certifications;
