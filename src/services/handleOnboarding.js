const { globalOnboarding } = require('../schemas')
const { datetime, adminIds, parseLeads, parseTags } = require('../utils')
const axios = require('axios')

const { createSubtasks } = require('../controllers')

const leads = { croLead: 82393838, srchLead: 44588182, soclLead: 82242423 }

// const testTags = ['social', 'leadgen', 'ecom', 'dev', 'google']

/**
 * 
 * @param {object} task The original request object sent from CU passed in from our route
 * @param {array} assigneeIds Array of assignee ID's from the task body above parsed by taskHandler
 * @returns {array} taskArray is then sent to createSubtasks.js
 */

async function handleOnboarding(task, assigneeIds) {

  console.log('onboarding!!!')

  // try {
  //   const res = await axios.post('https://backend.leadconnectorhq.com/hooks/abicfvSRunSz4oHmp5lQ/webhook-trigger/d136ef38-72ca-412d-87ca-4a5161e8f186', { taskData: task });
  //   console.log(res.data);
  // } catch (err) {
  //   console.error('Axios error:', err)
  // }

  // console.log(testLeads, testTags)

  const parsedTags = ['social', 'leadgen', 'ecom', 'dev', 'google']
  // const leads = parseLeads(task.custom)

  const finalArr = globalOnboarding.map(taskObj => {
    return {
      ...taskObj,
      due_date: taskObj.due_date + datetime(),
      start_date: datetime(),
      parent: task.id
    }
  }).filter(taskObj => {
    return taskObj.flags.every(element => parsedTags.includes(element))
  }).map(taskObj => {
    switch (taskObj.flags.join('-')) {
      case 'social-ecom':
        return {
          ...taskObj,
          assignees: [leads.soclLead]
        }
        break
      case 'social-leadgen':
        return {
          ...taskObj,
          assignees: [leads.soclLead]
        }
        break
      case 'google-ecom':
        return {
          ...taskObj,
          assignees: [leads.srchLead]
        }
        break
      case 'google-leadgen':
        return {
          ...taskObj,
          assignees: [leads.srchLead]
        }
        break
      case 'dev':
        return {
          ...taskObj,
          assignees: [leads.croLead]
        }
        break
      default:
        return taskObj
    }
  })

  console.log(finalArr)
  await createSubtasks(finalArr, task.list.id)
}

module.exports = handleOnboarding
