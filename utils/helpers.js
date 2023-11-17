const axios = require("axios");

async function getTaskById(header, taskId) {
  const url = `https://api.clickup.com/api/v2/task/${taskId}?custom_task_ids=true`;
  const response = await axios.get(url, header);
  return response.data;
}

async function createSubTask(header, task, taskId) {
  const query = new URLSearchParams({
    custom_task_ids: "true",
  }).toString();

  listId = task.list.id;

  // Creat new task
  const url = `https://api.clickup.com/api/v2/list/${listId}/task?${query}`;
  const newTask = {
    name: "Subtask",
    description: "New Task Description",
    assignees: [84086508],
    parent: taskId.toString(),
    notify_all: false,
  };

  console.log(url, newTask);

  // Post new task
  await axios.post(url, newTask, header);
}

function getAssigneeIds(assignees) {
  return assignees.map((assignee) => assignee.id);
}

module.exports = {
  getTaskById,
  createSubTask,
  getAssigneeIds,
};
