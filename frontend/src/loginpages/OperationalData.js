import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import Sidebar from "../shared/Sidebar";
import { Button, Spinner } from "react-bootstrap";
import { FormContext } from "../context/FormContext";
import axios from "../instant/axios";  // Assuming same custom axios setup
import Header from './Header';

function OperationalData() {
  const navigate = useNavigate();
  const { allFormData, updateFormData } = useContext(FormContext);

  const [formData, setFormData] = useState({
    annualProduction: '',
    shutdownDays: '',
    directHireEmployees: '',
    indirectHireEmployees: '',
    gridElectricity: '',
    independentPower: '',
    solarPower: '',
    dieselConsumed: '',
    heavyOilConsumed: '',
    fuelGasConsumed: '',
    freshWater: '',
    recycledWater: '',
    energyInvestment: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [recordId, setRecordId] = useState(null);

  // Fetch existing operational data on load (only once!)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("/operational-data", { withCredentials: true });
        if (res.data && res.data.length > 0) {
          const record = res.data[0];
          setFormData(record);
          setRecordId(record._id);
          updateFormData("operationalData", record);
        }
      } catch (error) {
        console.error("❌ Error fetching operational data:", error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // <-- Run only once on mount, removed updateFormData from dependencies

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      updateFormData("operationalData", updated);
      return updated;
    });
  };

  // Validate form fields
  const validate = () => {
    const newErrors = {};
    for (const key in formData) {
      if (!formData[key]?.toString().trim()) newErrors[key] = "This field is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      let res;
      if (recordId) {
        // Update existing record
        res = await axios.put(`/operational-data/${recordId}`, formData, { withCredentials: true });
      } else {
        // Create new record
        res = await axios.post("/operational-data", formData, { withCredentials: true });
        setRecordId(res.data.record._id);
      }

      console.log(" Operational data saved:", res.data);
      navigate("/electrical");  // Next page
    } catch (err) {
      console.error(" Error saving operational data:", err.response?.data || err.message);
      alert("Failed to save operational data");
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
            <h5 className="mb-4">Operational Data</h5>
            <form onSubmit={handleSubmit}>
              <div className="row mb-3">
                {[
                  { name: 'annualProduction', label: 'Annual Production' },
                  { name: 'shutdownDays', label: 'Shutdown Days per Year' },
                  { name: 'directHireEmployees', label: 'Direct Hire Employees' },
                  { name: 'indirectHireEmployees', label: 'Indirect Hire Employees' },
                  { name: 'gridElectricity', label: 'Grid Electricity Consumption' },
                  { name: 'independentPower', label: 'Independent Power Consumed' },
                  { name: 'solarPower', label: 'Solar Power Generated' },
                  { name: 'dieselConsumed', label: 'Diesel Consumed' },
                  { name: 'heavyOilConsumed', label: 'Heavy Oil Consumed' },
                  { name: 'fuelGasConsumed', label: 'Fuel Gas Consumed' },
                  { name: 'freshWater', label: 'Fresh Water Consumed' },
                  { name: 'recycledWater', label: 'Recycled Water Used' },
                  { name: 'energyInvestment', label: 'Energy Efficiency Investment' }
                ].map(field => (
                  <div key={field.name} className="col-md-6 mb-3">
                    <input
                      type="number"
                      name={field.name}
                      value={formData[field.name] || ""}
                      onChange={handleChange}
                      className={`form-control ${errors[field.name] ? "is-invalid" : ""}`}
                      placeholder={field.label}
                    />
                    {errors[field.name] && (
                      <div className="invalid-feedback">{errors[field.name]}</div>
                    )}
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

export default OperationalData;
