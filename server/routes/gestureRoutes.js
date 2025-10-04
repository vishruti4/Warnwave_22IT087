const express = require("express");
const { spawn } = require("child_process");
const path = require("path");

const router = express.Router();

router.post("/", (req, res) => {
  const { image, email } = req.body;
  if (!image || !email) return res.status(400).json({ error: "No image or email provided" });

  const pythonScript = path.join(__dirname, "..", "predict.py");
  const py = spawn("python", [pythonScript]);

  let output = "";

  py.stdout.on("data", (data) => { output += data.toString(); });

  py.on("close", (code) => {
    try {
      const result = JSON.parse(output);

      if (result.error) {
        return res.status(500).json({ error: result.error });
      }

      res.json(result); // ✅ Send gesture + confidence to React
    } catch (err) {
      res.status(500).json({ error: "Invalid JSON from Python", details: err.message });
    }
  });

  // Send input to Python
  py.stdin.write(JSON.stringify({ image, email }));
  py.stdin.end();
});

module.exports = router;
