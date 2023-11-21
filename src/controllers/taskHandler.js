require('dotenv').config();

const { globalOnboarding } = require('../schemas')
const { handleGlobalOnboarding } = require('../services')

// TODO
// write parseLeads to assign tasks to each POC based on task
// function parseLeads(task) { }

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
      handleGlobalOnboarding(task, assigneeIds)
    // TODO: handleSocOnboarding
    // TODO: handleSrcOnboarding
    // TODO: handleCroOnboarding
  }
}

module.exports = taskHandler