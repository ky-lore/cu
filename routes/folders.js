const express = require("express");
const router = express.Router();
const axios = require("axios");
require("dotenv").config();

const SPACE_ID = process.env.SPACE_ID;
const TOKEN = process.env.CLICKUP_API_KEY;

router.get("/", async (req, res) => {
  try {
    // 1. Get all folders in the space
    const response = await axios.get(
      `https://api.clickup.com/api/v2/space/${SPACE_ID}/folder`,
      { headers: { Authorization: TOKEN } }
    );

    const results = [];

    // 2. Loop through each folder
    for (const folder of response.data.folders) {
      // Find the Weekly CM list inside this folder
      const weeklyList = folder.lists.find(list =>
        list.name.toLowerCase().includes("weekly cm")
      );

      if (!weeklyList) {
        results.push({
          folder: folder.name,
          weeklyCM: null
        });
        continue;
      }

      // 3. Fetch ALL tasks in the Weekly CM list
      const taskRes = await axios.get(
        `https://api.clickup.com/api/v2/list/${weeklyList.id}/task`,
        { headers: { Authorization: TOKEN } }
      );

      const tasks = taskRes.data.tasks;

      if (!tasks || tasks.length === 0) {
        results.push({
          folder: folder.name,
          weeklyCM: null
        });
        continue;
      }

      // 4. Sort tasks by most recent creation date
      const mostRecent = tasks.sort(
        (a, b) => Number(b.date_created) - Number(a.date_created)
      )[0];

      // 5. Format the single most recent entry
      results.push({
        folder: folder.name,
        weeklyCM: {
          id: mostRecent.id,
          name: mostRecent.name,
          created: new Date(Number(mostRecent.date_created)).toISOString(),
          status: mostRecent.status?.status
        }
      });
    }

    // 6. Return the results
    res.json(results);

  } catch (error) {
    console.error("ClickUp error:", error.response?.data || error.message);
    res.status(500).json({
      error: error.response?.data || "Unknown error"
    });
  }
});

module.exports = router;