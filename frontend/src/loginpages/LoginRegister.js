import React, { useState, useEffect, useRef } from "react";
import { Container, Row, Col, Form, Button, Card, ListGroup, Modal, InputGroup } from "react-bootstrap";
import { FaCheck, FaCross, FaEye, FaEyeSlash, FaTimesCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "../instant/axios";
import bgImg from "../assets/images/bg.jpg";
import logoImg from "../assets/images/logo.png";
import { FiUpload, FiX } from "react-icons/fi";

const LoginRegister = () => {

  const [success, setSuccess] = useState(false);
  const [showModal, setShowModal] = useState(false);


  const navigate = useNavigate();

  const handleFinish = () => {
    setSuccess(true);
  };

  const handleClose = () => {
    setSuccess(false);
    setShowModal(false);
  };
  const [id, setId] = useState();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState("");
  const [timer, setTimer] = useState(30);

  const inputRefs = useRef([]);

  useEffect(() => {
    const countdown = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(countdown);
  }, []);

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (value.length === 1 && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };
  const handleOtpChange = (e, index) => {
    const value = e.target.value.replace(/\D/, ""); // Only digits
    if (value) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      // Move to next input
      if (index < 5) inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (otp[index] === "") {
        if (index > 0) {
          inputRefs.current[index - 1]?.focus();
        }
      } else {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      }
    }
  };

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
  };
  const edit = () => {
    setEmail(email);
    setStep(1);
  };

  const sendOtp = async () => {
    try {
      const res = await axios.post(`/cra/send-email`, {
        email,
      });
      setStep(2);
      setEmail(email);
      setMessage(res.data.message || "OTP sent successfully.");
      setSuccess(true);

    } catch (err) {
      setMessage(err.response?.data?.error || "Failed to send OTP");
    }
  };

  const verifyOtp = async () => {
   try {
 // agar OTP input ek array return kar raha hai, join karo
const otpString = Array.isArray(otp) ? otp.join('') : otp;

const res = await axios.post(
  "/cra/verify-otp",
  { email, otp: otpString },  // ✅ send string, not array
  { headers: { "Content-Type": "application/json" }, withCredentials: true }
);

  console.log(res.data); // ✅ server ka response
  setMessage(res.data.message || "Email verified successfully.");
  setSuccess(true);
  setStep(3);
  setId(res.data.userId);
  console.log(res.data.userId);

} catch (err) {
  console.log(err.response?.data?.message);
  if (err.response?.data?.message === 'Email already verified') {
    setStep(3);
  } else {
    setMessage(err.response?.data?.message || "Failed to verify OTP");
    setSuccess(false);
    setShowModal(true);
  }
}

  };
  useEffect(() => {
    console.log("Step changed to:", step);
    setStep(step);
  }, [step]);

  useEffect(() => {
    console.log("Message updated:", message);
  }, [message]);

  const [name, setName] = useState("");
  const [profilePic, setProfilePic] = useState(null);

  const updateProfile = async (e) => {
    e.preventDefault();

    if (!name || !profilePic) {
      setMessage("Please enter name and select a profile picture.");
      return;
    }

    const formData = new FormData();
    const userId = localStorage.getItem("id") || "";
    formData.append("id", userId);
    formData.append("name", name);
    formData.append("profilePic", profilePic);

    try {
      const response = await axios.post(`/cra/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setMessage("Upload successful!");
      setSuccess(true);
    } catch (error) {
      setMessage("Upload failed!");
      console.error(error);
    }
  };


  const [password, setPassword] = useState(false);

  const [confirmPassword, setConfirmPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const validatePassword = (value) => {
    if (value.length < 8) {
      setPasswordError("Password must be at least 8 characters.");
      return false;
    }

    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/;
    if (!regex.test(value)) {
      setPasswordError("Password must include upper, lower, number, and symbol.");
      return false;
    }

    setPasswordError("");
    return true;
  };

  const validateConfirmPassword = (value) => {
    if (password !== value) {
      setConfirmPasswordError("Passwords do not match.");
      return false;
    }

    setConfirmPasswordError("");
    return true;
  };

  const updatePassword = async () => {
    const isPasswordValid = validatePassword(password);
    const isConfirmValid = validateConfirmPassword(confirmPassword);


    if (!isPasswordValid || !isConfirmValid) return;

    try {
      const res = await axios.post(`/cra/set-password`, {
        password,
        id
      },
        { withCredentials: true }
      );

      if (res) {
        console.log(res);

        setMessage("Your account has been created successfully");
        setStep(1);
        setShowModal(true);
        setSuccess(true);
        navigate('/company');
        // window.location = "https://ge3s.org";
      }
    } catch (err) {
      setMessage(err.response?.data?.error || "Failed to set password");
    }
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
                {step == 1 && (
                  <>
                    <Form className="climate-email-form">
                      <Form.Group controlId="formBasicEmail">
                        <Form.Label className="email-label">
                          Email Address*
                        </Form.Label>
                        <div className="email-input-group">
                          <Form.Control
                            type="email"
                            placeholder="Enter your email"
                            className="email-input"
                            onChange={(e) => setEmail(e.target.value)}
                            required
                          />
                        </div>
                      </Form.Group>
                    </Form>

                    <Button
                      variant="outline-secondary"
                      className="verify-btn mt-4 mb-2 fs-6 fw-bold"
                      onClick={sendOtp}
                      disabled={!email}
                    >
                      Verify
                    </Button>
                    {/* for temp */}
                    {/* <p className="login-text mt-3 text-center">
                      Already have an account?{" "}
                      <Link to="/registerverifyotp" className="login-link">
                        Login
                      </Link>
                    </p> */}
                  </>
                )}
                {step == 2 && (
                  <>
                    <div>
                      {" "}
                      <h5 className="text-black text-start">
                        Enter the OTP sent to your Email ID
                      </h5>
                      <div className="email-section">
                        <span>{email}</span>
                        <button className="edit-email" onClick={edit}>
                          Edit Email ID
                        </button>
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
                            ref={(el) => (inputRefs.current[index] = el)}
                            onChange={(e) => handleOtpChange(e, index)}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            value={otp[index]}
                          />
                        ))}
                      </div>
                      <Button
                        variant="outline-success"
                        className="verify-btn mt-4 mb-2 fs-6 fw-bold"
                        onClick={verifyOtp}
                      >
                        Verify
                      </Button>
                    </div>
                  </>
                )}

                {step == 3 && (
                  <>
                    <Form className="climate-email-form">
                      <Form.Group controlId="formBasicEmail" className="mb-3">
                        <Form.Control
                          type="email"
                          placeholder="Email Address"
                          className="py-3"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}

                        />
                      </Form.Group>

                      <Form.Group controlId="formBasicPassword" className="mb-3">
                        <InputGroup>
                          <Form.Control
                            type={showPassword ? "text" : "password"}
                            placeholder="Create Password"
                            className="py-3"
                            value={password}
                            onChange={(e) => {
                              setPassword(e.target.value);
                              validatePassword(e.target.value); validateConfirmPassword(e.target.value);
                            }}
                          // onBlur={validatePassword}
                          />
                          <InputGroup.Text
                            onClick={togglePasswordVisibility}
                            style={{ cursor: "pointer" }}
                            className="bg-white"
                          >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                          </InputGroup.Text>
                        </InputGroup>
                        {passwordError && <div className="text-danger mt-1">{passwordError}</div>}
                      </Form.Group>

                      <Form.Group controlId="formConfirmPassword" className="mb-3">
                        <InputGroup>
                          <Form.Control
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Re-enter Password"
                            className="py-3"
                            value={confirmPassword}
                            onChange={(e) => {
                              setConfirmPassword(e.target.value);
                              validateConfirmPassword(e.target.value);
                            }}
                          // onBlur={validatePassword}
                          />
                          <InputGroup.Text
                            onClick={toggleConfirmPasswordVisibility}
                            style={{ cursor: "pointer" }}
                            className="bg-white"
                          >
                            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                          </InputGroup.Text>
                        </InputGroup>
                        {confirmPasswordError && <div className="text-danger mt-1">{confirmPasswordError}</div>}
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
                      className="w-100 py-3 mt-2 fs-6 fw-bold"
                      onClick={updatePassword}
                      disabled={!agreeTerms}
                    >
                      Register Account
                    </Button></>
                )}

                {step == 4 && (
                  <>
                    <div
                      className="text-start mx-auto"
                      style={{ maxWidth: "500px" }}
                    >
                      <Card
                        className="upload-card mb-4"
                        style={{ height: "200px" }}
                      >
                        <Card.Body className="text-center p-3 d-flex flex-column justify-content-center">
                          {previewUrl ? (
                            <div className="position-relative">
                              <img
                                src={previewUrl}
                                alt="Preview"
                                className="img-thumbnail mb-2"
                                style={{
                                  width: "100px",
                                  height: "100px",
                                  borderRadius: "50%",
                                  objectFit: "cover",
                                }}
                              />
                              <Button
                                variant="link"
                                className="position-absolute top-0 end-0 text-danger p-0"
                                onClick={handleRemovePhoto}
                                style={{ transform: "translate(30%, -30%)" }}
                              >
                                <FiX size={18} />
                              </Button>
                              <p className="text-muted mb-2 small">
                                Photo uploaded
                              </p>
                              <Button
                                variant="outline-secondary"
                                size="sm"
                                onClick={() =>
                                  document.getElementById("fileInput").click()
                                }
                                className="py-1"
                              >
                                <FiUpload className="me-1" size={14} />
                                Re-upload
                              </Button>
                            </div>
                          ) : (
                            <>
                              <div className="upload-placeholder mb-2 p-3">
                                <FiUpload
                                  size={32}
                                  className="text-muted mb-1"
                                />
                                <p className="mb-1 small">Upload your photo</p>
                                <p className="text-muted small">
                                  JPG or PNG, max 5MB
                                </p>
                              </div>
                              <Button
                                variant="outline-primary"
                                size="sm"
                                onClick={() =>
                                  document.getElementById("fileInput").click()
                                }
                                className="py-1 px-3"
                              >
                                Select Photo
                              </Button>
                            </>
                          )}
                          <Form.Control
                            type="file"
                            id="fileInput"
                            accept="image/*"
                            onChange={(e) => setProfilePic(e.target.files[0])}
                            className="d-none"
                          />
                        </Card.Body>
                      </Card>

                      <Form className="climate-email-form">
                        <Form.Group controlId="formBasicName" className="mb-4">
                          <Form.Control
                            type="text"
                            placeholder="Your Full Name"
                            className="py-3"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                          />
                        </Form.Group>
                      </Form>

                      <Button
                        variant="secondary"
                        onClick={updateProfile}
                        className="w-100 py-3 fs-6 fw-bold"
                      >
                        Next
                      </Button>
                    </div>
                  </>
                )}

              </div>
            </div>
          </Col>
        </Row>
      </Container>
      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Body className="text-center p-5">
          <div className="mb-4">
            <div
              className={`d-inline-flex align-items-center justify-content-center rounded-circle p-3 ${success ? 'bg-success bg-opacity-10' : 'bg-danger bg-opacity-10'
                }`}
            >
              {success ? (
                <FaCheck className="text-success" size={32} />
              ) : (
                <FaTimesCircle className="text-danger" size={32} />
              )}
            </div>
          </div>
          <h4 className="mb-3">{message}</h4>
          <Button
            variant={success ? 'success' : 'danger'}
            className="px-5 py-2 rounded-5 fw-bold mt-3"
            onClick={handleClose}
          >
            Dismiss
          </Button>
        </Modal.Body>
      </Modal>

    </div>
  );
};

export default LoginRegister;
