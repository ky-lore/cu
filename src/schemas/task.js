const query = new URLSearchParams({
  custom_task_ids: 'true',
  team_id: '123'
}).toString();

const listId = '900901670366';
const resp = await fetch(
  `https://api.clickup.com/api/v2/list/${listId}/task?${query}`,
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'YOUR_API_KEY_HERE'
    },
    body: JSON.stringify({
      name: 'New Task Name',
      description: 'New Task Description',
      markdown_description: 'New Task Description',
      assignees: [183],
      tags: ['tag name 1'],
      status: 'Open',
      priority: 3,
      due_date: 1508369194377,
      due_date_time: false,
      time_estimate: 8640000,
      start_date: 1567780450202,
      start_date_time: false,
      notify_all: true,
      parent: null,
      links_to: null,
      check_required_custom_fields: true,
      custom_fields: [
        {
          id: '0a52c486-5f05-403b-b4fd-c512ff05131c',
          value: 'This is a string of text added to a Custom Field.'
        }
      ]
    })
  }
);

const data = await resp.json();
console.log(data);