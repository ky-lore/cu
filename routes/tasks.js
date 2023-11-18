const express = require("express");
const router = express.Router();
const { getTaskById, createSubTask } = require("./_helpers/helpers");

// @route   POST /task-moved/:taskId
// @desc    Handle the movement of a task and create a subtask
// @access  Public
router.post("/task-moved/:taskId", async (req, res) => {
  const { taskId } = req.params;

  try {
    // Retrieve the details of the task that was moved using the taskId
    const task = await getTaskById(taskId);

    // Extract the ids of members assigned to the task
    const assigneeIds = task.assignees.map((assignee) => assignee.id);
    console.log(assigneeIds);

    // TODO
    // const listId = task.list.id;
    // await createSubTask(listId, taskId);

    res.send("Success");
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
