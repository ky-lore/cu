const express = require("express");
const router = express.Router();
const { datetime } = require("../src/utils");
const zapUrl = process.env.ZAPIER_BILLING_ENDPOINT;
const axios = require('axios')
const listId = process.env.LIST_ID;
const header = require('./_resources/header')

async function handler() {
  console.log('Overdue OK')
  const url = `https://api.clickup.com/api/v2/list/${listId}/task`
  axios.get(url, header)
  .then((res) => {
    console.log(res)
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
