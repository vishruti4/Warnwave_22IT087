const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/gesture", require("./routes/gestureRoutes"));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => app.listen(5000, () => console.log("🚀 Server running on port 5000")))
  .catch((err) => console.error("❌ MongoDB connection error:", err));
