// helpful unixtime values - these are in ms
// can possibly run moment.js instead?
const hours = 3600000
const days = 86400000

const status = 'onboarding'

const createTask = (name, due_date, flags) => ({
  name,
  due_date,
  flags,
  status
})


const gblTasks = [
  { name: "Schedule external kickoff meet" },
  { name: "Schedule post-kickoff internal meet" },
].map(task => createTask(task.name, 1 * days, ['global']))

const srchEcomTasks = [
  { name: "Google Merchant Center setup" },
  { name: "Ad account setup" },
  { name: "GA4 setup" },
  { name: "Google Tag Manager setup" },
  { name: "COGS list and analysis" }
].map(task => createTask(task.name, 2 * days, ['google', 'ecom']))

const srchLeadgenTasks = [
  { name: "Ad account setup" },
  { name: "GA4 setup" },
  { name: "Google Tag Manager setup" }
].map(task => createTask(task.name, 2 * days, ['google', 'leadgen']))

const socEcomTasks = [
  { name: "Shopify access" },
  { name: "Business manager" },
  { name: "Ad account" },
  { name: "Meta page setup" },
].map(task => createTask(task.name, 2 * days, ['social', 'ecom']))

const socLeadgenTasks = [
  { name: "Business manager" },
  { name: "Ad account setup" },
  { name: "Meta page setup" }
].map(task => createTask(task.name, 2 * days, ['social', 'leadgen']))

const devTasks = [
  { name: "Domain access" },
  { name: "Website/hosting access" },
  { name: "GHL creation if nec." },
  { name: "Brand Guide" },
  { name: "Reference Pages" },
  { name: "CRM access (if not GHL)" },
  { name: "3rd Party Integration Access/Fulfillment" },
  { name: "Tracking codes/pixels" },
  { name: "Remove ALL third party scripts" },
].map(task => createTask(task.name, 2 * days, ['dev']))

module.exports = [
  ...gblTasks,
  ...srchEcomTasks,
  ...srchLeadgenTasks,
  ...socEcomTasks,
  ...srchLeadgenTasks,
  ...devTasks
]