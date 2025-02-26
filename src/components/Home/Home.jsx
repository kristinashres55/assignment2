import React from "react";
import image from "../../assets/bg-image.jpg";
import "./Home.css";

export const Home = () => {
  return (
    <div className="home-container">
      <div className="image-container">
        <img src={image} alt="home" />

        <div className="home-text">
          <h1>Property Price Predictor</h1>
          <p>
            Enter the details of the property you want to predict the price for
            and we will show you the predicted price.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
