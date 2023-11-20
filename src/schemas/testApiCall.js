require('dotenv').config();

async function main() {
  const apiKey = process.env.PERSONAL_API_KEY;
  const listId = process.env.LIST_ID;

  let testTask = {
    "name": "New Task Name",
    "description": "New Task Description",
    "markdown_description": "New Task Description",
    "assignees": [
      82219496
    ],
    "tags": [
      "tag name 1"
    ],
    "status": "Onboarding",
    "priority": 3,
    "due_date": 1508369194377,
    "due_date_time": false,
    "time_estimate": 8640000,
    "start_date": 1567780450202,
    "start_date_time": false,
    "notify_all": true,
    "parent": null,
    "links_to": null,
    "check_required_custom_fields": true,
    "custom_fields": [
    ]
  }

  const cuPush = await fetch(
    `https://api.clickup.com/api/v2/list/${listId}/task`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': apiKey
      },
      body: JSON.stringify(testTask)
    }
  );

  const data = await cuPush.json();
  console.log(data);
}

main();