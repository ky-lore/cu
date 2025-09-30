const express = require("express");
const router = express.Router();

// @route   POST /task-moved/:taskId
// @desc    Handle the movement of a task and create a subtask
// @access  Public
router.post("/", (req, res) => {
  console.log(req.data)
  res.status(200).json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});
module.exports = router;