import { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import contactImg from "../assets/img/contact-img.svg";
import 'animate.css';
import TrackVisibility from 'react-on-screen';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5001';

export const Contact = () => {
  const formInitialDetails = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: ''
  }

  const formInitialErrors = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: ''
  }

  const [formDetails, setFormDetails] = useState(formInitialDetails);
  const [formErrors, setFormErrors] = useState(formInitialErrors);
  const [buttonText, setButtonText] = useState('Send');
  const [status, setStatus] = useState({});

  // Validation functions
  const validateField = (name, value) => {
    let error = '';
    switch (name) {
      case 'firstName':
      case 'lastName':
        if (!value.trim()) {
          error = `${name === 'firstName' ? 'First' : 'Last'} name is required`;
        } else if (value.length < 2) {
          error = `${name === 'firstName' ? 'First' : 'Last'} name must be at least 2 characters`;
        } else if (!/^[a-zA-Z\s]*$/.test(value)) {
          error = 'Only letters and spaces are allowed';
        }
        break;

      case 'email':
        if (!value) {
          error = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = 'Please enter a valid email address';
        }
        break;

      case 'phone':
        if (!value) {
          error = 'Phone number is required';
        } else if (!/^[\d\s+()-]{10,}$/.test(value)) {
          error = 'Please enter a valid phone number (minimum 10 digits)';
        }
        break;

      case 'message':
        if (!value.trim()) {
          error = 'Message is required';
        } else if (value.length < 10) {
          error = 'Message must be at least 10 characters long';
        } else if (value.length > 1000) {
          error = 'Message must not exceed 1000 characters';
        }
        break;

      default:
        break;
    }
    return error;
  };

  const validateForm = () => {
    const errors = {};
    let isValid = true;

    Object.keys(formDetails).forEach(key => {
      const error = validateField(key, formDetails[key]);
      errors[key] = error;
      if (error) isValid = false;
    });

    setFormErrors(errors);
    return isValid;
  };

  const onFormUpdate = (category, value) => {
    setFormDetails({
      ...formDetails,
      [category]: value
    });

    // Real-time validation
    const error = validateField(category, value);
    setFormErrors(prev => ({
      ...prev,
      [category]: error
    }));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setStatus({
        success: false,
        message: "Please fix the errors in the form"
      });
      return;
    }

    setButtonText("Sending...");
    try {
      console.log('Sending request to:', BACKEND_URL);
      console.log('Form details:', formDetails);
      
      const response = await fetch(`${BACKEND_URL}/api/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(formDetails),
        mode: 'cors',
        credentials: 'omit'
      });
      
      console.log('Response status:', response.status);
      const result = await response.json();
      console.log('Response data:', result);
      
      if (response.ok) {
        setFormDetails(formInitialDetails);
        setFormErrors(formInitialErrors);
        setStatus({ 
          success: true, 
          message: "Thank you for your message. I'll get back to you soon!" 
        });
      } else {
        let errorMessage = "Failed to send message. ";
        if (result.errors) {
          errorMessage += Object.values(result.errors).join(". ");
        } else if (result.message) {
          errorMessage += result.message;
        } else {
          errorMessage += "Please try again later.";
        }
        setStatus({ success: false, message: errorMessage });
      }
    } catch (error) {
      console.error("Error details:", error);
      setStatus({ 
        success: false, 
        message: "Network error. Please check your connection and try again." 
      });
    } finally {
      setButtonText("Send");
    }
  };

  return (
    <section className="contact" id="connect">
      <Container>
        <Row className="align-items-center">
          <Col size={12} md={6}>
            <TrackVisibility partialVisibility once>
              {({ isVisible }) =>
                <img className={isVisible ? "animate__animated animate__zoomIn" : ""} src={contactImg} alt="Contact Us"/>
              }
            </TrackVisibility>
          </Col>
          <Col size={12} md={6}>
            <TrackVisibility partialVisibility once>
              {({ isVisible }) =>
                <div className={isVisible ? "animate__animated animate__fadeIn" : ""}>
                <h2>Get In Touch</h2>
                <form onSubmit={handleSubmit}>
                  <Row>
                    <Col size={12} sm={6} className="px-1">
                      <input 
                        type="text" 
                        value={formDetails.firstName} 
                        placeholder="First Name" 
                        onChange={(e) => onFormUpdate('firstName', e.target.value)}
                        className={formErrors.firstName ? 'error' : ''}
                        required 
                      />
                      {formErrors.firstName && <div className="error-message">{formErrors.firstName}</div>}
                    </Col>
                    <Col size={12} sm={6} className="px-1">
                      <input 
                        type="text" 
                        value={formDetails.lastName} 
                        placeholder="Last Name" 
                        onChange={(e) => onFormUpdate('lastName', e.target.value)}
                        className={formErrors.lastName ? 'error' : ''}
                        required 
                      />
                      {formErrors.lastName && <div className="error-message">{formErrors.lastName}</div>}
                    </Col>
                    <Col size={12} sm={6} className="px-1">
                      <input 
                        type="email" 
                        value={formDetails.email} 
                        placeholder="Email Address" 
                        onChange={(e) => onFormUpdate('email', e.target.value)}
                        className={formErrors.email ? 'error' : ''}
                        required 
                      />
                      {formErrors.email && <div className="error-message">{formErrors.email}</div>}
                    </Col>
                    <Col size={12} sm={6} className="px-1">
                      <input 
                        type="tel" 
                        value={formDetails.phone} 
                        placeholder="Phone No." 
                        onChange={(e) => onFormUpdate('phone', e.target.value)}
                        className={formErrors.phone ? 'error' : ''}
                        required 
                      />
                      {formErrors.phone && <div className="error-message">{formErrors.phone}</div>}
                    </Col>
                    <Col size={12} className="px-1">
                      <textarea 
                        rows="6" 
                        value={formDetails.message} 
                        placeholder="Message" 
                        onChange={(e) => onFormUpdate('message', e.target.value)}
                        className={formErrors.message ? 'error' : ''}
                        required
                      ></textarea>
                      {formErrors.message && <div className="error-message">{formErrors.message}</div>}
                      <button type="submit" disabled={Object.keys(formErrors).some(key => formErrors[key])}>
                        <span>{buttonText}</span>
                      </button>
                    </Col>
                    {status.message && (
                      <Col>
                        <div className={status.success === false ? "danger" : "success"}>
                          {status.message}
                        </div>
                      </Col>
                    )}
                  </Row>
                </form>
              </div>}
            </TrackVisibility>
          </Col>
        </Row>
      </Container>
    </section>
  )
}
