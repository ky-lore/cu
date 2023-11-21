const { globalStrat } = require('../schemas')
const { datetime, adminIds } = require('../utils')
const createSubtasks = require('../controllers/createSubtasks')

/**
 * 
 * @param {object} task The original request object sent from CU passed in from our route
 * @param {array} assigneeIds Array of assignee ID's from the task body above parsed by taskHandler
 * @returns {array} taskArray is then sent to createSubtasks.js
 */
function handleGlobalStrat(task, assigneeIds) {
  let listId = task.list.id
  let taskArray = globalStrat.map(obj => {
    return {
      ...obj,
      assignees: obj.leads ? adminIds : assigneeIds,
      due_date: obj.due_date + datetime(),
      start_date: datetime(),
      parent: task.id
    }
  })
  createSubtasks(taskArray, listId)
}

module.exports = handleGlobalStrat