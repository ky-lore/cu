const { Task } = require("../db/mongodbCadence");
const { getTodoData } = require("./Todo");

// Slack API for email → Slack ID lookup
const { WebClient } = require("@slack/web-api");
const web = new WebClient(process.env.SLACKBOT);

const slackCache = {}; // email → slackId OR null
async function slackIdFromEmail(email) {
  if (!email) return null;

  // If we've already looked this email up, return cached result
  if (email in slackCache) {
    return slackCache[email];
  }

  try {
    const result = await web.users.lookupByEmail({ email });
    const slackId = result.user.id;

    slackCache[email] = slackId; // cache success
    return slackId;
  } catch (err) {
    console.log("Slack user not found for:", email);

    // Cache failure so we NEVER retry this email again
    slackCache[email] = null;

    return null;
  }
}

function intify(string) {
  switch (string) {
    case "Mo": return 1;
    case "Tu": return 2;
    case "We": return 3;
    case "Th": return 4;
    case "Fr": return 5;
    case "Sa": return 6;
    case "Su": return 0;
  }
}

async function handle_tasks(tasks) {
  // Fetch TODO data once
  const todoData = await getTodoData();

  const convertedTasks = [];

  for (const task of tasks) {
    const obj = task.toObject();

    // Match ClickUp folder to Slack channel
    const folder = todoData.find(
      f => f.slackChannel === obj["Internal Slack Channel ID"]
    );

    // Base Weekly CM message
    let message = `
*${obj["Account"]} – Weekly CM Meeting Tomorrow!*

Please provide updates on:
• *Outstanding tasks & deliverables*
• *Insights on campaign performance (L7 vs. P7)*
• *Key wins, challenges, or blockers*
• *Notable shifts in spend, CPC, or conversion trends*
• *Any client-facing items we should prepare for tomorrow’s meeting*
<@${task["Growth Rep UID"]}>
${obj["Pod"] != null ? "<!subteam^" + obj["Pod"] + '>' : "No Pod Yet"}
`.trim();

    // Append overdue TODO tasks
    if (folder && folder.todo.tasks.length > 0) {
      message += `\n\n*Overdue TODO Tasks:*\n`;

      for (const t of folder.todo.tasks) {
        // Convert email → Slack ID
        const slackId = await slackIdFromEmail(t.assigneeEmail);
        const assigneeTag = slackId ? `<@${slackId}>` : (t.assigneeEmail || "Unassigned");

        message += `• *${t.name}*\n`;
        message += `  - Assignee: ${assigneeTag}\n`;
        const dueDate = t.due_date ? t.due_date.slice(0, 10) : "None";
        message += `  - Due: ${dueDate}\n`;
        //message += `  - Due: ${t.due_date || "None"}\n`;
        //message += `  - Priority: ${t.priority || "None"}\n\n`;
      }
    }

    convertedTasks.push({
      ...obj,
      dayIndex: intify(obj["Day of Week"]),
      messaging: message
    });
  }

  console.log("✅ Message + TODO + Slack tagging works!");
  return convertedTasks;
}

module.exports = { handle_tasks };