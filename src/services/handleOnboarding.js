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

  var testArr = globalOnboarding.map(task => {
    return {
      ...task,
      due_date: task.due_date + datetime(),
      start_date: datetime(),
      parent: 123
    }
  }).filter(task => {
    return task.flags.every(element => parsedTags.includes(element))
  }).map(task => {
    switch(task.flags.join('-')) {
      case 'social-ecom':
        return {
          ...task,
          assignees: leads.soclLead
        }
        break
      case 'social-leadgen':
        return {
          ...task,
          assignees: leads.soclLead
        }
        break
      case 'google-ecom':
        return {
          ...task,
          assignees: leads.srchLead
        }
        break
      case 'google-leadgen':
        return {
          ...task,
          assignees: leads.srchLead
        }
        break
      case 'dev':
        return {
          ...task,
          assignees: leads.croLead
        }
        break
      default:
        return task
    }
  })

  console.log(testArr)
}

module.exports = handleOnboarding