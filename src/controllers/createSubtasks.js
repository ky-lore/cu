const axios = require('axios')
const header = require('../../routes/_resources/header')

/**
 * 
 * @param {*} taskArray array of initialized tasks from taskHandler.js
 * @param {*} listId needed to push to corresponding CU board
 */
function createSubtasks(taskArray, listId) {
  // hit the CU API with each task object
  taskArray.forEach(taskObj => {
    const url = `https://api.clickup.com/api/v2/list/${listId}/task?custom_task_ids=true`;

    try {
      axios.post(url, taskObj, header);
    } catch (err) {
      // TODO: Handle errors appropriately
      console.error("Error creating subtask:", err.message);
    }
  })
}

module.exports = createSubtasks