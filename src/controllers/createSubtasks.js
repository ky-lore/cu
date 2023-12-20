const axios = require('axios');
const header = require('../../routes/_resources/header');

/**
 * 
 * @param {*} taskArray array of initialized tasks from taskHandler.js
 * @param {*} listId needed to push to corresponding CU board
 */
async function createSubtasks(taskArray, listId) {
  console.log(taskArray);

  // Use Promise.all to wait for all requests to complete
  await Promise.all(taskArray.map(async (taskObj) => {
    const url = `https://api.clickup.com/api/v2/list/${listId}/task?custom_task_ids=true`;

    try {
      await axios.post(url, JSON.stringify(taskObj), header);
      console.log('Subtask created successfully:', taskObj.name);
    } catch (err) {
      // TODO: Handle errors appropriately
      console.error("Error creating subtask:", err.message);
    }
  }));
}

module.exports = createSubtasks;
