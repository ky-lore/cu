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

async function assignLsa(listId) {
  const url = `https://api.clickup.com/api/v2/list/${process.env.LIST_ID}/task?tags=lsa&tags=lsa`;

  try {
    const response = await axios.get(url, header);
    console.log(response.data.tasks)
    return response.data.tasks;
  } catch (err) {
    // TODO: Handle errors appropriately
    console.error("Error fetching task details:", err.message);
  }
}

/**
 * 
 * @param {object} task from the reschedule route
 * @returns parses field for times rescheduled and passes it back to update and increment the field by 1
 */
async function updateTask(task) {
  // console.log(task)
  const field = task.custom_fields.find(field => field.name === 'Times Rescheduled') || {};
  const parsedVal = field.value ? parseInt(field.value) : 0
  console.log(parsedVal)
  const url = `https://api.clickup.com/api/v2/task/${task.id}/field/${field.id}`;
  const body = JSON.stringify({
    value: parsedVal + 1
  })
  try {
    const response = await axios.post(url, body, header);
    return response.data;
  } catch (err) {
    // TODO: Handle errors appropriately
    console.error("Error fetching task details:", err.message);
    console.error(err)
  }
}

// @desc    Create a subtask in a specified list with the given parent task ID
// @param   listId - The ID of the list in which the subtask will be created - deprecated?
// @param   parentTaskId - The ID of the parent task for the subtask - deprecated?
// @param   taskBody - The task object
async function createSubTask(body) {
  const url = `https://api.clickup.com/api/v2/list/${listId}/task?custom_task_ids=true`;

  // Define the body of the request containing subtask details

  // Will be defined and passed in params
  /* const body = {
    name: "Subtask",
    description: "New Task Description",
    assignees: [84086508], // Example assignee ID (Steven's ID), replace with actual IDs
    parent: parentTaskId.toString(),
    notify_all: false,
  };
  */

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
  updateTask,
  assignLsa
};
