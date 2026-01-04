//connecting to server.js
const express = require("express");
const router = express.Router();
const { Task } = require("../src/db/mongodbCadence");
const { handle_tasks } = require("../src/controllers/cadenceTasks");
const { handle_slack } = require("../src/controllers/cadenceSlack");


router.get("/", async (req, res) => {
  
  
  const tasks = await Task.find();
   
  const notifications = handle_tasks(tasks);
  //res.json(tasks)
  await handle_slack(res, notifications)
  
  console.log("✅ Message works!");
  console.log("Tasks found:", tasks.length);
  console.log("Notifications:", notifications.length);
  res.json({ success: true, count: notifications.length });
});

module.exports = router;