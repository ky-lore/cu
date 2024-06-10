const express = require("express");
const router = express.Router();
const { usersDb, billingMapping } = require("../src/db");
const { datetime } = require("../src/utils");
const zapUrl = process.env.ZAPIER_BILLING_ENDPOINT;
const axios = require('axios')

async function handler(billingMapping) {
  console.log('BILLING')
  const today = new Date().getDate();
  console.log(today)
  const lastDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 0).getDate();
  
  for (const entry of billingMapping) {
    const billingDate = entry.billingDate;
    console.log(entry)
    
    if (today === billingDate - 2 || (today === lastDayOfMonth && (billingDate === 1 || billingDate === 2))) {
      axios.post(zapUrl, entry)
      .then(res => {
        console.log(res.data)
      })
      .catch(err => {
        console.error(err)
      })
    }
  }
}

router.get("/", async (req, res) => {
  try {
    await handler(billingMapping);
    
    res.send("Success");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;