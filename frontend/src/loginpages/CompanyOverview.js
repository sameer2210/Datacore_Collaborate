import { useContext, useEffect, useState } from 'react';
import { Button, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FormContext } from '../context/FormContext';
import axios from '../instant/axios';
import Sidebar from '../shared/Sidebar';
import Header from './Header';

function CompanyOverview() {
  const { updateFormData } = useContext(FormContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    industryName: '',
    licenseNumber: '',
    location: '',
    establishmentYear: '',
    contactPerson: '',
    address1: '',
    address2: '',
    city: '',
    country: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [companyId, setCompanyId] = useState(null); // user ki existing company id

  //  Load existing company data
  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const res = await axios.get('/company', { withCredentials: true }); // important: cookies send
        console.log(res.data);

        if (res.data && res.data.length > 0) {
          const company = res.data[0];
          setFormData(company);
          setCompanyId(company._id);
          updateFormData('companyOverview', company);
        }
      } catch (error) {
        console.error('Error fetching company data:', error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyData();
  }, []);

  //  Validation
  const validate = () => {
    const newErrors = {};
    if (!formData.industryName) newErrors.industryName = 'Industry Name is required';
    if (!formData.licenseNumber) newErrors.licenseNumber = 'License Number is required';
    if (!formData.location) newErrors.location = 'Location is required';
    if (!formData.establishmentYear) newErrors.establishmentYear = 'Establishment Year is required';
    if (!formData.contactPerson) newErrors.contactPerson = 'Contact Person is required';
    if (!formData.address1) newErrors.address1 = 'Address Line 1 is required';
    if (!formData.city) newErrors.city = 'City is required';
    if (!formData.country) newErrors.country = 'Country is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  //  Handle input changes
  const handleChange = e => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  //  Handle form submit
  const handleSubmit = async e => {
    e.preventDefault();
    if (!validate()) return;

    updateFormData('companyOverview', formData);

    try {
      let res;
      if (companyId) {
        // Update existing company
        res = await axios.put(`/company/${companyId}`, formData, { withCredentials: true });
      } else {
        // Create new company
        res = await axios.post('/company', formData, { withCredentials: true });
        setCompanyId(res.data.company._id); // save id for future updates
      }

      console.log('Data saved successfully:', res.data);
      setFormData(res.data.company || formData);
      navigate('/productiondetails');
    } catch (error) {
      console.error('Error saving data:', error.response?.data || error.message);
      alert('Failed to save data');
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
          <div className="col-md-8">
            <div className="form-section">
              <h5 className="mb-4">Company Information</h5>
              <form onSubmit={handleSubmit}>
                {/* Industry Details */}
                <div className="row mb-3">
                  <div className="col-md-12 mb-3">
                    <input
                      type="text"
                      className="form-control"
                      name="industryName"
                      placeholder="Industry Name"
                      value={formData.industryName}
                      onChange={handleChange}
                    />
                    {errors.industryName && (
                      <small className="text-danger">{errors.industryName}</small>
                    )}
                  </div>
                  <div className="col-md-6 mb-3">
                    <input
                      type="text"
                      className="form-control"
                      name="licenseNumber"
                      placeholder="Industry License Number"
                      value={formData.licenseNumber}
                      onChange={handleChange}
                    />
                    {errors.licenseNumber && (
                      <small className="text-danger">{errors.licenseNumber}</small>
                    )}
                  </div>
                  <div className="col-md-6 mb-3">
                    <input
                      type="text"
                      className="form-control"
                      name="location"
                      placeholder="Location"
                      value={formData.location}
                      onChange={handleChange}
                    />
                    {errors.location && <small className="text-danger">{errors.location}</small>}
                  </div>
                  <div className="col-md-6 mb-3">
                    <input
                      type="text"
                      className="form-control"
                      name="establishmentYear"
                      placeholder="Year of Establishment"
                      value={formData.establishmentYear}
                      onChange={handleChange}
                    />
                    {errors.establishmentYear && (
                      <small className="text-danger">{errors.establishmentYear}</small>
                    )}
                  </div>
                  <div className="col-md-6 mb-3">
                    <input
                      type="text"
                      className="form-control"
                      name="contactPerson"
                      placeholder="Contact Person"
                      value={formData.contactPerson}
                      onChange={handleChange}
                    />
                    {errors.contactPerson && (
                      <small className="text-danger">{errors.contactPerson}</small>
                    )}
                  </div>
                </div>

                {/* Address */}
                <h6 className="mt-4">Address</h6>
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control mb-2"
                    name="address1"
                    placeholder="Address line 1"
                    value={formData.address1}
                    onChange={handleChange}
                  />
                  {errors.address1 && <small className="text-danger">{errors.address1}</small>}

                  <input
                    type="text"
                    className="form-control mb-2"
                    name="address2"
                    placeholder="Address line 2"
                    value={formData.address2}
                    onChange={handleChange}
                  />

                  <input
                    type="text"
                    className="form-control mb-2"
                    name="city"
                    placeholder="City"
                    value={formData.city}
                    onChange={handleChange}
                  />
                  {errors.city && <small className="text-danger">{errors.city}</small>}

                  <input
                    type="text"
                    className="form-control"
                    name="country"
                    placeholder="Country"
                    value={formData.country}
                    onChange={handleChange}
                  />
                  {errors.country && <small className="text-danger">{errors.country}</small>}
                </div>

                <Button type="submit" className="btn btn-custom w-100">
                  Save & Next
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CompanyOverview;
