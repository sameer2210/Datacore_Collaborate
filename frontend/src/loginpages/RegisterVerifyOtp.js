import React, { useState, useEffect, useRef } from "react";
import { Container, Row, Col, Button, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import bgImg from  "../assets/images/bg.jpg" 

import logoImg from  "../assets/images/logo.png" 

function RegisterVerifyOtp() {
 const baseUrl = process.env.REACT_APP_BASE_URL;
  const [timer, setTimer] = useState(30);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    const countdown = setInterval(() => {
      setTimer(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(countdown);
  }, []);

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (value.length === 1 && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleVerifyClick = () => {
    setShowSuccessModal(true);
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
  };

  return (
    <div className="fixed-container">
      <Container fluid className="p-0 h-100">
        <Row className="no-gutters h-100">
          <Col md={6} className="image-col">
            <div className="image-overlay"></div>
            <img
              src="https://img.freepik.com/free-photo/majestic-view-forest-surrounded-by-mountains-big-bear-california_181624-29110.jpg"
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

                <h5 className="text-black text-start">
                  Enter the OTP sent to your Email ID
                </h5>

                <div className="email-section">
                  <span>Aman@gmail.com</span>
                  <button className="edit-email">Edit Email ID</button>
                </div>

                <div className="timer-section">
                  <span className="timer">⏰ {timer}s</span>
                  <button className="resend-btn" disabled={timer > 0}>
                    Resend OTP
                  </button>
                </div>

                <div className="otp-boxes">
                  {[...Array(6)].map((_, index) => (
                    <input
                      key={index}
                      type="text"
                      maxLength="1"
                      className="otp-input"
                      ref={el => (inputRefs.current[index] = el)}
                      onChange={e => handleChange(e, index)}
                    />
                  ))}
                </div>

                <Button
                  variant="outline-success"
                  className="verify-btn mt-4 mb-2 fs-6 fw-bold"
                  onClick={handleVerifyClick}
                >
                  Verify
                </Button>
              </div>
            </div>
          </Col>
        </Row>
      </Container>

   
      <Modal show={showSuccessModal} onHide={handleCloseModal} centered>
        <Modal.Body className="text-center">
          <img
            src="https://cdn-icons-png.flaticon.com/512/845/845646.png"
            alt="Success"
            width="80"
            className="mb-3"
          />
          <h5>Your account has been created successfully</h5>

          <Button
            variant="success"
            className="w-100 mt-3"
            as={Link}
            to="/registeraccount"
            onClick={handleCloseModal}
          >
            Continue
          </Button>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default RegisterVerifyOtp;
