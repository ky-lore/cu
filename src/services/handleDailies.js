require('dotenv').config()
const { usersDb, billingMapping } = require('../db')
const { datetime } = require('../utils')
const { createSubtasks } = require('../controllers')
const schedule = require('node-schedule');
const axios = require('axios')

// unixtime for hours used in object passed in createTasks(obj) if we need to quickly modify timelines
const hours = 3600000

// These RecurrenceRule() objects are essentially just more readable cron
// schedule.Range is replaceable by an array [1,2,3,4,5] etc.
let morningRule = new schedule.RecurrenceRule();
morningRule.dayOfWeek = new schedule.Range([1,2,3,4,5])
morningRule.hour = 8;
morningRule.minute = 0;

let nightRule = new schedule.RecurrenceRule();
nightRule.dayOfWeek = new schedule.Range([1,2,3,4,5])
nightRule.hour = 15;
nightRule.minute = 15;

/**
 * 
 * @param {object} time 
 */
function createTasks(time) {

  let taskArray = usersDb
    .map(user => ({
      name: `${user._name.split(' ')[0]} ${time.time} Check In ${time.emoji}`,
      assignees: [user.uid],
      parent: process.env.DAILYTASK_ID,
      custom_fields: [{
        id: process.env.CUSTOMFIELDID,
        value: process.env.DAILYTASK_SLACKID
      }],
      due_date: time.due_date,
      exempt: user.exempt
    }))
    .filter(user => !user.exempt)


  createSubtasks(taskArray, process.env.LIST_ID)
}

function billingCheck() {
  new Date().getDate()
}

function scheduler() {
  console.log('scheduled')
  schedule.scheduleJob(morningRule, function () {
    createTasks({
      time: 'Morning',
      emoji: '🌅',
      due_date: (1 * hours) + datetime()
    })
  });

  schedule.scheduleJob(nightRule, function () {
    createTasks({
      time: 'Evening',
      emoji: '🛫',
      due_date: (2 * hours) + datetime()
    })
  })

}

module.exports = scheduler
