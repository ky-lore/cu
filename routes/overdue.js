const express = require("express");
const router = express.Router();
const { datetime } = require("../src/utils");
const zapUrl = process.env.ZAPIER_OVERDUE_ENDPOINT;
const axios = require('axios')
const header = require('./_resources/header')

async function handler() {
  console.log('Overdue OK')
  const listId = '900901670366';
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const url = `https://api.clickup.com/api/v2/list/${listId}/task?due_date_lt=${currentTimestamp}`;
  await axios.get(url, header)
  .then((res) => {
    const tasks = res.data.tasks;
    tasks.forEach(task => {
      axios.post(zapUrl, task)
      .then(res => console.log(res))
      .catch(err => console.error(err))
    })
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
