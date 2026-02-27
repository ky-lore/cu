const express = require("express");
const router = express.Router();
const axios = require("axios");
require("dotenv").config();

const GHL_API_URL = "https://rest.gohighlevel.com/v1/locations";
const GHL_TOKEN = process.env.GHL_ACTUAL; 

router.get("/", async (req, res) => {
  try {
    // HARD‑CODED VALUES
    const payload = {
      businessName: "Payloadworld",
      address: "3500 Deer Creek Road",
      city: "Palo Alto",
      state: "CA",
      postalCode: "94304",
      country: "US",
      website: "https://example.com/",
      timezone: "US/Central",
      firstName: "Elon",
      lastName: "Musk",
      email: "elon@tesla.com",
      phone: "+15555555555",
      settings: {
        allowDuplicateContact: false,
        allowDuplicateOpportunity: false,
        allowFacebookNameMerge: false,
        disableContactTimezone: false
      }
    };

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

module.exports = router;ch