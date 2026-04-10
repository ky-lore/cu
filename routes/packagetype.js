const express = require("express");
const router = express.Router();
const axios = require("axios");
require("dotenv").config();
const TOKEN = process.env.CLICKUP_API_KEY;
async function createClickupList(folderId, listName) {
  try {
    const response = await axios.post(
  `https://api.clickup.com/api/v2/folder/${folderId}/list`,
  {
    name: listName
  },
  {
    headers: {
      Authorization: TOKEN
    }
  }
);

    console.log("List created:");
    return response.data;
  } catch (err) {
    
    console.error("Error creating ClickUp list:", err.response?.data || err);
  }
}

async function createPackages(data) {
  const hashmap = data.package.split(",").reduce((acc, item) => {
    acc[item.trim()] = true;
    return acc;
  }, {});

for (const key in hashmap) {
    console.log("Creating list for:", key);
    //await createClickupList(data.folder, key); 

     switch (key) {
      case "Marketing":
        await createClickupList(data.folder, "Marketing");
        break;

      case "Full Website":
        await createClickupList(data.folder, "Full Website");
        break;

      case "Creative":
        await createClickupList(data.folder, "Creative");
        break;

      default:
        console.log("No matching case for:", key);
        break;
    }
    // should be data.folder
  }
}

router.get("/", async (req, res) => {
  const raw = req.query.json;
  const data = raw ? JSON.parse(raw) : {};

  console.log("Received data from Zapier:", data);

  await createPackages(data);

  res.status(200).send("Webhook received!");
});

module.exports = router;