// routes/auth.js
const express = require("express");
const router = express.Router();
const axios = require("axios");
const qs = require("querystring");
require("dotenv").config();

const SPACE_ID = process.env.CLICKUP_SPACE_ID;
let accessToken = null;


router.get("/login2", (req, res) => {
  const redirectUri = encodeURIComponent(process.env.REDIRECT_URI);
  const clientId = process.env.CLIENT_ID;


  const authUrl = `https://app.clickup.com/api?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code`;
  res.redirect(authUrl);
});


router.get("/callback", async (req, res) => {
  console.log("Callback query:", req.query); // Debugging

  const code = req.query.code;
  if (!code) {
    return res.status(400).send("No code returned from ClickUp");
  }

  try {
    const response = await axios.post(
      "https://api.clickup.com/api/v2/oauth/token",
      qs.stringify({
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        redirect_uri: process.env.REDIRECT_URI,
        code: code,
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    accessToken = response.data.access_token;
    res.json({ accessToken });
  } catch (error) {
    console.error("❌ Error exchanging code:", error.response?.data || error.message);
    res.status(500).send("OAuth failed");
  }
});


router.get("/folders", async (req, res) => {
  if (!accessToken) {
    return res.status(401).json({ error: "No access token. Please login first." });
  }

  const foldersUrl = `https://api.clickup.com/api/v2/space/${SPACE_ID}/folder`;
  try {
    const foldersResponse = await axios.get(foldersUrl, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    res.json(foldersResponse.data.folders);
  } catch (error) {
    console.error("❌ Error fetching folders:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch folders" });
  }
});

module.exports = router;