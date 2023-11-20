require('dotenv').config();

// const adminIds = process.env.ADMIN_IDS.split('_')

const taskList = [
  {
    name: "Confirm Onboarding Form",
    description: null,
    markdown_description: null,
    assignees: null,
    status: "onboarding",
    due_date: 28800000,
    time_estimate: null,
    start_date: null,
    notify_all: true,
    parent: null
  },
  {
    name: "Pin live onboarding doc to INTERNAL Slack channel",
    description: null,
    markdown_description: null,
    assignees: null,
    status: "onboarding",
    due_date: 28800000,
    time_estimate: null,
    start_date: null,
    notify_all: true,
    parent: null
  },
  {
    name: "Introduce self to client in EXTERNAL Slack channel",
    description: null,
    markdown_description: null,
    assignees: null,
    status: "onboarding",
    due_date: 28800000,
    time_estimate: null,
    start_date: null,
    notify_all: true,
    parent: null,
    leads: true
  },
  {
    name: "Assign all members to master ClickUp card",
    description: null,
    markdown_description: null,
    assignees: null,
    status: "onboarding",
    due_date: 28800000,
    time_estimate: null,
    start_date: null,
    notify_all: true,
    parent: null,
    leads: true
  },
  {
    name: "Assign main POCs to custom fields in ClickUp card",
    description: null,
    markdown_description: null,
    assignees: null,
    status: "onboarding",
    due_date: 28800000,
    time_estimate: null,
    start_date: null,
    notify_all: true,
    parent: null,
    leads: true
  },
  {
    name: "Schedule leads kickoff call with client",
    description: null,
    markdown_description: null,
    assignees: null,
    status: "onboarding",
    due_date: 259200000,
    time_estimate: null,
    start_date: null,
    notify_all: true,
    parent: null,
    leads: true
  }
]

// assignees, parent will both be applied after request
// due_date will accept request time's unixtime added to it

module.exports = taskList