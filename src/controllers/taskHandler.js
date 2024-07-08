require('dotenv').config();

const { handleOnboarding, handleStrat, handleDev, handleLive, handlePreparation } = require('../services')
const axios = require('axios')


/**
 * Handles the incoming request body, handles based off of incoming status (later: tags) and returns the final array of tasks to send back to the ClickUp API
 * @param {object} task The request body from /tasks/task-moved/id
 * @returns {array} final array of tasks after handling
 */
async function taskHandler(task) {
  const { status } = task.status

  // Extract the ids of members assigned to the task - we may not need this just yet but will leave it in for future smart cross-checks
  const assigneeIds = task.assignees.map((assignee) => assignee.id);
  console.log(assigneeIds)
  await assigneePersonToTask(task.id,assigneeIds);
  switch (status) {
    case 'preparation':
      handlePreparation(task)
      break
    case 'onboarding':
      handleOnboarding(task, assigneeIds)
      break
    case 'strategizing':
      handleStrat(task, assigneeIds)
      break
    case 'development':
      handleDev(task, assigneeIds)
      break
    case 'live':
      handleLive(task, assigneeIds)
      break
  }
}

module.exports = taskHandler