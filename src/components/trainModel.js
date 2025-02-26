import * as brain from "brain.js";
import dataset from "../dataset.json"; // Import dataset directly from src

// Function to save the trained model to LocalStorage
const saveModelToLocalStorage = (net) => {
  try {
    const modelJSON = JSON.stringify(net.toJSON());
    localStorage.setItem("trainedModel", modelJSON);
    console.log("Model successfully saved to LocalStorage!");
  } catch (error) {
    console.error("Error saving model to LocalStorage:", error);
    throw new Error("Failed to save model to LocalStorage");
  }
};

// Function to load the trained model from LocalStorage
const loadModelFromLocalStorage = () => {
  try {
    const storedModel = localStorage.getItem("trainedModel");
    if (storedModel) {
      const net = new brain.NeuralNetwork();
      net.fromJSON(JSON.parse(storedModel));
      console.log("Model loaded from LocalStorage!");
      return net;
    }
  } catch (error) {
    console.error("Error loading model from LocalStorage:", error);
    throw new Error("Failed to load model from LocalStorage");
  }
  return null;
};

// Function to train a new model
const trainModel = async () => {
  // Check if a trained model exists in LocalStorage
  let net = loadModelFromLocalStorage();

  // If the model is already stored, return it directly
  if (net) {
    console.log("Using stored model from LocalStorage.");
    return net;
  }

  // If no stored model, create and train a new one
  net = new brain.NeuralNetwork();

  try {
    // Use the imported dataset directly
    if (!Array.isArray(dataset) || dataset.length === 0) {
      throw new Error("Dataset is empty or invalid");
    }

    // Prepare training data
    const trainingData = dataset.map((item) => ({
      input: {
        area: item.area,
        bedrooms: item.bedrooms,
        bathrooms: item.bathrooms,
        location: item.location, // Ensure lowercase 'location'
        age: item.age,
      },
      output: { price: item.price },
    }));

    // Train the model
    net.train(trainingData, {
      iterations: 2000,
      learningRate: 0.01,
      errorThresh: 0.005,
      // log: (details) => console.log(details), // Enable/disable logging as needed
    });

    console.log("Model trained successfully!");

    // Save trained model to LocalStorage
    saveModelToLocalStorage(net);

    return net;
  } catch (error) {
    console.error("Error training the model:", error);
    throw new Error("Failed to train the model");
  }
};

export { trainModel, saveModelToLocalStorage, loadModelFromLocalStorage };
