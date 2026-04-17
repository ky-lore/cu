const express = require("express");
const axios = require("axios");
const router = express.Router();

const CLICKUP_TOKEN = process.env.CLICKUP_API_KEY; // your ClickUp API token
const SPACE_ID = "90145169375";

// Axios instance for ClickUp
const clickup = axios.create({
  baseURL: "https://api.clickup.com/api/v2",
  headers: {
    Authorization: CLICKUP_TOKEN,
  },
});

// ----------------------------
// POST /personallist
// ----------------------------
router.post("/", async (req, res) => {
  res.status(200).json({ received: true });

  const { event, task_id } = req.body;
  if (event !== "taskCreated" || !task_id) return;

  try {
    const taskResp = await clickup.get(`/task/${task_id}`);
    const task = taskResp.data;

    // Skip copies we already made
    const tags = task?.tags?.map(t => t.name) || [];
    if (tags.includes("auto-copied")) {
      console.log("⏭️ Already a copy, skipping.");
      return;
    }

    // ✅ Back to creator email
    const email = task?.creator?.email;
    if (!email) {
      console.log("⏭️ No creator email, skipping.");
      return;
    }

    console.log("Creator email:", email);

    const listsResp = await clickup.get(`/space/${SPACE_ID}/list`);
    const targetList = listsResp.data.lists.find(
      (l) => l.name.toLowerCase() === email.toLowerCase()
    );

    if (!targetList) {
      console.log(`⏭️ No list found named: ${email}`);
      return;
    }

    await clickup.post(`/list/${targetList.id}/task`, {
      name: task.name,
      description: task.description || "",
      assignees: task.assignees?.map((a) => a.id) || [],
      tags: ["auto-copied"],
    });

    console.log("✅ Task copied to list:", targetList.name);
  } catch (err) {
    console.error(err.response?.data || err.message);
  }
});
module.exports = router;
