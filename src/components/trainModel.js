import * as brain from "brain.js";

// Function to save the trained model to LocalStorage
const saveModelToLocalStorage = (net) => {
  try {
    const modelJSON = JSON.stringify(net.toJSON());
    localStorage.setItem("trainedModel", modelJSON);
    console.log("Model successfully saved to LocalStorage!");
  } catch (error) {
    console.error("Error saving model to LocalStorage:", error);
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
  }
  return null;
};

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
    // Fetch the dataset from dataset.json
    const response = await fetch("/dataset.json");
    if (!response.ok) {
      throw new Error("Failed to fetch dataset");
    }
    const dataset = await response.json();

    // Prepare training data
    const trainingData = dataset.map((item) => ({
      input: {
        area: item.area,
        bedrooms: item.bedrooms,
        bathrooms: item.bathrooms,
        location: item.Location, // Use encoded location value
        age: item.age,
      },
      output: { price: item.price }, // Price is normalized
    }));

    // Train the model
    net.train(trainingData, {
      iterations: 2000,
      learningRate: 0.01,
      errorThresh: 0.005,
      log: (details) => console.log(details), // Log training progress
    });

    console.log("Model trained successfully!");

    // Save trained model to LocalStorage
    saveModelToLocalStorage(net);

    return net;
  } catch (error) {
    console.error("Error loading or training the model:", error);
    throw error;
  }
};

export default trainModel;
