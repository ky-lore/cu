require('dotenv').config();
const axios = require("axios");

const header = {
  headers: {
    "Content-Type": "application/json",
    Authorization: process.env.PERSONAL_API_KEY,
  },
};

const { globalOnboarding } = require('../schemas')
const currentTime = new Date().getTime();
const adminIds = process.env.ADMIN_IDS.split('_').map(id => {
  return parseInt(id)
})

// TODO
// write parseLeads to assign tasks to each POC based on task
function parseLeads(task) {

}

/**
 * 
 * @param {object} task The original request object sent from CU passed in from our route
 * @param {array} assigneeIds Array of assignee ID's from the task body above parsed by taskHandler
 */
async function handleOnboarding(task, assigneeIds) {
  let taskArray = globalOnboarding.map(obj => {
    return {
      ...obj,
      assignees: obj.leads ? adminIds : assigneeIds,
      due_date: obj.due_date + currentTime,
      start_date: currentTime,
      parent: task.id
    }
  })
  console.log(taskArray)

  // hit the CU API with each task object
  taskArray.forEach(taskObj => {
      const url = `https://api.clickup.com/api/v2/list/${task.list.id}/task?custom_task_ids=true`;

      try {
        axios.post(url, taskObj, header);
      } catch (err) {
        // TODO: Handle errors appropriately
        console.error("Error creating subtask:", err.message);
      }
  })
}

/**
 * Handles the incoming request body, handles based off of incoming status (later: tags) and returns the final array of tasks to send back to the ClickUp API
 * @param {object} task The request body from /tasks/task-moved/id
 * @returns {array} final array of tasks after handling
 */
function taskHandler (task) {
  console.log(task)
  const { status } = task.status

  // Extract the ids of members assigned to the task - we may not need this just yet but will leave it in for future smart cross-checks
  const assigneeIds = task.assignees.map((assignee) => assignee.id);
  console.log(assigneeIds)

  switch (status) {
    case 'onboarding':
      handleOnboarding(task, assigneeIds)
  }
}

module.exports = taskHandler