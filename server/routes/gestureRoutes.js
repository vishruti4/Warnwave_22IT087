const express = require("express");
const router = express.Router();
const tf = require("@tensorflow/tfjs");
const { createCanvas, loadImage } = require("canvas");

let model;

// Load model once when server starts
(async () => {
  try {
    model = await tf.loadLayersModel(""); 
    console.log("Model loaded successfully!");
  } catch (err) {
    console.error("Error loading model:", err);
  }
})();

// Helper: convert base64 → tensor
async function base64ToTensor(base64) {
  const base64Data = base64.replace(/^data:image\/\w+;base64,/, "");
  const buffer = Buffer.from(base64Data, "base64");
  const img = await loadImage(buffer);

  const canvas = createCanvas(224, 224); // assuming MobileNet input size
  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0, 224, 224);

  const imageData = ctx.getImageData(0, 0, 224, 224);
  let tensor = tf.browser.fromPixels(imageData).toFloat().div(tf.scalar(255)).expandDims();
  return tensor;
}

router.post("/", async (req, res) => {
  try {
    if (!model) return res.status(500).json({ error: "Model not loaded" });

    const { image } = req.body;
    const tensor = await base64ToTensor(image);

    const prediction = model.predict(tensor);
    const scores = prediction.dataSync();
    const classIdx = scores.indexOf(Math.max(...scores));

    // Replace with your class labels
    const labels = ["Thumbs Up", "Peace", "Fist", "Palm"];
    const gesture = labels[classIdx] || "Unknown";

    res.json({ gesture });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Prediction failed" });
  }
});

module.exports = router;
