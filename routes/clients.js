const express = require("express");
const router = express.Router();
const axios = require('axios');
const cors = require('cors');

// CORS configuration
const corsOptions = {
  origin: 'https://www.energyscaperenewables.com',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};

// Apply CORS middleware to this router
router.use(cors(corsOptions));

router.post("/", async (req, res) => {
  try {
    const data = req.body;
    const queryData = req.query; // Extract query parameters
    console.log('Received data:', data);

    const zapUrl = 'https://hooks.zapier.com/hooks/catch/5506897/237uhk1/'

    const response = await axios.post(zapUrl, postObj);
    console.log('Zapier response:', response.data);
    console.log('Received query parameters:', queryData);
    res.send('Data received and external request sent successfully');
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;