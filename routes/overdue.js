const express = require("express");
const router = express.Router();
const { datetime } = require("../src/utils");
const zapUrl = process.env.ZAPIER_OVERDUE_ENDPOINT;
const axios = require('axios')
const header = require('./_resources/header')

async function handler() {
  console.log('Overdue OK')
  const listId = '900901670366';
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const timestamp = startOfDay.getTime();
  let taskStr = ''

  const url = `https://api.clickup.com/api/v2/list/${listId}/task?due_date_lt=${timestamp}&subtasks=true&order_by=due_date`;
  await axios.get(url, header)
  .then((res) => {
    const tasks = res.data.tasks;
    tasks.forEach(task => {
      taskStr += `*Task:* ${task.name}\n*Due Date:* ${parseInt(task.due_date)}\n*Assignee:* ${task.assignees[0].username}\n_______`;
    })
    console.log(taskStr)
    axios.post(zapUrl, {
      taskString: taskStr
    })
    .then(res => console.log(res))
    .catch(err => console.error(err))
  })
  .catch(err => console.error(err))
}


router.get("/", async (req, res) => {
  try {
    await handler();
    res.send("Overdue OK");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
