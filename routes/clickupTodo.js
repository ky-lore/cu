const express = require("express");
const router = express.Router();
const { getTodoData } = require("../src/controllers/Todo");

router.get("/", async (req, res) => {
  try {
    const data = await getTodoData();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch TODO data" });
  }
});

module.exports = router;