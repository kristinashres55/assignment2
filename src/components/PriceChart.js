import React, { useEffect, useState } from "react";
import { Line, Bar } from "react-chartjs-2";
import "chart.js/auto";

const PriceChart = ({ dataset }) => {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    if (dataset.length > 0) {
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

      // Feature Importance Calculation (Example: Sum of absolute values of features)
      const featureSums = dataset.reduce(
        (acc, item) => {
          acc.area += Math.abs(item.area);
          acc.bedrooms += Math.abs(item.bedrooms);
          acc.bathrooms += Math.abs(item.bathrooms);
          acc.location += Math.abs(item.location);
          acc.age += Math.abs(item.age);
          return acc;
        },
        { area: 0, bedrooms: 0, bathrooms: 0, location: 0, age: 0 }
      );
    }
  }, [dataset]);

  return (
    <div className="mt-6 p-4 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-bold mb-3">Predicted vs. Actual Prices</h2>
      <Line data={chartData} />
    </div>
  );
};

export default PriceChart;
