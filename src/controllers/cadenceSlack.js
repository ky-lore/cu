const { Task } = require("../db/mongodbCadence");


async function handle_slack(res, notifications){
const { WebClient } = require('@slack/web-api');


const token = process.env.SLACKBOT;
const web = new WebClient(token);
 const pstString = new Date().toLocaleString("en-US", {
  timeZone: "America/Los_Angeles"
});


  const today = new Date(pstString);
  const dayOfWeek = today.getDay(); 
  //today.getDay(); 
  const testOutput = [];
for (let i = 0; i < notifications.length; i++) {
        const conversationId = notifications[i]["Internal Slack Channel ID"]; // Access element by index
        if (!conversationId || !/^[CGD]/.test(conversationId)) {
      console.log("Skipping invalid channel:", conversationId);
      continue;
    }     

    //date check 
     
      //console.log("Checking:", notifications[i].Account, 
            //"dayIndex:", notifications[i].dayIndex,
            //"tomorrowIndex:", (dayOfWeek + 1) % 7);
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
            console.log("Account:", notifications[i].Account, 
            "DayIndex:", notifications[i].dayIndex);
       try {
                await web.conversations.join({ channel: conversationId });
                const result = await web.chat.postMessage({
                channel: conversationId,
                text: notifications[i].messaging
                });


                //testOutput.push({
                //channel: conversationId,
                //account: notifications[i].Account,
                //message: notifications[i].messaging
              //});

                
                console.log(`Would send to ${conversationId}: ${notifications[i].Account}`);
                
                //console.log(`Message sent successfully at ${result.ts}`);
            } catch (error) {
                console.error('Error posting message:', error);
            }
            
   
    }
  //res.json(testOutput)
}
module.exports = { handle_slack };