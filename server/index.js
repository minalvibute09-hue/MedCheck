const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config({ path: ".env.local" });

const app = express();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

// Check whether the backend is running
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Connect to MongoDB
async function startServer() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing from .env.local");
    }

    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected successfully!");

    app.listen(process.env.PORT || 5000, () => {
      console.log("MedCheck backend running on port 5000");
    });
  } catch (error) {
    console.error("Connection failed:", error.message);
  }
}

startServer();
