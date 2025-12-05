const { assignLsa } = require("../../routes/_helpers/helpers");
const { lsaTasks } = require("../schemas/index");
const { datetime } = require("../utils");
const { createSubtasks } = require("../controllers");
const { createChecklists } = require("../controllers");
const { createChecklistItems } = require("../controllers");

async function handleLasTasks() {
  const parentLsaTasks = await getParentLsaTasks(); // Get all tasks with lsa tag from clickup
  const createdSubTaskIds = await createSubtasksHelper(parentLsaTasks); // Create a sub task for each parent task and get their ids
  const createdChecklistIds = await createListsHelper(createdSubTaskIds); // Create a checklist on each sub task and get their ids
  await insertItemsIntoList(createdChecklistIds, lsaTasks); // Insert all lsaTasks as a checklist item into each checklist
}

async function getParentLsaTasks() {
  // Fetch data from LSA tasks using the assignLsa function
  const lsaArray = await assignLsa();

  // Map LSA tasks data to a format required for clickupData
  return lsaArray
    .map((lsaTask) => {
      const mainPocId = getMainPocId(lsaTask.custom_fields);
      return {
        parentId: lsaTask.id,
        mainPocId: mainPocId,
      };
    })
    .filter((lsaItem) => lsaItem.mainPocId);
}

function getMainPocId(customFields) {
  // Filter custom fields to find the one with the name "SEARCH MAIN POC"
  const mainPoc = customFields.filter(
    (customField) => customField.name === "SEARCH MAIN POC"
  );

  return mainPoc[0]?.value?.[0]?.id || null; // Return null if no main POC information found
}

async function createSubtasksHelper(clickupData) {
  // Intalize new task objects
  const newLsaTasks = clickupData.map((data) => ({
    name: "LSA Checklist",
    assignees: [data.mainPocId],
    due_date: datetime() + 8 * 3600000,
    start_date: datetime(),
    parent: data.parentId,
  }));

  // Create each new task
  const createdSubTasks = await createSubtasks(
    newLsaTasks,
    process.env.LIST_ID
  );

  // Return the ids of each new task
  return createdSubTasks.map((createdTask) => createdTask.id);
}

async function createListsHelper(createdSubTaskIds) {
  // Create checklist for each new subtask
  const createdChecklists = await createChecklists(createdSubTaskIds);

  // Return the ids of each new checklist
  return createdChecklists.map((checklist) => checklist.checklist.id);
}

async function insertItemsIntoList(createdChecklistIds, lsaTasks) {
  // Intalize new checklist items
  const checklistItems = [];
  lsaTasks.forEach((task) => {
    createdChecklistIds.forEach((checklistId) => {
      checklistItems.push({
        checklist_id: checklistId,
        name: task.name,
      });
    });
  });

  // Create new checklist item
  await createChecklistItems(checklistItems);
}

module.exports = handleLasTasks;
