const express = require("express");
const router = express.Router();

// @route   GET /health
// @desc    Basic health check route
// @access  Public
router.get("/", (req, res) => {
  res.status(200).json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
