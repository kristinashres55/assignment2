import React, { useState, useEffect } from "react";
import PropertyForm from "./components/PropertyForm/PropertyForm";
import PriceChart from "./components/PriceChart";
import {
  trainModel,
  saveModelToLocalStorage,
  loadModelFromLocalStorage,
} from "./components/trainModel";
import dataset from "./dataset.json";
import Home from "./components/Home/Home";
import Navbar from "./components/Navigation/Navbar";

const App = () => {
  const [net, setNet] = useState(null);
  const [predictedPrice, setPredictedPrice] = useState(null);
  const [datasetWithPredictions, setDatasetWithPredictions] = useState([]);
  const [isModelLoading, setIsModelLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadModel = async () => {
      try {
        let trainedNet = loadModelFromLocalStorage(); // Try to load the model from LocalStorage
        if (!trainedNet) {
          trainedNet = await trainModel(); // If no model in LocalStorage, train a new model
        }
        setNet(trainedNet);
        setIsModelLoading(false);
      } catch (err) {
        console.error("Error loading the model:", err);
        setError("Failed to load the model. Please try again later.");
        setIsModelLoading(false);
      }
    };
    loadModel();
  }, []);

  const handlePrediction = (formData) => {
    if (!net) {
      console.error("Model is not loaded yet.");
      return;
    }

    const input = {
      area: parseFloat(formData.area),
      bedrooms: parseFloat(formData.bedrooms),
      bathrooms: parseFloat(formData.bathrooms),
      location: parseInt(formData.location, 10),
      age: parseFloat(formData.age),
    };

    const output = net.run(input);
    const predictedPrice = output.price;

    setPredictedPrice(predictedPrice);

    // Find the closest actual price from the dataset based on input similarity
    const closestMatch = dataset.reduce((prev, curr) => {
      const prevDiff =
        Math.abs(prev.area - input.area) +
        Math.abs(prev.bedrooms - input.bedrooms) +
        Math.abs(prev.bathrooms - input.bathrooms) +
        Math.abs(prev.location - input.location) +
        Math.abs(prev.age - input.age);

      const currDiff =
        Math.abs(curr.area - input.area) +
        Math.abs(curr.bedrooms - input.bedrooms) +
        Math.abs(curr.bathrooms - input.bathrooms) +
        Math.abs(curr.location - input.location) +
        Math.abs(curr.age - input.age);

      return currDiff < prevDiff ? curr : prev;
    });

    // Update dataset with actual and predicted prices
    setDatasetWithPredictions((prevDataset) => [
      ...prevDataset,
      {
        ...input,
        price: closestMatch.price, // Actual price
        predictedPrice, // Predicted price
      },
    ]);
  };

  const handleSaveModel = () => {
    if (net) {
      saveModelToLocalStorage(net); // Save the trained model to LocalStorage
      alert("Model saved to LocalStorage.");
    }
  };

  const handleLoadModel = () => {
    const loadedNet = loadModelFromLocalStorage(); // Load the model from LocalStorage
    if (loadedNet) {
      setNet(loadedNet);
      alert("Model loaded from LocalStorage.");
    } else {
      alert("No model found in LocalStorage.");
    }
  };

  return (
    <div>
      <Navbar />
      <Home />
      <div className="container w-50 max-w-xs mx-auto p-4 shadow-lg rounded-lg bg-white mt-lg-5">
        {isModelLoading && (
          <div className="p-4 bg-blue-100 border-l-4 border-blue-500 text-blue-700 text-sm">
            <p>Loading model...</p>
          </div>
        )}
        {error && (
          <div className="p-4 bg-red-100 border-l-4 border-red-500 text-red-700 text-sm">
            <p>{error}</p>
          </div>
        )}

        <PropertyForm
          onPredict={handlePrediction}
          disabled={isModelLoading || !!error}
        />

        {predictedPrice !== null && (
          <div
            className="p-2 w-50 mx-auto text-sm text-center"
            style={{ border: "2px solid green" }}
          >
            <p>
              Predicted Price:{" "}
              <strong>USD {(predictedPrice * 1000000).toFixed(2)}</strong>
            </p>
          </div>
        )}

        {/* Buttons for saving and loading model */}
        <div className="mt-4 text-center">
          <button onClick={handleSaveModel} className="btn btn-success mx-2">
            Save Model
          </button>
          <button onClick={handleLoadModel} className="btn btn-primary mx-2">
            Load Model
          </button>
        </div>
      </div>

      {datasetWithPredictions.length > 0 && (
        <div className="mt-4 w-50 mx-auto ">
          <PriceChart dataset={datasetWithPredictions} />
        </div>
      )}
    </div>
  );
};

export default App;
