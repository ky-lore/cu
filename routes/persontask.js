const express = require("express");
const router = express.Router();
const axios = require("axios");
require("dotenv").config();

const TOKEN = process.env.CLICKUP_API_KEY;
const WATCH_TAG = "personal"; // <-- put it here at the top
async function getTask(taskId) {
  const response = await axios.get(`https://api.clickup.com/api/v2/task/${taskId}`, {
    headers: { Authorization: TOKEN },
  });
  return response.data;
}

router.post("/", async (req, res) => {
  const { event, task_id } = req.body;

  if (event === "webhook") return res.sendStatus(200);
  if (event !== "taskCreated") return res.sendStatus(200);
  if (!task_id) return res.sendStatus(400);

  try {
    const task = await getTask(task_id);

    const taskTags = task.tags?.map((t) => t.name.toLowerCase()) || [];
    if (!taskTags.includes(WATCH_TAG.toLowerCase())) {
      return res.sendStatus(200);
    }

    console.log(task);
    return res.sendStatus(200);
  } catch (err) {
    console.error("[webhook] Error:", err.message);
    return res.status(500).json({ error: "Failed to process task." });
  }
});

module.exports = router;