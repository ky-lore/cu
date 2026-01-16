const express = require("express");
const router = express.Router();
const axios = require("axios");
require("dotenv").config();

const SPACE_ID = process.env.SPACE_ID;
const TOKEN = process.env.CLICKUP_API_KEY;



router.get("/", async (req, res) => {
  try {
    const response = await axios.get(
      `https://api.clickup.com/api/v2/space/${SPACE_ID}/folder`,
      { headers: { Authorization: TOKEN } }
    );

    const results = [];

    for (const folder of response.data.folders) {
      const weeklyList = folder.lists.find(list =>
        list.name.toLowerCase().includes("weekly cm")
      );

      if (!weeklyList) {
        results.push({ folder: folder.name, weeklyCM: null });
        continue;
      }

      const taskRes = await axios.get(
        `https://api.clickup.com/api/v2/list/${weeklyList.id}/task`,
        { headers: { Authorization: TOKEN } }
      );

      // Filter out anything that is NOT a real task
      const tasks = (taskRes.data.tasks || []).filter(
        t => t.id && t.date_created
      );

      if (tasks.length === 0) {
        results.push({ folder: folder.name, weeklyCM: null });
        continue;
      }

      // Sort newest → oldest
      const mostRecent = tasks.sort(
        (a, b) => Number(b.date_created) - Number(a.date_created)
      )[0];

      // Extract dropdown values
      const getDropdownValue = field => {
        if (field.value == null) return null;
        const option = field.type_config?.options?.[field.value];
        return option?.name || null;
      };

      // Fields you want to extract
      let clientTemperament = null;
      let internalHealthScore = null;
      let revenue = null;
      let quoted = null;
      let qualLeads = null;
      let clicks = null;
      let impressions = null;
      let convPercent = null;
      let negatives = null;

      for (const field of mostRecent.custom_fields || []) {
        const name = field.name.toLowerCase();

        if (name.includes("temperament")) clientTemperament = getDropdownValue(field);
        if (name.includes("health")) internalHealthScore = getDropdownValue(field);

        if (name.includes("revenue")) revenue = field.value ?? null;
        if (name.includes("quoted")) quoted = field.value ?? null;
        if (name.includes("qual")) qualLeads = field.value ?? null;
        if (name.includes("clicks")) clicks = field.value ?? null;
        if (name.includes("impressions")) impressions = field.value ?? null;
        if (name.includes("conv")) convPercent = field.value ?? null;

        if (name.includes("negatives")) negatives = field.value === true;
      }

      results.push({
        folder: folder.name,
        weeklyCM: {
          id: mostRecent.id,
          name: mostRecent.name,
          created: new Date(Number(mostRecent.date_created)).toISOString(),
          status: mostRecent.status?.status,
          clientTemperament,
          internalHealthScore,
          revenue,
          quoted,
          qualLeads,
          clicks,
          impressions,
          convPercent,
          negatives
        }
      });
    }

    res.json(results);

  } catch (error) {
    console.error("ClickUp error:", error.response?.data || error.message);
    res.status(500).json({
      error: error.response?.data || "Unknown error"
    });
  }
});

module.exports = router;