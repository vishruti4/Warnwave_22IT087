const express = require("express");
const { MongoClient } = require("mongodb");
const dotenv = require("dotenv");
dotenv.config();

const router = express.Router();

const client = new MongoClient(process.env.MONGO_URI);
let db;

(async () => {
  try {
    await client.connect();
    db = client.db("warnwave");
    console.log("✅ MongoDB connected for History Routes");
  } catch (err) {
    console.error("❌ MongoDB connection error in historyRoutes:", err);
  }
})();

router.get("/:email", async (req, res) => {
  const { email } = req.params;

  try {
    const user = await db.collection("users").findOne({ email });

    if (!user || !user.predictions) return res.json([]);

    // Sort by latest timestamp
    const sortedPredictions = user.predictions.sort(
      (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
    );

    res.json(sortedPredictions);
  } catch (error) {
    console.error("❌ Error fetching user history:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;