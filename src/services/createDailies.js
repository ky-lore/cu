require('dotenv').config()
const { usersDb } = require('../db')
const schedule = require('node-schedule');

/**
 * TODO: replace with an actual db for future scalability
 */

function createDailies(time) {
  let taskArray = []
  const morning = schedule.scheduleJob('30 * * * * *', function() {
    console.log('THE SCHEDULE WORKS')
  });
}

module.exports = createDailies