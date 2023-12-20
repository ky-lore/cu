const express = require("express");
const router = express.Router();
const { usersDb } = require('../src/db')
const { datetime } = require('../src/utils')
const { createSubtasks } = require('../src/controllers')

const morning = {
  time: 'Morning',
  emoji: '🌅',
  due_date: (1 * hours) + datetime()
}

function handler(time) {
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

// @route   GET /morning
// @desc    Handle the movement of a task and create a subtask
// @access  Public
router.get("/", async (req, res) => {
  try {
    console.log('test')
    handler(morning)
    res.send("Success");
  } catch (error) {
    console.error(error)
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;