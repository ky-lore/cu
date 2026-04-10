const { logSlack } = require("../src/controllers/slacklog");//Boilerplate setup
const express = require('express')
const router = express.Router();
const axios = require("axios");
require("dotenv").config();
const TEAM_ID = process.env.TEAM_ID
const TOKEN = process.env.CLICKUP_API_KEY;


router.post("/", async (req, res) => {
  console.log("FOREVER NOTES HIT:", req.body);
  // we'll fill this in later
  res.sendStatus(200);
});






module.exports = router;