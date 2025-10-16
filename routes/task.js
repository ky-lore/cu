const express = require("express");
const axios = require("axios");
const header = require("../routes/_resources/header"); // your working auth header
const router = express.Router();
require("dotenv").config();


// helper to fetch folders
async function listFolders(spaceId) {
  const url = `https://api.clickup.com/api/v2/space/${spaceId}/folder`;
  const res = await axios.get(url, header);
  return res.data.folders;
}

async function createTask(listId, task) {
  const url = process.env.ZAPIER_TASKPARSE_ENDPOINT;

  try {
    const response = await axios.post(url, task);
    console.log("✅ Task created:", response.data);
  } catch (error) {
    console.error("❌ Error creating task:", error.response?.data || error.message);
  }
}

// @route   POST /task-moved/:taskId
// @desc    Handle the movement of a task and create a subtask
// @access  Public
router.post("/", async (req, res) => {
  try {
    const task = req.body
    const folders = await listFolders("90142631628");
    
    const matched = folders.filter((f) =>
      f.name.includes(task.channelId)
    );

    console.log("Matching folders:", matched);

    const folderId = matched[0].id
    const folderName = matched[0].name
    const list = matched[0].lists.filter(list => list.name.includes('TODO'))
    console.log(list)
  

    // TODO: PASS USER ID FROM CLICKUP ZAP STEP
    const taskObj = {
      name: task.desc,
      assignees: task.email,
      folder: folderId,
      list: list[0].id,
      date: task.date,
      channel: task.channelId,
      channelName: task.channelName,
      folderName: folderName
    };

    console.log(req.body)
    console.log(list[0].id, typeof list[0].id)

    createTask(Number(list[0].id), taskObj)

    res.status(200).json({
      status: "ok",
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Error fetching folders:", err.message);
    res.status(500).json({ status: "error", message: err.message });
  }
});

module.exports = router;
