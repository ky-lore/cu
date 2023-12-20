const axios = require('axios')
const header = require('../../routes/_resources/header')

/**
 * 
 * @param {*} taskArray array of initialized tasks from taskHandler.js
 * @param {*} listId needed to push to corresponding CU board
 */
function createSubtasks(taskArray, listId) {
  console.log(taskArray)
  // hit the CU API with each task object
  taskArray.forEach(taskObj => {
    console.log('task ref')
    const url = `https://api.clickup.com/api/v2/list/${listId}/task?custom_task_ids=true`;

    try {
      console.log(url)
      console.log(header)
      console.log(taskObj)
      console.log(JSON.stringify(taskObj))
      axios.post(url, JSON.stringify(taskObj), header);
    } catch (err) {
      // TODO: Handle errors appropriately
      console.error("Error creating subtask:", err.message);
    }
  })
}

module.exports = createSubtasks