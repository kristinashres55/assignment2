import * as brain from "brain.js";

const trainModel = async () => {
  const net = new brain.NeuralNetwork();

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
        location: item.Location, // Use the encoded Location value
        age: item.age,
      },
      output: { price: item.price }, // Price is already normalized
    }));

    // Train the model
    net.train(trainingData, {
      iterations: 2000,
      learningRate: 0.01,
      errorThresh: 0.005,
      log: (details) => console.log(details),
    });

    console.log("Training data:", trainingData);
    console.log("Model trained successfully!");

    // Test the model with a sample input
    const testInput = {
      area: 0.5,
      bedrooms: 0.5,
      bathrooms: 0.5,
      location: 2,
      age: 0.5,
    };
    const output = net.run(testInput);
    console.log("Predicted price:", output.price);

    return net;
  } catch (error) {
    console.error("Error loading or training the model:", error);
    throw error;
  }
};

export default trainModel;
