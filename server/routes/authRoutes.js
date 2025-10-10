const express = require("express");
const router = express.Router();
const {
  register,
  verifyOtp,
  login,
  getMe,
  updateProfile,
  updateProfileImage,
} = require("../controllers/authController");
const auth = require("../middleware/authMiddleware");

router.post("/register", register);
router.post("/verify-otp", verifyOtp);
router.post("/login", login);
router.put("/profile", auth, updateProfile);
router.post("/profile", auth, updateProfile);
router.post("/update-profile", auth, updateProfile);
router.post("/profile-image", auth, updateProfileImage);
router.get("/me", auth, getMe);

module.exports = router;