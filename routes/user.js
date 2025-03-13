const express = require("express");
const router = express.Router();
const User = require("../models/User");

const { isStudent, isAdmin, auth } = require("../middleware/m_auth");
const { login, signup } = require("../controllers/auth");

router.post("/login", login);
router.post("/signup", signup);

//testing Protected routes for single middleware
router.get("/test", auth, (req, res) => {
  res.json({
    success: true,
    message: "Welcome to the Protected Route for testing purpose",
  });
});

//protected routes
router.get("/student", auth, isStudent, (req, res) => {
  res.json({
    success: true,
    message: "Welcome to the Protected Route for students",
  });
});

router.get("/admin", auth, isAdmin, (req, res) => {
  res.json({
    success: true,
    message: "Welcome to the Protected Route for admin",
  });
});

module.exports = router;
