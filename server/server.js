// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const tf = require("@tensorflow/tfjs"); // for model loading
const multer = require("multer");

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Multer setup to handle image uploads (from webcam snapshots)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

let model;

// Load model when server starts
(async () => {
  try {
    model = await tf.loadLayersModel("file://./model/model.json"); 
    console.log("✅ Gesture model loaded");
  } catch (err) {
    console.error("❌ Error loading model:", err);
  }
})();

// API routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/gesture", require("./routes/gestureRoutes"));

// Predict endpoint (accepts base64 image from frontend)
app.post("/api/predict", upload.single("frame"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No image uploaded" });

    // Decode image
    const imageBuffer = req.file.buffer;
    const imageTensor = tf.node.decodeImage(imageBuffer, 3)
      .resizeNearestNeighbor([224, 224]) // resize to model input
      .expandDims(0)
      .toFloat()
      .div(tf.scalar(255.0)); // normalize

    // Run prediction
    const prediction = model.predict(imageTensor);
    const probs = prediction.arraySync()[0];

    // Get max class
    const maxIndex = probs.indexOf(Math.max(...probs));
    res.json({ classIndex: maxIndex, confidence: probs[maxIndex] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Prediction failed" });
  }
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => app.listen(5000, () => console.log("🚀 Server running on port 5000")))
  .catch((err) => console.log(err));
