import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  InputGroup,
  FormCheck,
} from "react-bootstrap";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link } from "react-router-dom";
import bgImg from  "../assets/images/bg.jpg" 
import logoImg from  "../assets/images/logo.png" 

function CreatePassword() {
  
 const baseUrl = process.env.REACT_APP_BASE_URL;
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };
  return (
    <div className="fixed-container">
      <Container fluid className="p-0 h-100">
        <Row className="no-gutters h-100">
          <Col md={6} className="image-col">
            <div className="image-overlay"></div>
            <img
              src={bgImg}
              alt="Climate landscape"
              className="object-fit-cover"
            />
            <div className="image-text">
              <h2 className="fs-4 text-black">
              Transform your Emissions Data Into Actionable Insights
              </h2>
            </div>
          </Col>

          <Col md={6} className="climate-form d-flex align-items-center">
            <div className="form-content w-100 px-4 px-lg-5 text-center">
              <div className="text-start mx-auto" style={{ maxWidth: "500px" }}>
                <img
                 src={logoImg}
                  alt="Logo"
                  className="img-fluid mb-4"
                  style={{ width: "20%" }}
                />

                <h3>Register Account</h3>
                <p className="climate-subtext mb-4">
                  Join us to access sustainability reports and track
                  <br />
                  your progress towards a greener future.
                </p>

                <Form className="climate-email-form">
                  <Form.Group controlId="formBasicEmail" className="mb-3">
                    <Form.Control
                      type="email"
                      placeholder="Email Address"
                      className="py-3"
                    />
                  </Form.Group>

                  <Form.Group controlId="formBasicPassword" className="mb-3">
                    <InputGroup>
                      <Form.Control
                        type={showPassword ? "text" : "password"}
                        placeholder="Create Password"
                        className="py-3"
                      />
                      <InputGroup.Text
                        onClick={togglePasswordVisibility}
                        style={{ cursor: "pointer" }}
                        className="bg-white"
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </InputGroup.Text>
                    </InputGroup>
                  </Form.Group>

                
                  <Form.Group
                    controlId="formTermsCheckbox"
                    className="mb-4 mt-3"
                  >
                    <Form.Check
                      type="checkbox"
                      label="I agree to terms & conditions"
                      checked={agreeTerms}
                      onChange={e => setAgreeTerms(e.target.checked)}
                      className="terms-checkbox"
                    />
                  </Form.Group>
                </Form>

                <Button
                  variant="success"
                  as={Link}
                  to="/setupprofile"
                  className="w-100 py-3 mt-2 fs-6 fw-bold"
                  // disabled={!agreeTerms}
                >
                  Register Account
                </Button>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default CreatePassword;
