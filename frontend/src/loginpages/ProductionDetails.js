
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FormContext } from "../context/FormContext";
import Sidebar from "../shared/Sidebar";
import { Button, Spinner } from "react-bootstrap";
import axios from "../instant/axios";
import Header from "./Header";

function ProductionDetails() {
  const { updateFormData } = useContext(FormContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    rawMaterials: "",
    finalProducts: "",
    technologyUsed: "",
    productionCapacity: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [recordId, setRecordId] = useState(null); // existing production record ID

  //  Load existing production data
  useEffect(() => {
    const fetchProductionData = async () => {
      try {
        const res = await axios.get("/production", { withCredentials: true });
        if (res.data && res.data.length > 0) {
          const record = res.data[0]; 
         
          console.log(res.data);
          
          
          setFormData(record);
          setRecordId(record._id);
          updateFormData("productionDetails", record);
        }
      } catch (error) {
        console.error("Error fetching production data:", error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProductionData();
  }, []);

  //  Validation
  const validate = () => {
    const newErrors = {};
    if (!formData.rawMaterials) newErrors.rawMaterials = "Raw materials are required";
    if (!formData.finalProducts) newErrors.finalProducts = "Final products are required";
    if (!formData.technologyUsed) newErrors.technologyUsed = "Technology is required";
    if (!formData.productionCapacity) newErrors.productionCapacity = "Production capacity is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  //  Handle input changes
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  //  Handle form submit
const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validate()) return;

  updateFormData("productionDetails", formData);

  try {
    let res;
    if (recordId) {
      // Update existing record
      res = await axios.put(`/production/${recordId}`, formData, { withCredentials: true });
      setFormData(res.data || formData);
    } else {
      // Create new record
      res = await axios.post("/production", formData, { withCredentials: true });
      // Use res.data directly if your backend returns the object
      const newRecord = res.data.record || res.data;
      setRecordId(newRecord._id);
      setFormData(newRecord);
    }

    console.log("Production data saved successfully:", res.data);
    navigate("/certifications");
  } catch (error) {
    console.error("Error saving production data:", error.response?.data || error.message);
    alert("Failed to save production data");
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
      <Header />
      <div className="container col-lg-9 mt-5">
        <div className="row">
          <div className="col-md-4">
            <Sidebar />
          </div>
         <div className="col-md-8" style={{ maxHeight: "70vh", overflowY: "auto", paddingRight: "10px" }}>
            <div className="form-section">
              <h5 className="mb-4">Production Details</h5>
              <form onSubmit={handleSubmit}>
                <div className="row mb-3">
                  <div className="col-md-12 mb-3">
                    <input
                      type="text"
                      className="form-control"
                      name="rawMaterials"
                      placeholder="Main Raw Materials Used"
                      value={formData.rawMaterials}
                      onChange={handleChange}
                    />
                    {errors.rawMaterials && <small className="text-danger">{errors.rawMaterials}</small>}
                  </div>

                  <div className="col-md-12 mb-3">
                    <input
                      type="text"
                      className="form-control"
                      name="finalProducts"
                      placeholder="Final Products"
                      value={formData.finalProducts}
                      onChange={handleChange}
                    />
                    {errors.finalProducts && <small className="text-danger">{errors.finalProducts}</small>}
                  </div>

                  <div className="col-md-12 mb-3">
                    <input
                      type="text"
                      className="form-control"
                      name="technologyUsed"
                      placeholder="Manufacturing Technology Used"
                      value={formData.technologyUsed}
                      onChange={handleChange}
                    />
                    {errors.technologyUsed && <small className="text-danger">{errors.technologyUsed}</small>}
                  </div>

                  <div className="col-md-12 mb-3">
                    <input
                      type="text"
                      className="form-control"
                      name="productionCapacity"
                      placeholder="Production Capacity"
                      value={formData.productionCapacity}
                      onChange={handleChange}
                    />
                    {errors.productionCapacity && <small className="text-danger">{errors.productionCapacity}</small>}
                  </div>
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

export default ProductionDetails;
