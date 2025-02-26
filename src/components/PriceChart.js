import React, { useEffect, useState } from "react";
import { Line, Bar } from "react-chartjs-2";
import "chart.js/auto";

const PriceChart = ({ dataset }) => {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [featureImportance, setFeatureImportance] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    if (dataset.length > 0) {
      // Prepare data for the actual vs. predicted price chart
      const labels = dataset.map((_, index) => `Property ${index + 1}`);
      const actualPrices = dataset.map((item) => item.price * 1000000);
      const predictedPrices = dataset.map(
        (item) => item.predictedPrice * 1000000
      );

      setChartData({
        labels,
        datasets: [
          {
            label: "Actual Price",
            data: actualPrices,
            borderColor: "#FF6384",
            fill: false,
          },
          {
            label: "Predicted Price",
            data: predictedPrices,
            borderColor: "#36A2EB",
            fill: false,
          },
        ],
      });

      // Calculate Feature Importance
      const featureImportanceData = calculateFeatureImportance(dataset);

      setFeatureImportance({
        labels: ["Area", "Bedrooms", "Bathrooms", "Location", "Age"],
        datasets: [
          {
            label: "Feature Importance",
            data: featureImportanceData,
            backgroundColor: [
              "#FF6384",
              "#36A2EB",
              "#FFCE56",
              "#4BC0C0",
              "#9966FF",
            ],
          },
        ],
      });
    } // eslint-disable-next-line
  }, [dataset]);

  // Function to calculate feature importance
  const calculateFeatureImportance = (dataset) => {
    // Calculate the correlation between each feature and the predicted price
    const features = ["area", "bedrooms", "bathrooms", "location", "age"];
    const importanceScores = features.map((feature) => {
      const featureValues = dataset.map((item) => item[feature]);
      const predictedPrices = dataset.map((item) => item.predictedPrice);

      // Calculate the Pearson correlation coefficient
      const correlation = calculateCorrelation(featureValues, predictedPrices);
      return Math.abs(correlation); // Use absolute value to represent importance
    });

    return importanceScores;
  };

  // Function to calculate Pearson correlation coefficient
  const calculateCorrelation = (x, y) => {
    const n = x.length;
    const sumX = x.reduce((acc, val) => acc + val, 0);
    const sumY = y.reduce((acc, val) => acc + val, 0);
    const sumXY = x.reduce((acc, val, index) => acc + val * y[index], 0);
    const sumX2 = x.reduce((acc, val) => acc + val * val, 0);
    const sumY2 = y.reduce((acc, val) => acc + val * val, 0);

    const numerator = sumXY - (sumX * sumY) / n;
    const denominator = Math.sqrt(
      (sumX2 - (sumX * sumX) / n) * (sumY2 - (sumY * sumY) / n)
    );

    return denominator === 0 ? 0 : numerator / denominator;
  };

  return (
    <div className="mt-6 p-4 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-bold mb-3">Actual vs. Predicted Prices</h2>
      <Line data={chartData} />

      <h2 className="text-xl font-bold mt-6 mb-3">Feature Importance</h2>
      <Bar
        data={featureImportance}
        options={{
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: "Importance Score",
              },
            },
            x: {
              title: {
                display: true,
                text: "Features",
              },
            },
          },
        }}
      />
    </div>
  );
};

export default PriceChart;
