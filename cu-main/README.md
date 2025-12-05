
# BOOST ClickUp Ops

A centralized hub for handling internal ClickUp API-related operations.

## Status

In alpha build and locally functional, preparing for deployment and live testing.

## Current Core Features

- **Automated Stage Tasking**: ClickUp master task cards will be automatically assigned a dynamically generated set of tasks, assigned to the respective department, as well as dynamically generated due dates based on pre-determined timelines.
  
- **Cleaner Daily Check-in Tasks**: Gone are the days of a laundry list of perpetual check-in tasks for every team member and manual adding/setting of due dates when members get updated. Daily check-ins are now dynamically generated using a pseudo-DB of members and generate daily, making daily tasks much more scalable and cleaner to process.

## Next Up

- **Slack Commands** Integration of Slack API to create a more efficient, easier-to-use and more maintainable Slack-ClickUp command base ($task, $creative, etc.)

- ~~**Check-In Tasks** More efficient, intuitive, scalable and less cumbersome opening and closing check-in tasks~~

- **Automated Time Tracking and Reporting** Currently exploring feasibility of automated time tracking and reporting

## TODO

- Scalability testing/edge case testing for taskHandlers (multiple assignees, due dates on weekends etc.)

- Refactoring of early-stage handlers

- Cleanup and documentation to prepare for live deployment

## Getting Started

Clone this repository to set up ClickUp Ops locally and initialize the organizations .ENV file.

```bash
git clone https://github.com/BOOST-Media/clickup.git
cd clickup
npm i
npm run server
