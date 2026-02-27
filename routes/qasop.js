const express = require("express");
const router = express.Router();
const axios = require("axios");
const { map } = require("../src/schemas/globalPrepTasks");
require("dotenv").config();

const SPACE_ID = "90144445880";
const TOKEN = process.env.CLICKUP_API_KEY;

function create_profiles(results) {
  const profiles = {};

  for (const entry of results) {
    for (const task of entry.tasks) {

      // Find the "Associate Being Audited" field
      const personField = task.custom_fields.find(
        f => f.name === "Associate Being Audited"
      );

      if (!personField) continue;

      // Convert dropdown index → actual name
      const selectedIndex = personField.value;
      const options = personField.type_config?.options || [];
      const personName = options[selectedIndex]?.name;

      if (!personName) continue;

      if (!profiles[personName]) {
        profiles[personName] = {
          scores: [],
          average: null
        };
      }
    }
  }

  return profiles;
}
function calculate_average(results, profiles) {
  for (const entry of results) {
    if (
      entry.folder === "Forms"
    ) {
      for (const task of entry.tasks) {

        // Get the person
        const personField = task.custom_fields.find(
          f => f.name === "Associate Being Audited"
        );

        if (!personField) continue;

        const selectedIndex = personField.value;
        const options = personField.type_config?.options || [];
        const personName = options[selectedIndex]?.name;

        if (!personName) continue;

        // Get the rating
        const ratingField = task.custom_fields.find(
          f => f.name === "Overall Compliance Rating with SOP"
        );

        if (ratingField && ratingField.value != null) {
          const score = Number(ratingField.value);
          profiles[personName].scores.push(score);
        }
      }
    }
  }

  // Compute averages
  for (const name in profiles) {
    const scores = profiles[name].scores;
    profiles[name].average =
      scores.length > 0
        ? scores.reduce((a, b) => a + b, 0) / scores.length
        : 0;
  }

  return profiles;
}

router.get("/", async (req, res) => {

  try {
    const foldersRes = await axios.get(
      `https://api.clickup.com/api/v2/space/${SPACE_ID}/folder`,
      { headers: { Authorization: TOKEN } }
    );

    const folders = foldersRes.data.folders;
    const results = [];
    
    for (const folder of folders) {
      const listsRes = await axios.get(
        `https://api.clickup.com/api/v2/folder/${folder.id}/list`,
        { headers: { Authorization: TOKEN } }
      );

      const lists = listsRes.data.lists;

      for (const list of lists) {
        const tasksRes = await axios.get(
          `https://api.clickup.com/api/v2/list/${list.id}/task`,
          { headers: { Authorization: TOKEN } }
        );

        const tasks = tasksRes.data.tasks;

        // KEEP RAW CUSTOM FIELDS
        const rawTasks = tasks.map(task => ({
          id: task.id,
          name: task.name,
          status: task.status?.status,
          custom_fields: task.custom_fields
        }));

        results.push({
          folder: folder.name,
          list: list.name,
          tasks: rawTasks
        });
      }
    }




    // pipeline time
const sop_object = {};

const formsLists = results.filter(r => r.folder === "Forms");

for (const listEntry of formsLists) {
  const listName = listEntry.list;

  const profiles = create_profiles([listEntry]);
  const averages = calculate_average([listEntry], profiles);

  sop_object[listName] = averages;
}
res.json(sop_object);


  } catch (err) {
    console.error(err.response?.data || err);
    res.status(500).send("Error fetching ClickUp data");
  }
});

module.exports = router;