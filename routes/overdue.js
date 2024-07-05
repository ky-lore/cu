const express = require("express");
const router = express.Router();
const { datetime } = require("../src/utils");
const zapUrl = process.env.ZAPIER_BILLING_ENDPOINT;
const axios = require('axios')
const listId = process.env.LIST_ID;
const header = require('./_resources/header')

async function handler() {
  console.log('Overdue OK')
  const query = new URLSearchParams({
    archived: 'false',
    include_markdown_description: 'true',
    page: '0',
    order_by: 'string',
    reverse: 'true',
    subtasks: 'true',
    statuses: 'string',
    include_closed: 'true',
    assignees: 'string',
    watchers: 'string',
    tags: 'string',
    due_date_gt: '0',
    due_date_lt: '0',
    date_created_gt: '0',
    date_created_lt: '0',
    date_updated_gt: '0',
    date_updated_lt: '0',
    date_done_gt: '0',
    date_done_lt: '0',
    custom_fields: 'string',
    custom_field: 'string',
    custom_items: '0'
  }).toString();
  const url = `https://api.clickup.com/api/v2/list/${listId}/task?${query}`
  axios.get(url, header)
  .then((res) => {
    console.log(res.data)
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
