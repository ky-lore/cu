//connecting to server.js
const express = require("express");
const router = express.Router();

// Mongoose setip
const mongoose = require("mongoose");
// const mongoDBURL = process.env.MONGODB_URL || "mongodb://127.0.0.1:27017/mydemoDB";

// connecting to database
const connectDB = async () => {
  try {
   
    await mongoose.connect(process.env.MONGODB_URL, {
  dbName: "my_database"   // <-- must match the database name in Atlas
});
    console.log("✅ MongoDB connection successful");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1); 
  }
};


connectDB();
//convert data to json format thanks to mongoose
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
const TaskSchema = new mongoose.Schema({
  "Account": String,
  "Internal Slack Channel ID": String,
  "Day of Week": String,
  "Growth Rep": String,
  "Cadence": String,
  "used": Boolean
  
  
});
const Task = mongoose.model("Task", TaskSchema, "Weekly_Cadence_Three");


router.get("/", async (req, res) => {
  
  
  const tasks = await Task.find();
   
  const notifications = handle_tasks(tasks);
  //res.json(tasks)
  await handle_slack(res, notifications)
  
  console.log("✅ Message works!");
  res.json({ success: true, count: notifications.length });
});


// Add to the json for utility
function handle_tasks(tasks) {
  const convertedTasks = tasks.map(task => {
    const obj = task.toObject(); // convert once
    return {
      ...obj,
      dayIndex: intify(obj["Day of Week"]),
      messaging: `
      
      ${obj["Account"]} - Weekly CM Meeting Tomorrow!
        Please provide updates on outstanding tasks and deliverables and report on campaign progress:
        Impressions
        Clicks
        Conv%
        CPC
        Confirm L7 Spend`
    };
  });

  console.log("✅ Message works!");
  //console.log(convertedTasks);
  return convertedTasks;
}
// slack bot 
async function handle_slack(res, notifications){
const { WebClient } = require('@slack/web-api');


const token = process.env.SLACKBOT;
const web = new WebClient(token);
for (let i = 0; i < notifications.length; i++) {
        const conversationId = notifications[i]["Internal Slack Channel ID"]; // Access element by index
        if (!conversationId || !/^[CGD]/.test(conversationId)) {
      console.log("Skipping invalid channel:", conversationId);
      continue;
    }     

    //date check 
      const today = new Date();
      const dayOfWeek = today.getDay(); 
      if (notifications[i].dayIndex  != (dayOfWeek + 1) % 7){
        continue;
      }
       //biweekly check
       if (notifications[i]["Cadence"] == "Bi-Weekly"){
            if (notifications[i]["used"] == false){
                await Task.updateOne(
                     { "Internal Slack Channel ID":  notifications[i]["Internal Slack Channel ID"]},
                    { $set: { used: true } });

                continue;
            }
            else{
                await Task.updateOne(
                     { "Internal Slack Channel ID":  notifications[i]["Internal Slack Channel ID"]},
                    { $set: { used: false } });
            }

       }
            
       try {
                await web.conversations.join({ channel: conversationId });
                const result = await web.chat.postMessage({
                channel: conversationId,
                text: notifications[i].messaging
                });
                console.log(`Would send to ${conversationId}: ${notifications[i].Account}`);
                
                console.log(`Message sent successfully at ${result.ts}`);
            } catch (error) {
                console.error('Error posting message:', error);
            }
            
   
    }
}



module.exports = router;