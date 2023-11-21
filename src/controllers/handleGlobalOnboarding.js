const { globalOnboarding } = require('../schemas')
const currentTime = new Date().getTime();
const createSubtasks = require('./createSubtasks')
const adminIds = process.env.ADMIN_IDS.split('_').map(id => {
  return parseInt(id)
})

/**
 * 
 * @param {object} task The original request object sent from CU passed in from our route
 * @param {array} assigneeIds Array of assignee ID's from the task body above parsed by taskHandler
 * @returns {array} taskArray is then sent to createSubtasks.js
 */
function handleGlobalOnboarding(task, assigneeIds) {
  let listId = task.list.id
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
  createSubtasks(taskArray, listId)
}

module.exports = handleGlobalOnboarding