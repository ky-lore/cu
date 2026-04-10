const { logSlack } = require("../src/controllers/slacklog");
const express = require('express');
const router = express.Router();
const axios = require("axios");
require("dotenv").config();

const TEAM_ID = process.env.TEAM_ID;
const TOKEN = process.env.CLICKUP_API_KEY;

// ─── Helpers ────────────────────────────────────────────────────────────────

async function findSpaceIdByChannel(hardcoded) {
    const teamsRes = await axios.get(
        "https://api.clickup.com/api/v2/team",
        { headers: { Authorization: TOKEN } }
    );

    for (const team of teamsRes.data.teams) {
        const spacesRes = await axios.get(
            `https://api.clickup.com/api/v2/team/${team.id}/space`,
            { headers: { Authorization: TOKEN } }
        );

        for (const space of spacesRes.data.spaces) {
            const foldersRes = await axios.get(
                `https://api.clickup.com/api/v2/space/${space.id}/folder`,
                { headers: { Authorization: TOKEN } }
            );

            for (const folder of foldersRes.data.folders) {
                if (folder.name.includes(hardcoded)) {
                    return space.id;
                }
            }
        }
    }

    return null;
}


// Creates the doc + first page, returns { docId, pageId } for later updates
async function AddDocs(folder_id, text) {
    const docRes = await axios.post(
        `https://api.clickup.com/api/v3/workspaces/${TEAM_ID}/docs`,
        {
            name: "Notes Doc Forever",
            parent: { id: folder_id, type: 5 },
            create_page: false
        },
        { headers: { Authorization: TOKEN } }
    );

    const docId = docRes.data.id;
    console.log("TEXT TO WRITE:", text);

    const pageRes = await axios.post(
        `https://api.clickup.com/api/v3/workspaces/${TEAM_ID}/docs/${docId}/pages`,
        {
            name: "Notes Page Forever",
            sub_title: "Notes",
            content: text,
            content_format: "text/plain"
        },
        { headers: { Authorization: TOKEN } }
    );

    return { docId, pageId: pageRes.data.id };
}


// Fetches the existing page, appends new notes, and updates it in place
async function updateDocPage(docId, pageId, newNotes) {
    // 1. Fetch current page content
    const pageRes = await axios.get(
        `https://api.clickup.com/api/v3/workspaces/${TEAM_ID}/docs/${docId}/pages/${pageId}`,
        { headers: { Authorization: TOKEN } }
    );

    const existingContent = pageRes.data.content || "";
    const timestamp = new Date().toISOString();
    const appendedContent = `${existingContent}\n\n--- Update (${timestamp}) ---\n${newNotes}`;

    // 2. PUT the updated content back
    await axios.put(
        `https://api.clickup.com/api/v3/workspaces/${TEAM_ID}/docs/${docId}/pages/${pageId}`,
        {
            content: appendedContent,
            content_format: "text/plain"
        },
        { headers: { Authorization: TOKEN } }
    );

    console.log("ClickUp doc page updated with new notes.");
}

// ─── Route ──────────────────────────────────────────────────────────────────

// Holds pending updates keyed by channel, populated by Zapier's follow-up POST
const pendingUpdates = {};

router.post("/", async (req, res) => {
    console.log("BODY RECEIVED FROM ZAPIER:", req.body);

    const hardcoded = req.body.channel;
    const text = req.body.notes;
    console.log("NOTES FROM ZAPIER:", text);

    await logSlack(JSON.stringify(req.body, null, 2), 'C0AB218MM18');

    // If this is a follow-up update from Zapier for an already-tracked channel,
    // store the new notes and let the scheduled check pick them up
    if (pendingUpdates[hardcoded]?.docCreated) {
        console.log(`Follow-up notes received for channel: ${hardcoded}`);
        pendingUpdates[hardcoded].latestNotes = text;
        return res.sendStatus(200);
    }

    // First-time hit: initialize tracking for this channel
    pendingUpdates[hardcoded] = { docCreated: false, latestNotes: null, docId: null, pageId: null };

    res.sendStatus(200); // Respond to Zapier immediately

    // ── Step 1: Create the doc after 5 minutes ──
    setTimeout(async () => {
        try {
            console.log("Running initial ClickUp doc creation...");

            const SPACE_ID = await findSpaceIdByChannel(hardcoded);
            const foldersRes = await axios.get(
                `https://api.clickup.com/api/v2/space/${SPACE_ID}/folder`,
                { headers: { Authorization: TOKEN } }
            );

            for (const folder of foldersRes.data.folders) {
                if (folder.name.includes(hardcoded)) {
                    const { docId, pageId } = await AddDocs(folder.id, text);
                    console.log("ClickUp doc created successfully.");

                    // Mark as created and store IDs for the update check
                    pendingUpdates[hardcoded].docCreated = true;
                    pendingUpdates[hardcoded].docId = docId;
                    pendingUpdates[hardcoded].pageId = pageId;
                }
            }
        } catch (err) {
            console.error("Error during doc creation:", err);
        }
    }, 5 * 60 * 1000); // 5 minutes

    // ── Step 2: Check for new notes 5 minutes after doc creation (10 min total) ──
    setTimeout(async () => {
        try {
            const state = pendingUpdates[hardcoded];

            if (!state?.docCreated) {
                console.log(`Doc not yet created for channel ${hardcoded}, skipping update check.`);
                return;
            }

            if (!state.latestNotes) {
                console.log(`No new notes received for channel ${hardcoded} since doc creation.`);
            } else {
                console.log(`Appending new notes to doc for channel ${hardcoded}...`);
                await updateDocPage(state.docId, state.pageId, state.latestNotes);
            }

        } catch (err) {
            console.error("Error during doc update check:", err);
        } finally {
            // Clean up memory once we're done with this channel
            delete pendingUpdates[hardcoded];
        }
    }, 10 * 60 * 1000); // 10 minutes (5 min after doc creation)
});
//
module.exports = router;