const express = require("express");
const router = express.Router();
const axios = require("axios");
require("dotenv").config();

const GHL_API_URL = "https://rest.gohighlevel.com/v1/locations";
const GHL_TOKEN = process.env.GHL_ACTUAL; 

router.post("/", async (req, res) => {
  try {
    const data = req.body;
    console.log(data)
    // HARD‑CODED VALUES
    const payload = {
      businessName: data.customData.businessName,
      address: `${data.address ? data.address : "123 Sesame St."}`,
      city: `${data.city ? data.city : "Orange"}`,
      state: `${data.state ? data.state : "CA"}`,
      postalCode: `${data.city ? data.city : "92626"}`,
      country: "US",
      website: `${data.website ? data.website : "https://www.example.com"}`,
      timezone: "US/Pacific",
      firstName: `${data.firstName ? data.firstName : "TBA"}`,
      lastName: `${data.lastName ? data.lastName : "TBA"}`,
      email: `${data.email ? data.email : "kyle@advancedmarketers.co"}`,
      phone: data.phone,
      settings: {
        allowDuplicateContact: false,
        allowDuplicateOpportunity: false,
        allowFacebookNameMerge: false,
        disableContactTimezone: false
      },
      snapshot: {
        "id": "LR4ngdhMWZF5w5hhmk7z",
        "type": "vertical"
      }
    };

    // console.log(payload)

    const response = await axios.post(GHL_API_URL, payload, {
      headers: {
        Authorization: `Bearer ${GHL_TOKEN}`,
        "Content-Type": "application/json",
        Version: "2021-07-28"
      }
    });

    return res.status(201).json({
      message: "Subaccount created successfully",
      locationId: response.data.location?.id,
      raw: response.data
    });

  } catch (err) {
    console.error(err.response?.data || err.message);
    return res
      .status(err.response?.status || 500)
      .json(err.response?.data || { error: "Internal server error" });
  }
});

module.exports = router;