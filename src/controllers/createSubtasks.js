const axios = require("axios");
const header = {
  headers: {
    Authorization: 'pk_88213720_3C407NGBGKP392FAFRECWNFWODAAVFGW',
    'Content-Type': 'application/json',
  },
};

/**
 *
 * @param {*} taskArray array of initialized tasks from taskHandler.js
 * @param {*} listId needed to push to corresponding CU board
 */
async function createSubtasks(taskArray, listId) {
  // console.log(taskArray);

  const allNewTasks = await Promise.all(
    taskArray.map(async (taskObj) => {
      const url = `https://api.clickup.com/api/v2/list/${listId}/task?custom_task_ids=true`;

      try {
        const res = await axios.post(url, JSON.stringify(taskObj), header);
        console.log(taskObj)
        console.log("Subtask created successfully:", taskObj.name);
        return res.data;
      } catch (err) {
        // TODO: Handle errors appropriately
        console.error("Error creating subtask:", err.message);
      }
    })
  );

  return allNewTasks;
}

module.exports = createSubtasks;
