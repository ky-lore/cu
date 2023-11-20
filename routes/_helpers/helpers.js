const axios = require("axios");
const header = require("../_resources/header");

// @desc    Get task details by ID from the ClickUp API
// @param   taskId - The ID of the task to retrieve
// @return  Task details as an object
async function getTaskById(taskId) {
  const url = `https://api.clickup.com/api/v2/task/${taskId}?custom_task_ids=true`;

  try {
    const response = await axios.get(url, header);
    return response.data;
  } catch (err) {
    // TODO: Handle errors appropriately
    console.error("Error fetching task details:", err.message);
  }
}

// @desc    Create a subtask in a specified list with the given parent task ID
// @param   listId - The ID of the list in which the subtask will be created
// @param   parentTaskId - The ID of the parent task for the subtask
async function createSubTask(listId, parentTaskId) {
  const url = `https://api.clickup.com/api/v2/list/${listId}/task?custom_task_ids=true`;

  // Define the body of the request containing subtask details
  const body = {
    name: "Subtask",
    description: "New Task Description",
    assignees: [84086508], // Example assignee ID (Steven's ID), replace with actual IDs
    parent: parentTaskId.toString(),
    notify_all: false,
  };

  try {
    await axios.post(url, body, header);
  } catch (err) {
    // TODO: Handle errors appropriately
    console.error("Error creating subtask:", err.message);
  }
}

module.exports = {
  getTaskById,
  createSubTask,
};
