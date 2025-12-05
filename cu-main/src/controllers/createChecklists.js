const axios = require("axios");
const header = require("../../routes/_resources/header");

/**
 *
 * @param {*} createdSubTaskIds array of sub task ids
 */
async function createChecklists(createdSubTaskIds) {
  const allNewChecklists = await Promise.all(
    createdSubTaskIds.map(async (taskId) => {
      const url = `https://api.clickup.com/api/v2/task/${taskId}/checklist`;

      try {
        const res = await axios.post(url, {}, header);
        console.log("Created checklist successfully");
        return res.data;
      } catch (err) {
        // TODO: Handle errors appropriately
        console.error("Error creating checklist:", err.message);
      }
    })
  );

  return allNewChecklists;
}

module.exports = createChecklists;
