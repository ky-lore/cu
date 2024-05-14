const { globalOnboarding } = require('../schemas')
const { datetime, adminIds, parseLeads, parseTags } = require('../utils')

const { createSubtasks } = require('../controllers')

// const testLeads = { croLead: 5997125, srchLead: 82219496, soclLead: 82242423 }

// const testTags = ['social', 'leadgen', 'ecom', 'dev', 'google']

/**
 * 
 * @param {object} task The original request object sent from CU passed in from our route
 * @param {array} assigneeIds Array of assignee ID's from the task body above parsed by taskHandler
 * @returns {array} taskArray is then sent to createSubtasks.js
 */

async function handleOnboarding(task, assigneeIds) {

  const leads = parseLeads(task)
  const parsedTags = parseTags(task.tags)

  // console.log(testLeads, testTags)

  var testArr = globalOnboarding.map(taskObj => {
    return {
      ...taskObj,
      due_date: taskObj.due_date + datetime(),
      start_date: datetime(),
      parent: 123
    }
  }).filter(taskObj => {
    return taskObj.flags.every(element => parsedTags.includes(element))
  }).map(taskObj => {
    switch(taskObj.flags.join('-')) {
      case 'social-ecom':
        return {
          ...taskObj,
          assignees: leads.soclLead
        }
        break
      case 'social-leadgen':
        return {
          ...taskObj,
          assignees: leads.soclLead
        }
        break
      case 'google-ecom':
        return {
          ...taskObj,
          assignees: leads.srchLead
        }
        break
      case 'google-leadgen':
        return {
          ...taskObj,
          assignees: leads.srchLead
        }
        break
      case 'dev':
        return {
          ...taskObj,
          assignees: leads.croLead
        }
        break
      default:
        return taskObj
    }
  })

  console.log(testArr)
  console.log(task, assigneeIds)
}

module.exports = handleOnboarding