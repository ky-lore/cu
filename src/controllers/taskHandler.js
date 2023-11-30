require('dotenv').config();

const { handleOnboarding, handleStrat, handleDev, handleLive } = require('../services')

/**
 * Handles the incoming request body, handles based off of incoming status (later: tags) and returns the final array of tasks to send back to the ClickUp API
 * @param {object} task The request body from /tasks/task-moved/id
 * @returns {array} final array of tasks after handling
 */
function taskHandler(task) {
  console.log(task)
  const { status } = task.status

  // Extract the ids of members assigned to the task - we may not need this just yet but will leave it in for future smart cross-checks
  const assigneeIds = task.assignees.map((assignee) => assignee.id);
  console.log(assigneeIds)

  switch (status) {
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