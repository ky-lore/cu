const axios = require("axios");
require("dotenv").config();

const SPACE_ID = process.env.SPACE_ID;
const TOKEN = process.env.CLICKUP_API_KEY;

const REQUEST_DELAY = 250;
const MAX_RETRIES = 3;




const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

async function safeRequest(url, retries = MAX_RETRIES) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await axios.get(url, {
        headers: { Authorization: TOKEN },
        timeout: 15000
      });
    } catch (err) {
      if (attempt === retries) throw err;
      await sleep(500);
    }
  }
}

async function getTodoData() {
  const folderRes = await safeRequest(
    `https://api.clickup.com/api/v2/space/${SPACE_ID}/folder`
  );

  const folders = folderRes.data.folders || [];
  const results = [];
  const now = Date.now();

  for (const folder of folders) {
    await sleep(REQUEST_DELAY);
    // buffer just in case of failure

    //The folder employs regex with .match to employ it 
    const match = folder.name.match(/\(([^)]+)\)$/);
    const slackChannel = match ? match[1] : null;

    const todoList = folder.lists.find(list =>
      list.name.toLowerCase().includes("todo")
    );

    let overdueTasks = [];

    if (todoList) {
      try {
        const todoRes = await safeRequest(
          `https://api.clickup.com/api/v2/list/${todoList.id}/task`
        );

        overdueTasks = (todoRes.data.tasks || [])
          .map(t => ({
            name: t.name,
            //assignee:
              //t.assignees?.[0]?.username ||
              //t.assignees?.[0]?.email ||
              //null,
            assigneeEmail: t.assignees?.[0]?.email || null,
            due_date: t.due_date
              ? new Date(Number(t.due_date)).toISOString()
              : null,
            priority: t.priority?.priority || null,
            due_ts: t.due_date ? Number(t.due_date) : null
          }))
          .filter(t => t.due_ts !== null && t.due_ts < now);
      } catch (err) {
        console.error("Failed to fetch TODO tasks for folder:", folder.name);
      }
    }

    results.push({
      folder: folder.name,
      slackChannel,
      todo: {
        id: todoList?.id || null,
        tasks: overdueTasks
      }
    });
  }

  return results;
}

module.exports = { getTodoData };