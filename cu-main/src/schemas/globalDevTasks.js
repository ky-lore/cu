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

const gblTasks = [
  // Placeholder for future
].map(obj => ({ ...obj, name: 'LEADS - ' + obj.name, flag: taskFlags.gbl }));

const srchTasks = [
  {
    name: "Audience creation for campaigns",
    due_date: 2 * days,
    tags: ['yt']
  },
  {
    name: "Add all exclusions",
    due_date: 2 * days,
    tags: ['yt']
  },
  {
    name: "Curate multi-step survey form",
    due_date: 2 * days,
    tags: ['pmax']
  },
  {
    name: "Set up offline conversions for people who respond in GHL",
    due_date: 4 * days,
    tags: ['pmax']
  },
  {
    name: "Audience creation for campaigns + add all exclusions",
    due_date: 4 * days,
    tags: ['pmax']
  },
  {
    name: "QA landing page funnel in GHL with CRO main POC",
    due_date: 5 * days,
    tags: ['pmax']
  },
  {
    name: "Add bulk negative locations",
    due_date: 2 * days,
    tags: ['search']
  },
  {
    name: "Find and add negative search terms",
    due_date: 4 * days,
    tags: ['search']
  },
  {
    name: "QA landing page funnel in GHL with CRO main POC",
    due_date: 5 * days,
    tags: ['search']
  }
].map(obj => ({ ...obj, flag: taskFlags.srch }));

const soclTasks = [
  {
    name: "Audience building",
    due_date: 1 * days
  },
  {
    name: "Pixel connection",
    due_date: 2 * days
  },
  {
    name: "Create Shopify/Audience Lists",
    due_date: 3 * days
  },
  {
    name: "Campaign Building (See Description)",
    due_date: 5 * days,
    description: `
    - Approve budgets
    - Copywriting/Promo approved
    - Creatives ready + sized
    - Ensure lead form mapped to GHL
    - Review LP + Confirm pixel firing
    - Offline conversions pixel firing
    - Ensure automations working
    - QC campaign
    - Launch
    - Lead test: check tracking when first lead received
    `
  }
].map(obj => ({ ...obj, flag: taskFlags.socl }));

const croTasks = [
  {
    name: "Complete first proof of front-end and sign off on WEEK 2 in SOP document",
    due_date: 3 * days,
    tags: ['frontend']
  },
  {
    name: "Complete front-end QC and sign off",
    due_date: 4 * days,
    tags: ['frontend']
  },
  {
    name: "LEAD - Verify QC",
    due_date: 4 * days,
    tags: ['frontend']
  },
  {
    name: "Complete pre-launch checks with CMs",
    due_date: 5 * days,
    tags: ['frontend']
  },
  {
    name: "Complete backend + integrations first build",
    due_date: 10 * days,
    tags: ['backend']
  },
  {
    name: "Complete backend QC",
    due_date: 11 * days,
    tags: ['backend']
  },
  {
    name: "LEAD - Verify QC",
    due_date: 11 * days,
    tags: ['backend']
  },
  {
    name: "Complete backend + integrations first build",
    due_date: 12 * days,
    tags: ['backend']
  }
].map(obj => ({ ...obj, flag: taskFlags.cro }));

const ctvTasks = [
  // {
  //   name: "Map out creative timelines and gather all required assets and list of neccessary formats",
  //   due_date: 5 * days
  // }
].map(obj => ({ ...obj, flag: taskFlags.ctv }));

// Concatenating all four arrays into one final export array to send to createSubtasks
module.exports = [...gblTasks, ...srchTasks, ...soclTasks, ...croTasks, ...ctvTasks]