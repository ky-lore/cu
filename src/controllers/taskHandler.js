require('dotenv').config();

const { globalOnboarding } = require('../schemas')
const adminIds = process.env.ADMIN_IDS.split('_').map(id => {
  return parseInt(id)
})

// TODO
// write parseLeads to assign tasks to each POC based on task
function parseLeads(task) {

}

function handleOnboarding(task, assigneeIds) {
  let taskArray = globalOnboarding.map(obj => {
    return {
      ...obj,
      assignees: obj.leads ? adminIds : assigneeIds
    }
  })
  console.log(taskArray)
}

/**
 * Handles the incoming request body, handles based off of incoming status (later: tags) and returns the final array of tasks to send back to the ClickUp API
 * @param {object} task The request body from /tasks/task-moved/id
 * @returns {array} final array of tasks after handling
 */
function taskHandler (task, assigneeIds) {
  const { status } = task.status

  switch (status) {
    case 'onboarding':
      handleOnboarding(task, assigneeIds)
  }
}

module.exports = taskHandler