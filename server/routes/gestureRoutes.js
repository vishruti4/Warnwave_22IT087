const express = require("express");
const router = express.Router();
const ort = require("onnxruntime-node");
const path = require("path");
const sharp = require("sharp"); // npm i sharp

let session;

// Load ONNX model on server startup
(async () => {
  try {
    const modelPath = path.join(__dirname, "..", "model", "model.onnx");
    session = await ort.InferenceSession.create(modelPath);
    console.log("✅ ONNX Gesture Model loaded!");
    console.log("Model input names:", session.inputNames);
    console.log("Model output names:", session.outputNames);
  } catch (err) {
    console.error("❌ Error loading ONNX model:", err);
  }
})();

const labels = ["Protest", "Peace", "Danger", "Stop", "Attention", "Evacuate", "Radio", "Silence"];

router.post("/", async (req, res) => {
  try {
    if (!session) return res.status(500).json({ error: "Model not loaded yet" });

    const { image } = req.body;
    if (!image) return res.status(400).json({ error: "No image provided" });

    // Decode base64 → Buffer
    const buffer = Buffer.from(image.replace(/^data:image\/\w+;base64,/, ""), "base64");

    // Resize to 224x224, RGB, raw data
    const resized = await sharp(buffer).resize(224, 224).raw().toBuffer();

    // Normalize and create Float32Array
    const floatArray = Float32Array.from(resized, (v) => v / 255.0);

    // ONNX tensor [1, 224, 224, 3] (NHWC)
    const tensor = new ort.Tensor("float32", floatArray, [1, 224, 224, 3]);

    // Run inference
    const results = await session.run({ input: tensor });
    const scores = results["dense_1"].data;
    const classIdx = scores.indexOf(Math.max(...scores));

    res.json({
      gesture: labels[classIdx] || "Unknown",
      confidence: Math.max(...scores).toFixed(2),
    });
  } catch (err) {
    console.error("Prediction error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;