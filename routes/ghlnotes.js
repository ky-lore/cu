const { logSlack } = require("../src/controllers/slacklog");
const express = require('express');
const router = express.Router();
const axios = require("axios");
require("dotenv").config();

const TEAM_ID = process.env.TEAM_ID;
const TOKEN = process.env.CLICKUP_API_KEY;
const GHL_KEY = process.env.GHL_API_KEY;

// -----------------------------------------------------
// FIND SPACE BY CHANNEL
// -----------------------------------------------------
async function findSpaceIdByChannel(channel) {
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
                if (folder.name.includes(channel)) {
                    return space.id;
                }
            }
        }
    }

    return null;
}

// -----------------------------------------------------
// CREATE DOC + RETURN DOC ID
// -----------------------------------------------------
async function AddDocs(folder_id, text) {
    const response = await axios.post(
        `https://api.clickup.com/api/v3/workspaces/${TEAM_ID}/docs`,
        {
            name: "Notes Doc Forever",
            parent: { id: folder_id, type: 5 },
            create_page: false
        },
        { headers: { Authorization: TOKEN } }
    );

    const docId = response.data.id;

    // Create first page
    await axios.post(
        `https://api.clickup.com/api/v3/workspaces/${TEAM_ID}/docs/${docId}/pages`,
        {
            name: "Notes Page Forever",
            sub_title: "Notes",
            content: text,
            content_format: "text/plain"
        },
        { headers: { Authorization: TOKEN } }
    );

    return docId;
}

// -----------------------------------------------------
// FETCH UPDATED NOTES FROM GHL
// -----------------------------------------------------
async function fetchNotesFromGHL(contactId) {
    const res = await axios.get(
        `https://rest.gohighlevel.com/v1/contacts/${contactId}/notes`,
        { headers: { Authorization: GHL_KEY } }
    );

    return res.data.notes.map(n => n.body).join("\n\n");
}

// -----------------------------------------------------
// APPEND NOTES TO DOC (ONE-TIME UPDATE)
// -----------------------------------------------------
async function appendNoteToDoc(docId, text) {
    await axios.post(
        `https://api.clickup.com/api/v3/workspaces/${TEAM_ID}/docs/${docId}/pages`,
        {
            name: `Notes Update`,
            sub_title: "Updated Notes",
            content: text,
            content_format: "text/plain"
        },
        { headers: { Authorization: TOKEN } }
    );
}

// -----------------------------------------------------
// MAIN ROUTE — OLD ROUTE WITH ONE-TIME UPDATE
// -----------------------------------------------------
router.post("/", async (req, res) => {
    console.log("BODY RECEIVED FROM ZAPIER:", req.body);

    const channel = req.body.channel;
    const initialNotes = req.body.notes;
    const contactId = req.body.contactId; // MUST be sent from Zapier

    await logSlack(JSON.stringify(req.body, null, 2), 'C0AB218MM18');

    // WAIT 5 MINUTES
    setTimeout(async () => {
        try {
            console.log("Running delayed ClickUp logic...");

            // 1. Find space
            const SPACE_ID = await findSpaceIdByChannel(channel);

            // 2. Find folder
            const response = await axios.get(
                `https://api.clickup.com/api/v2/space/${SPACE_ID}/folder`,
                { headers: { Authorization: TOKEN } }
            );

            const folder = response.data.folders.find(f => f.name.includes(channel));
            if (!folder) return console.log("Folder not found");

            // 3. Create doc
            const docId = await AddDocs(folder.id, initialNotes);
            console.log("Doc created:", docId);

            // 4. Fetch updated notes from GHL (notes added during the 5 min delay)
            const updatedNotes = await fetchNotesFromGHL(contactId);

            // 5. Append updated notes ONCE
            await appendNoteToDoc(docId, updatedNotes);

            console.log("One-time post-delay update complete");

        } catch (err) {
            console.error("Error during delayed execution:", err);
        }
    }, 5 * 60 * 1000);

    res.sendStatus(200);
});

module.exports = router;