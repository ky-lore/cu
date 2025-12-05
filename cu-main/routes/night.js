const express = require("express");
const router = express.Router();
const { usersDb } = require('../src/db')
const { datetime } = require('../src/utils')
const { createSubtasks } = require('../src/controllers')

const hours = 3600000

const night = {
  time: 'Morning',
  emoji: '🌃',
  due_date: (1 * hours) + datetime()
}

async function handler(time) {
  let taskArray = usersDb
    .map(user => ({
      name: `${user._name.split(' ')[0]} ${time.time} Check In - Please Audit Your Due Dates & Move if Needed`,
      assignees: [user.uid],
      parent: process.env.DAILYTASK_ID,
      custom_fields: [{
        id: process.env.CUSTOMFIELDID,
        value: '86b16m877'
      }],
      exempt: user.exempt,
      due_date: new Date().getTime()
    }))
    .filter(user => !user.exempt)

  await createSubtasks(taskArray, process.env.LIST_ID)
}

// @route   GET /morning
// @desc    Handle the movement of a task and create a subtask
// @access  Public
router.get("/", async (req, res) => {
  try {
    console.log('test')
    await handler(night)
    res.send("Success");
  } catch (error) {
    console.error(error)
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;