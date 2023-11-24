// helpful unixtime values - these are in ms
// can possibly run moment.js instead?
const hours = 3600000
const days = 86400000

// TODO: REFACTOR AS SEPARATE ARRAYS FOR EACH DEPT. AND CONCAT TO EXPORT, REFACTOR due_date TO ABOVE UNIXTIME VALUES
// see: globalDevTasks
module.exports = [
  {
    name: "Confirm Onboarding Form",
    status: "onboarding",
    due_date: 28800000,
    leads: true
  },
  {
    name: "Pin live onboarding doc to INTERNAL Slack channel",
    status: "onboarding",
    due_date: 28800000,
    leads: true
  },
  {
    name: "Introduce self to client in EXTERNAL Slack channel",
    status: "onboarding",
    due_date: 28800000,
    leads: true
  },
  {
    name: "Assign all members to master ClickUp card",
    status: "onboarding",
    due_date: 28800000,
    leads: true
  },
  {
    name: "Assign main POCs to custom fields in ClickUp card",
    status: "onboarding",
    due_date: 28800000,
    leads: true
  },
  {
    name: "Schedule leads kickoff call with client",
    status: "onboarding",
    due_date: 259200000,
    leads: true
  },
  {
    name: "SEARCH: Confirm asset connections & logins",
    status: "onboarding",
    due_date: 259200000,
    leads: true
  },
  {
    name: "SOCIAL: Confirm asset connections & logins",
    status: "onboarding",
    due_date: 259200000,
    leads: true
  },
  {
    name: "CRO: Confirm asset connections & logins",
    status: "onboarding",
    due_date: 259200000,
    leads: true
  }
]