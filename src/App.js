import React, { useState, useEffect } from "react";
import PropertyForm from "./components/PropertyForm";
import PriceChart from "./components/PriceChart";
import trainModel from "./components/trainModel";
import dataset from "./createDataset.json"; // Import dataset for actual prices
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
        const trainedNet = await trainModel();
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
