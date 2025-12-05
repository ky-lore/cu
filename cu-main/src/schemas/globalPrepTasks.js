// helpful unixtime values - these are in ms
// can possibly run moment.js instead?
const hours = 3600000
const days = 86400000

// TODO: REFACTOR AS SEPARATE ARRAYS FOR EACH DEPT. AND CONCAT TO EXPORT, REFACTOR due_date TO ABOVE UNIXTIME VALUES
// see: globalDevTasks
module.exports = [
  {
    name: "Create Slack channel",
    status: "preparation",
    due_date: 1 * days
  },
  {
    name: "$init Slack if not automatic",
    status: "preparation",
    due_date: 1 * days
  },
  {
    name: "Assign POCs for SEARCH, CRO, SOCIAL",
    status: "preparation",
    due_date: 1 * days
  },
  {
    name: "Assign ALL relevant members to master ClickUp card task",
    status: "preparation",
    due_date: 1 * days
  },
  {
    name: "Assign Typeform tags",
    status: "preparation",
    due_date: 1 * days
  },
  {
    name: "Assign client POC emails",
    status: "preparation",
    due_date: 1 * days
  },
]