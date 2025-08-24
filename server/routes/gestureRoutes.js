const express = require("express");
const router = express.Router();
const tf = require("@tensorflow/tfjs-node");

let model;

// Load your gesture classification model
(async () => {
  try {
    model = await tf.loadLayersModel("file://C:/Warnwave_7SGP/server/model/model.json");
    console.log("✅ Gesture Model loaded!");
  } catch (err) {
    console.error("❌ Error loading model:", err);
  }
})();

// Labels should match your training dataset
const labels = ["Protest", "Peace", "Danger", "Stop", "Attention", "Evacuate", "Radio", "Silence"];

router.post("/", async (req, res) => {
  try {
    if (!model) return res.status(500).json({ error: "Model not loaded yet" });

    const { landmarks, image } = req.body;

    if (!landmarks && !image) {
      return res.status(400).json({ error: "No input provided (landmarks or image)" });
    }

    // For now: use landmarks (frontend should compute them with Mediapipe)
    if (landmarks) {
      const inputTensor = tf.tensor(landmarks).flatten().reshape([1, -1]);
      const prediction = model.predict(inputTensor);
      const scores = await prediction.data();
      const classIdx = scores.indexOf(Math.max(...scores));

      res.json({
        gesture: labels[classIdx] || "Unknown",
        confidence: Math.max(...scores).toFixed(2),
      });

      tf.dispose([inputTensor, prediction]);
    } else {
      // 🚧 Placeholder for base64 image support
      return res.status(501).json({
        error: "Image input not yet supported. Please send landmarks instead.",
      });
    }
  } catch (err) {
    console.error("Prediction error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
