// helpful unixtime values - these are in milliseconds as clickup parses times with unixtime in milliseconds
// can possibly run moment.js instead?
const hours = 3600000
const days = 86400000

const taskFlags = {
  gbl: 'gbl',
  srch: 'srch',
  socl: 'socl',
  cro: 'cro',
  ctv: 'ctv',
};

const srchTasks = [
  {
    name: "Check off first conversion reported in ad account",
    due_date: 2 * days,
    tags: ['pmax']
  },
  {
    name: "Remove optimized targeting",
    due_date: 1 * days,
    tags: ['yt']
  },
  {
    name: "Check exclusions after 24 hours",
    due_date: 2 * days,
    tags: ['yt']
  },
  {
    name: "Message client after 1st conversion with excitement!",
    due_date: 2 * days
  }
].map(obj => ({ ...obj, flag: taskFlags.srch }));

const soclTasks = [
  {
    name: "Check first conversion for GHL tracking and pixel reporitng",
    due_date: 2 * days
  }
].map(obj => ({ ...obj, flag: taskFlags.socl }));

const croTasks = [
  {
    name: "MONITORING: Day 1 - Ensure functionality on all incoming leads",
    due_date: 8 * hours
  },
  {
    name: "MONITORING: Day 2 - Ensure functionality on all incoming leads",
    due_date: 2 * days
  },
  {
    name: "MONITORING: Day 3 - Ensure functionality on all incoming leads",
    due_date: 3 * days
  }
].map(obj => ({ ...obj, flag: taskFlags.cro }));

module.exports = [...srchTasks, ...soclTasks, ...croTasks]