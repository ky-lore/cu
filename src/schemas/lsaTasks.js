// helpful unixtime values - these are in milliseconds as clickup parses times with unixtime in milliseconds
// can possibly run moment.js instead?
const hours = 3600000;
const days = 86400000;

const lsaTasks = [
  {
    name: "Listen to calls",
    due_date: 8 * hours,
  },
  {
    name: "Reply to lead/send lead info to owner",
    due_date: 8 * hours,
  },
  {
    name: "Mark lead appropriately or archive if irrelevant",
    due_date: 8 * hours,
  },
  {
    name: "Request reviews from completed services",
    due_date: 8 * hours,
  },
];

// Concatenating all four arrays into one final export array to send to createSubtasks
module.exports = lsaTasks;
