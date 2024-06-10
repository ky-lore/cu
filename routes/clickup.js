const express = require("express");
const router = express.Router();
const axios = require('axios');
const zapUrl = process.env.ZAPIER_CU_ENDPOINT;

router.post("/", async (req, res) => {
  try {
    const data = req.body;
    const queryData = req.query; // Extract query parameters

    console.log('Received data:', data);
    console.log('Received query parameters:', queryData);

    // Make a POST request to the external endpoint with query parameters
    const response = await axios.post(zapUrl, queryData);

    console.log('Response from external endpoint:', response.data);

    res.send('Data received and external request sent successfully');
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
