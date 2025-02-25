import React, { useState, useEffect } from "react";
import PropertyForm from "./components/PropertyForm";
import trainModel from "./components/trainModel";

const App = () => {
  const [net, setNet] = useState(null); // Store the trained neural network
  const [predictedPrice, setPredictedPrice] = useState(null); // Store the predicted price
  const [isModelLoading, setIsModelLoading] = useState(true); // Track model loading state
  const [error, setError] = useState(null); // Handle errors during model training

  useEffect(() => {
    const loadModel = async () => {
      try {
        const trainedNet = await trainModel(); // Train the model
        setNet(trainedNet); // Set the trained model
        setIsModelLoading(false);
      } catch (err) {
        console.error("Error loading the model:", err);
        setError("Failed to load the model. Please try again later.");
        setIsModelLoading(false);
      }
    };
    loadModel();
  }, []);

  // Handle prediction from PropertyForm
  const handlePrediction = (formData) => {
    if (!net) {
      console.error("Model is not loaded yet.");
      return;
    }

    // Prepare input for the neural network
    const input = {
      area: parseFloat(formData.area),
      bedrooms: parseFloat(formData.bedrooms),
      bathrooms: parseFloat(formData.bathrooms),
      location: parseInt(formData.location, 10),
      age: parseFloat(formData.age),
    };

    const output = net.run(input);
    setPredictedPrice(output.price);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Property Price Predictor</h1>

      {isModelLoading && (
        <div className="p-4 bg-blue-100 border-l-4 border-blue-500 text-blue-700">
          <p>Loading model...</p>
        </div>
      )}
      {error && (
        <div className="p-4 bg-red-100 border-l-4 border-red-500 text-red-700">
          <p>{error}</p>
        </div>
      )}

      <PropertyForm
        onPredict={handlePrediction}
        disabled={isModelLoading || !!error}
      />

      {predictedPrice !== null && (
        <div className="mt-4 p-4 bg-green-100 border-l-4 border-green-500 text-green-700">
          <p>
            Predicted Price:{" "}
            <strong>USD {(predictedPrice * 1000000).toFixed(2)}</strong>
          </p>
        </div>
      )}
    </div>
  );
};

export default App;
