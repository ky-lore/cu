const { globalStrat } = require('../schemas')
const { datetime, adminIds, parseLeads } = require('../utils')
const { createSubtasks } = require('../controllers')


const leads = { croLead: 82457300, srchLead: 44588182, soclLead: 82242423 }

/**
 * 
 * @param {object} task The original request object sent from CU passed in from our route
 * @param {array} assigneeIds Array of assignee ID's from the task body above parsed by taskHandler
 * @returns {array} taskArray is then sent to createSubtasks.js
 */
async function handleStrat(task, assigneeIds) {
  const listId = task.list.id
  let assigneesArr = []

  console.log(leads)

  let taskArray = globalStrat.map(obj => {
    switch(obj.flag) {
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
  await createSubtasks(taskArray, listId)
}

module.exports = handleStrat
