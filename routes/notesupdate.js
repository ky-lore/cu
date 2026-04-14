const express = require("express");
const router = express.Router();
const axios = require("axios");

require("dotenv").config();

const TOKEN = process.env.CLICKUP_API_KEY;
const TEAM_ID = process.env.TEAM_ID;

// ─────────────────────────────────────────────────────────────
// Helper: Append notes to an existing ClickUp doc page
// ─────────────────────────────────────────────────────────────
async function appendToDoc(docId, pageId, note) {
    const pageRes = await axios.get(
        `https://api.clickup.com/api/v3/workspaces/${TEAM_ID}/docs/${docId}/pages/${pageId}`,
        { headers: { Authorization: TOKEN } }
    );

    const existing = pageRes.data.content || "";
    const timestamp = new Date().toISOString();

    const updated = `${existing}\n\n--- Update (${timestamp}) ---\n${note}`;

    await axios.put(
        `https://api.clickup.com/api/v3/workspaces/${TEAM_ID}/docs/${docId}/pages/${pageId}`,
        {
            content: updated,
            content_format: "text/md"
        },
        { headers: { Authorization: TOKEN } }
    );
}

// ─────────────────────────────────────────────────────────────
// Helper: Find folder by SlackID (folder name contains SlackID)
// ─────────────────────────────────────────────────────────────
async function findFolderBySlackID(slackId) {
    const spacesRes = await axios.get(
        `https://api.clickup.com/api/v2/team/${TEAM_ID}/space`,
        { headers: { Authorization: TOKEN } }
    );

    for (const space of spacesRes.data.spaces) {
        const foldersRes = await axios.get(
            `https://api.clickup.com/api/v2/space/${space.id}/folder`,
            { headers: { Authorization: TOKEN } }
        );

        for (const folder of foldersRes.data.folders) {
            if (folder.name.toLowerCase().includes(slackId.toLowerCase())) {
                console.log("Folder found:", folder.name);
                return folder;
            }
        }
    }

    return null;
}

// ─────────────────────────────────────────────────────────────
// Helper: Find the doc named "Notes Doc Forever"
// Uses correct parent_type strings
// ─────────────────────────────────────────────────────────────
async function findNotesDoc(folder) {
    const attempts = [
        { parent_id: folder.id,       parent_type: "FOLDER" },
        { parent_id: folder.space.id, parent_type: "SPACE" },
        { parent_id: TEAM_ID,         parent_type: "WORKSPACE" },
        { parent_id: TEAM_ID,         parent_type: "EVERYTHING" }
    ];

    // Add LISTS inside the folder
    const listsRes = await axios.get(
        `https://api.clickup.com/api/v2/folder/${folder.id}/list`,
        { headers: { Authorization: TOKEN } }
    );

    for (const list of listsRes.data.lists) {
        attempts.push({ parent_id: list.id, parent_type: "LIST" });
    }

    // Try all parent locations
    for (const params of attempts) {
        console.log("Searching docs with:", params);

        const docsRes = await axios.get(
            `https://api.clickup.com/api/v3/workspaces/${TEAM_ID}/docs`,
            { headers: { Authorization: TOKEN }, params }
        );

        console.log("Docs result:", docsRes.data);

        const docs = docsRes.data.docs || [];
        const match = docs.find(
            d => d.name.trim().toLowerCase() === "notes doc forever"
        );

        if (match) {
            console.log("FOUND DOC:", match.id);
            return match;
        }
    }

    return null;
}

// ─────────────────────────────────────────────────────────────
// Helper: Find or create page named "Notes Page Forever"
// ─────────────────────────────────────────────────────────────
async function getOrCreateNotesPage(docId) {
    const pagesRes = await axios.get(
        `https://api.clickup.com/api/v3/workspaces/${TEAM_ID}/docs/${docId}/pages`,
        { headers: { Authorization: TOKEN } }
    );

    if (pagesRes.data.pages && pagesRes.data.pages.length > 0) {
        const page = pagesRes.data.pages.find(
            p => p.name.trim().toLowerCase() === "notes page forever"
        );

        if (page) return page;
    }

    // Create page if missing
    const newPageRes = await axios.post(
        `https://api.clickup.com/api/v3/workspaces/${TEAM_ID}/docs/${docId}/pages`,
        {
            name: "Notes Page Forever",
            content: "",
            content_format: "text/md"
        },
        { headers: { Authorization: TOKEN } }
    );

    return newPageRes.data;
}

// ─────────────────────────────────────────────────────────────
// MAIN ROUTE: Update ClickUp doc when GHL sends a note
// ─────────────────────────────────────────────────────────────
router.post("/", async (req, res) => {
    try {
        console.log("FOREVER NOTES HIT:", req.body);

        const slackId =
            req.body.SlackID ||
            req.body.slack_id ||
            req.body.contact?.SlackID ||
            req.body.customData?.slack ||
            null;

        const note =
            req.body.note?.body ||
            req.body.customData?.note_description ||
            req.body.note ||
            req.body.body ||
            req.body.notes ||
            null;

        if (!slackId) return res.status(400).send("Missing SlackID");
        if (!note) return res.status(400).send("Missing note text");

        // 1. Find folder
        const folder = await findFolderBySlackID(slackId);
        if (!folder) return res.status(404).send("Folder not found");

        // 2. Find doc
        const doc = await findNotesDoc(folder);
        if (!doc) return res.status(404).send("Notes Doc Forever not found");

        // 3. Get or create page
        const page = await getOrCreateNotesPage(doc.id);

        // 4. Append note
        await appendToDoc(doc.id, page.id, note);

        res.sendStatus(200);

    } catch (err) {
        console.error("Error updating ClickUp doc:", err.response?.data || err.message);
        res.sendStatus(500);
    }
});

module.exports = router;