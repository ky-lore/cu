// helpful unixtime values - these are in milliseconds as clickup parses times with unixtime in milliseconds
// can possibly run moment.js instead?
const hours = 3600000
const days = 86400000

const gblTasks = [
  {
    name: "Schedule initial strategy meet",
    due_date: 8 * hours,
    flag: 'gbl'
  }
]

const srchTasks = [
  {
    name: "Create assets/accounts if client does not have",
    due_date: 2 * days,
    flag: 'srch'
  },
  {
    name: "Connect with CRO to kickoff landing page builds",
    due_date: 2 * days,
    flag: 'srch'
  }
]

const soclTasks = [
  {
    name: "Conduct competitor analysis",
    due_date: 2 * days,
    flag: 'socl'
  },
  {
    name: "Audit of past account histories",
    due_date: 2 * days,
    flag: 'socl'
  },
  {
    name: "Creative requests if needed",
    due_date: 1 * days,
    flag: 'socl'
  }
]

const croTasks = [
  {
    name: "Internal strategy meet",
    due_date: 1 * days,
    flag: 'cro'
  },
  {
    name: "Create and pin web SOP documents",
    due_date: 8 * hours,
    flag: 'cro'
  },
  {
    name: "Create and pin mind map",
    due_date: 2 * days,
    flag: 'cro'
  }
]

const ctvTasks = [
  {
    name: "Curate style guide if non-existent",
    due_date: 1 * days,
    flag: 'ctv'
  }
]

// Concatenating all four arrays into one final export array to send to createSubtasks
module.exports = [...gblTasks, ...srchTasks, ...soclTasks, ...croTasks, ...ctvTasks]