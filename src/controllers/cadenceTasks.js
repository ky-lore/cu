const { Task } = require("../db/mongodbCadence");

function intify(string){
   

switch (string) {
  case "Mo":
    return 1;
    
  case "Tu":
    return 2
  case "We":
    return 3
  case "Th":
    return 4
  
  case "Fr":
    return 5
  case "Sa":
    return 6
  case "Su":
    return 0
    
}
}



function handle_tasks(tasks) {
  const convertedTasks = tasks.map(task => {
    const obj = task.toObject();

    const message = `
*${obj["Account"]} – Weekly CM Meeting Tomorrow!*

Please provide updates on:
• *Outstanding tasks & deliverables*
• *Insights on campaign performance (L7 vs. P7)*
• *Key wins, challenges, or blockers*
• *Notable shifts in spend, CPC, or conversion trends*
• *Any client-facing items we should prepare for tomorrow’s meeting*
<@${task["Growth Rep UID"]}>
${task["Pod"] != null ? "<!subteam^" + task["Pod"] + '>': "No Pod Yet"}
`.trim();

    return {
      ...obj,
      dayIndex: intify(obj["Day of Week"]),
      messaging: message
    };
  });

  console.log("✅ Message works!");
  return convertedTasks;
}


module.exports = { handle_tasks };