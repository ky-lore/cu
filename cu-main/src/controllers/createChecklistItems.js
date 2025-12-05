const axios = require("axios");
const header = require("../../routes/_resources/header");

/**
 *
 * @param {*} checklistItems array of check list objects
 */
async function createChecklistItems(checklistItems) {
  const allNewChecklistItems = await Promise.all(
    checklistItems.map(async ({ checklist_id, name }) => {
      const url = `https://api.clickup.com/api/v2/checklist/${checklist_id}/checklist_item`;

      try {
        const res = await axios.post(url, { name: name }, header);
        console.log("Checklist item created successfully");
        return res.data;
      } catch (err) {
        // TODO: Handle errors appropriately
        console.error("Error creating checklist item:", err.message);
      }
    })
  );

  return allNewChecklistItems;
}

module.exports = createChecklistItems;
