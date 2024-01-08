const { assignLsa } = require("../../routes/_helpers/helpers");
const { lsaTasks } = require("../schemas/index");
const { datetime } = require("../utils");
const { createSubtasks } = require("../controllers");

async function handleLasTasks() {
  // Fetch data from LSA tasks and assign it to clickupData
  const clickupData = await getDataFromLsaTasks();

  // Create an array to store combined task objects for ClickUp
  const combinedTasks = [];

  // Loop through each LSA task and each clickupData item to generate task objects
  lsaTasks.forEach((task) => {
    clickupData
      .filter((data) => data.mainPocId) // Filter out tasks where main POC is not defined
      .forEach((data) => {
        // Create a new task object
        const newTask = {
          name: task.name,
          assignees: [data.mainPocId],
          due_date: datetime() + task.due_date,
          start_date: datetime(),
          parent: data.parentId,
        };

        // Add the new task object to the combinedTasks array
        combinedTasks.push(newTask);
      });
  });

  // Create subtasks in ClickUp using combinedTasks and the specified LIST_ID
  await createSubtasks(combinedTasks, process.env.LIST_ID);
}

async function getDataFromLsaTasks() {
  // Fetch data from LSA tasks using the assignLsa function
  const lsaArray = await assignLsa();

  // Map LSA tasks data to a format required for clickupData
  return lsaArray.map((lsaTask) => {
    const mainPocId = getMainPocId(lsaTask.custom_fields);
    return {
      parentId: lsaTask.id,
      mainPocId: mainPocId,
    };
  });
}

function getMainPocId(customFields) {
  // Filter custom fields to find the one with the name "SEARCH MAIN POC"
  const mainPoc = customFields.filter(
    (customField) => customField.name === "SEARCH MAIN POC"
  );

  return mainPoc[0]?.value?.[0]?.id || null; // Return null if no main POC information found
}

module.exports = handleLasTasks;
