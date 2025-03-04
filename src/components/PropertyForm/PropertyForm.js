import React, { useState, useEffect } from "react";
import { Form, Button, InputGroup, Col, Row } from "react-bootstrap";
import { FaHome, FaBed, FaBath, FaCalendarAlt } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import "./PropertyForm.css";

const PropertyForm = ({ onPredict, disabled, predictedPrice }) => {
  const [formData, setFormData] = useState({
    area: "",
    bedrooms: "",
    bathrooms: "",
    location: "",
    age: "",
  });

  const [errors, setErrors] = useState({});
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(null);

  const minMaxValues = {
    area: { min: 500, max: 6000 },
    bedrooms: { min: 1, max: 5 },
    bathrooms: { min: 1, max: 4 },
    location: { min: 1, max: 3 },
    age: { min: 0, max: 100 },
  };

  useEffect(() => {
    if (predictedPrice !== null) {
      setFeedbackSubmitted(null);
    }
  }, [predictedPrice]);

  const normalize = (value, min, max) => {
    return (value - min) / (max - min);
  };

  const validateInputs = () => {
    const newErrors = {};

    if (!formData.area || isNaN(formData.area)) {
      newErrors.area = "Area is required and must be a number.";
    } else if (
      formData.area < minMaxValues.area.min ||
      formData.area > minMaxValues.area.max
    ) {
      newErrors.area = `Area must be between ${minMaxValues.area.min} and ${minMaxValues.area.max}.`;
    }

    if (!formData.bedrooms || isNaN(formData.bedrooms)) {
      newErrors.bedrooms = "Bedrooms is required and must be a number.";
    } else if (
      formData.bedrooms < minMaxValues.bedrooms.min ||
      formData.bedrooms > minMaxValues.bedrooms.max
    ) {
      newErrors.bedrooms = `Bedrooms must be between ${minMaxValues.bedrooms.min} and ${minMaxValues.bedrooms.max}.`;
    }

    if (!formData.bathrooms || isNaN(formData.bathrooms)) {
      newErrors.bathrooms = "Bathrooms is required and must be a number.";
    } else if (
      formData.bathrooms < minMaxValues.bathrooms.min ||
      formData.bathrooms > minMaxValues.bathrooms.max
    ) {
      newErrors.bathrooms = `Bathrooms must be between ${minMaxValues.bathrooms.min} and ${minMaxValues.bathrooms.max}.`;
    }

    if (!formData.location) {
      newErrors.location = "Location is required.";
    } else if (
      formData.location < minMaxValues.location.min ||
      formData.location > minMaxValues.location.max
    ) {
      newErrors.location = `Location must be between ${minMaxValues.location.min} and ${minMaxValues.location.max}.`;
    }

    if (!formData.age || isNaN(formData.age)) {
      newErrors.age = "Age is required and must be a number.";
    } else if (
      formData.age < minMaxValues.age.min ||
      formData.age > minMaxValues.age.max
    ) {
      newErrors.age = `Age must be between ${minMaxValues.age.min} and ${minMaxValues.age.max}.`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateInputs()) {
      return;
    }

    const normalizedInput = {
      area: normalize(
        parseFloat(formData.area),
        minMaxValues.area.min,
        minMaxValues.area.max
      ),
      bedrooms: normalize(
        parseFloat(formData.bedrooms),
        minMaxValues.bedrooms.min,
        minMaxValues.bedrooms.max
      ),
      bathrooms: normalize(
        parseFloat(formData.bathrooms),
        minMaxValues.bathrooms.min,
        minMaxValues.bathrooms.max
      ),
      location: normalize(
        parseInt(formData.location, 10),
        minMaxValues.location.min,
        minMaxValues.location.max
      ),
      age: normalize(
        parseFloat(formData.age),
        minMaxValues.age.min,
        minMaxValues.age.max
      ),
    };

    onPredict(normalizedInput);
  };

  return (
    <div className="container">
      <h1 className="property-form-title">Property Price Predictor</h1>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={6} sm={12}>
            <Form.Group controlId="area" className="mb-3">
              <Form.Label>Area (sq ft)</Form.Label>
              <InputGroup>
                <Form.Control
                  type="number"
                  name="area"
                  value={formData.area}
                  onChange={handleChange}
                  isInvalid={!!errors.area}
                  disabled={disabled}
                />
                <InputGroup.Text>
                  <FaHome />
                </InputGroup.Text>
              </InputGroup>
              {errors.area && (
                <Form.Control.Feedback type="invalid" className="d-block">
                  {errors.area}
                </Form.Control.Feedback>
              )}
            </Form.Group>
          </Col>
          <Col md={6} sm={12}>
            <Form.Group controlId="bedrooms" className="mb-3">
              <Form.Label>Bedrooms</Form.Label>
              <InputGroup>
                <Form.Control
                  type="number"
                  name="bedrooms"
                  value={formData.bedrooms}
                  onChange={handleChange}
                  isInvalid={!!errors.bedrooms}
                  disabled={disabled}
                />
                <InputGroup.Text>
                  <FaBed />
                </InputGroup.Text>
              </InputGroup>
              {errors.bedrooms && (
                <Form.Control.Feedback type="invalid" className="d-block">
                  {errors.bedrooms}
                </Form.Control.Feedback>
              )}
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={6} sm={12}>
            <Form.Group controlId="bathrooms" className="mb-3">
              <Form.Label>Bathrooms</Form.Label>
              <InputGroup>
                <Form.Control
                  type="number"
                  name="bathrooms"
                  value={formData.bathrooms}
                  onChange={handleChange}
                  isInvalid={!!errors.bathrooms}
                  disabled={disabled}
                />
                <InputGroup.Text>
                  <FaBath />
                </InputGroup.Text>
              </InputGroup>
              {errors.bathrooms && (
                <Form.Control.Feedback type="invalid" className="d-block">
                  {errors.bathrooms}
                </Form.Control.Feedback>
              )}
            </Form.Group>
          </Col>
          <Col md={6} sm={12}>
            <Form.Group controlId="location" className="mb-3">
              <Form.Label>Location</Form.Label>
              <Form.Control
                as="select"
                name="location"
                value={formData.location}
                onChange={handleChange}
                isInvalid={!!errors.location}
                disabled={disabled}
              >
                <option value="">Select Location</option>
                <option value="1">Downtown</option>
                <option value="2">Suburban</option>
                <option value="3">Rural</option>
              </Form.Control>
              {errors.location && (
                <Form.Control.Feedback type="invalid" className="d-block">
                  {errors.location}
                </Form.Control.Feedback>
              )}
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={6} sm={12}>
            <Form.Group controlId="age" className="mb-3">
              <Form.Label>Age of Property</Form.Label>
              <InputGroup>
                <Form.Control
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  isInvalid={!!errors.age}
                  disabled={disabled}
                />
                <InputGroup.Text>
                  <FaCalendarAlt />
                </InputGroup.Text>
              </InputGroup>
              {errors.age && (
                <Form.Control.Feedback type="invalid" className="d-block">
                  {errors.age}
                </Form.Control.Feedback>
              )}
            </Form.Group>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col md={6} sm={12} className="text-center">
            <Button
              variant="primary"
              type="submit"
              className="w-50 mt-3"
              disabled={disabled}
            >
              Predict Price
            </Button>
          </Col>
        </Row>
      </Form>
      {predictedPrice !== null && (
        <div
          className="predicted-price mt-3"
          style={{ border: "2px solid green" }}
        >
          <p style={{ margin: 0 }}>
            Predicted Price:{" "}
            <strong>
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }).format(predictedPrice * 1000000)}
            </strong>
          </p>
        </div>
      )}
      {predictedPrice !== null && (
        <div className="mt-4">
          <h4 className="feedback-title">Was the prediction accurate?</h4>
          <Button
            variant="success"
            className="me-2"
            onClick={() => setFeedbackSubmitted("yes")}
          >
            👍 Yes
          </Button>
          <Button variant="danger" onClick={() => setFeedbackSubmitted("no")}>
            👎 No
          </Button>
          {feedbackSubmitted && (
            <div className="mt-3">
              {feedbackSubmitted === "yes" ? (
                <p className="text-success">Thank you for your feedback!</p>
              ) : (
                <p className="text-danger">
                  Sorry, we are working on improving our predictions. Thank you
                  for your feedback!
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PropertyForm;
