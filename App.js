const express = require("express");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 3000;

const {
  getTaskById,
  createSubTask,
  getAssigneeIds,
} = require("./utils/helpers");

app.post("/task-moved/:taskId", async (req, res) => {
  const { taskId } = req.params;

  const header = {
    headers: {
      "Content-Type": "application/json",
      Authorization: process.env.PERSONAL_API_KEY,
    },
  };

  try {
    const task = await getTaskById(header, taskId);
    const assignees = task.assignees;
    const assigneeIds = getAssigneeIds(assignees);
    console.log(assigneeIds);
    // await createSubTask(header, task, taskId);
    res.send("Success");
  } catch (error) {
    console.error("Error sending PUT request:", error.message);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
