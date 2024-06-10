const express = require("express");
const router = express.Router();
const zapUrl = process.env.ZAPIER_CU_ENDPOINT;
const axios = require('axios');

async function handler() {

}

router.post("/", async (req, res) => {
  try {
    const data = req.body;
    console.log(req.query)
    console.log(req.params)
    res.send('Data received successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;