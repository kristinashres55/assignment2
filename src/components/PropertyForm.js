import React, { useState } from "react";
import {
  FaHome,
  FaBed,
  FaBath,
  FaMapMarkerAlt,
  FaCalendarAlt,
} from "react-icons/fa";

const PropertyForm = ({ onPredict, disabled }) => {
  const [formData, setFormData] = useState({
    area: "",
    bedrooms: "",
    bathrooms: "",
    location: "", // Numeric value for location (1, 2, or 3)
    age: "",
  });

  const [errors, setErrors] = useState({}); // State to store validation errors

  // Define min and max values for normalization and validation
  const minMaxValues = {
    area: { min: 500, max: 5000 }, // Example values, adjust based on your dataset
    bedrooms: { min: 1, max: 5 },
    bathrooms: { min: 1, max: 4 },
    location: { min: 1, max: 3 },
    age: { min: 0, max: 100 },
  };

  const normalize = (value, min, max) => {
    return (value - min) / (max - min);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" }); // Clear the error for the current field
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate inputs before proceeding
    if (!validateInputs()) {
      return; // Stop if there are validation errors
    }

    // Normalize inputs
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

    // Pass the normalized input to the parent component for prediction
    onPredict(normalizedInput);

    // Reset the form fields
    setFormData({
      area: "",
      bedrooms: "",
      bathrooms: "",
      location: "",
      age: "",
    });
  };

  return (
    <div className="container mx-auto p-6 bg-white shadow-md rounded-md max-w-lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Area */}
        <div className="relative">
          <label htmlFor="area" className="block text-lg font-semibold mb-2">
            Area (sq ft):
          </label>
          <input
            type="number"
            id="area"
            name="area"
            value={formData.area}
            onChange={handleChange}
            className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 ${
              errors.area
                ? "border-red-500 focus:ring-red-500"
                : "focus:ring-blue-500"
            }`}
            required
            disabled={disabled}
          />
          {errors.area && (
            <p className="text-red-500 text-sm mt-1">{errors.area}</p>
          )}
          <FaHome className="absolute top-3 right-3 text-gray-500" />
        </div>

        {/* Bedrooms */}
        <div className="relative">
          <label
            htmlFor="bedrooms"
            className="block text-lg font-semibold mb-2"
          >
            Bedrooms:
          </label>
          <input
            type="number"
            id="bedrooms"
            name="bedrooms"
            value={formData.bedrooms}
            onChange={handleChange}
            className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 ${
              errors.bedrooms
                ? "border-red-500 focus:ring-red-500"
                : "focus:ring-blue-500"
            }`}
            required
            disabled={disabled}
          />
          {errors.bedrooms && (
            <p className="text-red-500 text-sm mt-1">{errors.bedrooms}</p>
          )}
          <FaBed className="absolute top-3 right-3 text-gray-500" />
        </div>

        {/* Bathrooms */}
        <div className="relative">
          <label
            htmlFor="bathrooms"
            className="block text-lg font-semibold mb-2"
          >
            Bathrooms:
          </label>
          <input
            type="number"
            id="bathrooms"
            name="bathrooms"
            value={formData.bathrooms}
            onChange={handleChange}
            className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 ${
              errors.bathrooms
                ? "border-red-500 focus:ring-red-500"
                : "focus:ring-blue-500"
            }`}
            required
            disabled={disabled}
          />
          {errors.bathrooms && (
            <p className="text-red-500 text-sm mt-1">{errors.bathrooms}</p>
          )}
          <FaBath className="absolute top-3 right-3 text-gray-500" />
        </div>

        {/* Location */}
        <div className="relative">
          <label
            htmlFor="location"
            className="block text-lg font-semibold mb-2"
          >
            Location:
          </label>
          <select
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 ${
              errors.location
                ? "border-red-500 focus:ring-red-500"
                : "focus:ring-blue-500"
            }`}
            required
            disabled={disabled}
          >
            <option value="">Select Location</option>
            <option value="1">Downtown</option>
            <option value="2">Suburban</option>
            <option value="3">Rural</option>
          </select>
          {errors.location && (
            <p className="text-red-500 text-sm mt-1">{errors.location}</p>
          )}
          <FaMapMarkerAlt className="absolute top-3 right-3 text-gray-500" />
        </div>

        {/* Age of Property */}
        <div className="relative">
          <label htmlFor="age" className="block text-lg font-semibold mb-2">
            Age of Property:
          </label>
          <input
            type="number"
            id="age"
            name="age"
            value={formData.age}
            onChange={handleChange}
            className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 ${
              errors.age
                ? "border-red-500 focus:ring-red-500"
                : "focus:ring-blue-500"
            }`}
            required
            disabled={disabled}
          />
          {errors.age && (
            <p className="text-red-500 text-sm mt-1">{errors.age}</p>
          )}
          <FaCalendarAlt className="absolute top-3 right-3 text-gray-500" />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400"
          disabled={disabled}
        >
          Predict Price
        </button>
      </form>
    </div>
  );
};

export default PropertyForm;
