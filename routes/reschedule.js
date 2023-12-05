const express = require("express");
const router = express.Router();
const { getTaskById, updateTask } = require("./_helpers/helpers");
const { createSubtasks } = require('../src/controllers')

// @route   POST /recur/:taskId
// @desc    Handle the movement of a task and create a subtask
// @access  Public
router.post("/:taskId", async (req, res) => {
  const { taskId } = req.params;

  try {
    // Retrieve the details of the task that was moved using the taskId
    const task = await getTaskById(taskId);
    await updateTask(task)

    res.send("Success");
  } catch (error) {
    console.error(error)
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;