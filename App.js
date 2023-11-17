require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const testCall = require('./src/schemas/testApiCall.js');

/* 

variables needed to be defined after incoming POST:

parentTaskId
assigneesArray - advanced checking later (will come direct from incoming request for now)
date - the unixtime reported in the incoming request

*/

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});