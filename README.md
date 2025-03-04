# Property Price Prediction App

## 📌 Project Overview

The **Property Price Prediction App** leverages a neural network model (powered by `brain.js`) to predict property prices based on key features such as area, number of bedrooms and bathrooms, location, and age. It includes interactive data visualizations for comparing predicted and actual prices and analyzing feature importance.

## ✨ Key Features

### 🏡 Price Prediction

- Predict property prices using a trained neural network model.
- Input property details and receive an estimated price instantly.

### 📊 Data Visualization

- **Line Chart**: Compare predicted vs. actual prices.
- **Bar Chart**: Analyze feature importance.

### 🛠️ Model Management

- **Save & Load**: Store the trained model in LocalStorage.
- **Retrain Model**: Easily retrain the model if needed.

## 🚀 How to Run Locally

### Prerequisites

- **Node.js** (v16 or higher)
- **npm** (v8 or higher)

### Installation & Setup

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/kristinashres55/CSDD1008_Assignment2
   cd CSDD1008_Assignment2
   ```
2. **Install Dependencies**:
   ```bash
   npm install
   ```
3. **Run the App**:

   ```bash
   npm start
   ```

   The app will start on **http://localhost:3000**.

4. **Train the Model**:

   - The model is trained automatically on the first run.
   - You can retrain the model anytime by clicking the **"Retrain Model"** button.

5. **Make Predictions**:
   - Enter property details (area, bedrooms, bathrooms, location, age).
   - Click **"Predict Price"** to get an estimated price.

## 🛠️ Technologies Used

### 🔹 Frontend

- **React.js** (component-based UI development)
- **Chart.js** (data visualization)
- **Bootstrap CSS** (modern and responsive styling)

### 🔹 Machine Learning

- **brain.js** (lightweight neural network library)

### 🔹 Build Tool

- **Netlify** (optimized development and production builds)

### Conclusion

1. **Price Prediction Form** – Users input property details.
2. **Predicted vs. Actual Prices Chart** – Line chart comparing predictions with actual values.
3. **Feature Importance Chart** – Bar chart highlighting key predictive factors.

---
