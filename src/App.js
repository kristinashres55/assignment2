import React, { useState } from "react";
import PropertyForm from "./components/PropertyForm/PropertyForm";
import PriceChart from "./components/PriceChart/PriceChart";
import {
  trainModel,
  saveModelToLocalStorage,
  loadModelFromLocalStorage,
} from "./components/trainModel";
import dataset from "./dataset.json";
import Home from "./components/Home/Home";
import Navbar from "./components/Navigation/Navbar";
import "./App.css";
import Footer from "./components/Footer/Footer";

const App = () => {
  const [net, setNet] = useState(null);
  const [predictedPrice, setPredictedPrice] = useState(null);
  const [datasetWithPredictions, setDatasetWithPredictions] = useState([]);
  const [isModelLoading, setIsModelLoading] = useState(false);
  const [error, setError] = useState(null);

  const trainAndSetModel = async () => {
    setIsModelLoading(true);
    setError(null); // Clear previous errors
    try {
      const trainedNet = await trainModel();
      setNet(trainedNet);
      setIsModelLoading(false);
      return trainedNet;
    } catch (err) {
      console.error("Error training the model:", err);
      setError("Failed to train the model. Please try again.");
      setIsModelLoading(false);
      return null;
    }
  };

  const handlePrediction = async (formData) => {
    let model = net;

    if (!model) {
      model = await trainAndSetModel(); // Train if no model is available
    }

    if (!model) {
      alert("Error: Model training failed. Cannot make predictions.");
      return;
    }

    const input = {
      area: parseFloat(formData.area),
      bedrooms: parseFloat(formData.bedrooms),
      bathrooms: parseFloat(formData.bathrooms),
      location: parseInt(formData.location, 10),
      age: parseFloat(formData.age),
    };

    const output = model.run(input);
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
      saveModelToLocalStorage(net);
      alert("Model saved to LocalStorage.");
    }
  };

  const handleLoadModel = () => {
    const loadedNet = loadModelFromLocalStorage();
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
      <div className="property-container">
        {isModelLoading && (
          <div className="p-4 bg-blue-100 border-l-4 border-blue-500 text-blue-700 text-sm">
            <p>Training model...</p>
          </div>
        )}
        {error && (
          <div className="p-4 bg-red-100 border-l-4 border-red-500 text-red-700 text-sm">
            <p>{error}</p>
          </div>
        )}

        <PropertyForm
          onPredict={handlePrediction}
          predictedPrice={predictedPrice}
          disabled={isModelLoading || !!error}
        />

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
        <div className="price-chart-container">
          <PriceChart dataset={datasetWithPredictions} />
        </div>
      )}
      <Footer />
    </div>
  );
};

export default App;
