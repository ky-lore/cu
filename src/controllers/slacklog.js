
// Function takes text and slack id, logs text into slack channel
async function logSlack(text, channelID) {
    const { WebClient } = require('@slack/web-api');

    const token = process.env.SLACKBOT;
    const web = new WebClient(token);

    await web.conversations.join({ channel: channelID });

    await web.chat.postMessage({
        channel: channelID,
        text: text
    });
}


module.exports = { logSlack };