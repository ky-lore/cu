const express = require("express");
const router = express.Router();
const { getTaskById, createSubTask } = require("./_helpers/helpers");
const taskHandler = require("../src/controllers/taskHandler");
const ghlOpportunityHandler = require("../src/controllers/ghlOpportunityHandler");

// @route   POST /task-moved/:taskId
// @desc    Handle the movement of a task and create a subtask
// @access  Public
router.post("/task-moved/:taskId", async (req, res) => {
	const { taskId } = req.params;

	try {
		// Retrieve the details of the task that was moved using the taskId
		const task = await getTaskById(taskId);

		// taskHandler handles the task
		await ghlOpportunityHandler(task);
		await taskHandler(task);

		res.send("Success");
	} catch (error) {
		console.error(error);
		res.status(500).send("Internal Server Error");
	}
});

module.exports = router;
