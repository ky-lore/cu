const { globalLive } = require('../schemas')
const { datetime, adminIds, parseLeads, parseTags } = require('../utils')
const { createSubtasks } = require('../controllers')

/**
 * 
 * @param {object} task The original request object sent from CU passed in from our route
 * @param {array} assigneeIds Array of assignee ID's from the task body above parsed by taskHandler
 * @returns {array} taskArray is then sent to createSubtasks.js
 */
function handleLive(task, assigneeIds) {
  const leads = parseLeads(task)
  const parsedTags = parseTags(task.tags)
  const listId = task.list.id
  let assigneesArr = []

  let taskArray = globalLive.map(obj => {
    switch (obj.flag) {
      case 'gbl':
        assigneesArr = adminIds
        break
      case 'socl':
        assigneesArr = [leads.soclLead]
        break
      case 'srch':
        assigneesArr = [leads.srchLead]
        break
      case 'cro':
        assigneesArr = [leads.croLead]
        break
      case 'ctv':
        assigneesArr = [leads.ctvLead]
    }

    return {
      ...obj,
      name: task.name + ': ' + obj.name,
      assignees: assigneesArr,
      due_date: obj.due_date + datetime(),
      start_date: datetime(),
      parent: task.id
    }
  })

  const finalArray = taskArray.filter(taskObj => {
    if (taskObj.tags) {
      return parsedTags.includes(taskObj.tags.join('')) ? taskObj : null
    } else {
      return taskObj
    }
  })

  createSubtasks(finalArray, listId)
}

module.exports = handleLive