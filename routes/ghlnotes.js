// The following file is integrated with zapier, its purpose is that when a client is listed sold on gohighlevel
// The notes information from that gohighlevel is transported to the clickup folder, this id done via zapier 
// The zapier creates the clickup account, this program is run after the zapier creates the clickup, it gets notes from zapier and 
// creates a doc file in that clickup folder



//Boilerplate setup
const express = require('express')
const router = express.Router();
const axios = require("axios");
require("dotenv").config();
const SPACE_ID = '90144439498'
// noramlly SPACE_ID it would be process.env.SPACE_ID which allows folder accounts 2.0 on clickup but in this case we do a seperate because we search on a differ account set;
const TEAM_ID = process.env.TEAM_ID
const TOKEN = process.env.CLICKUP_API_KEY;
//Boilerplate setup





// The function takes a folder_id and text, and populates a document with the text on that clickup channel specified by the id


async function AddDocs(folder_id, text){ 
        // Request that creates the document file, uses id property to get the file
        const response = await axios.post(`https://api.clickup.com/api/v3/workspaces/${TEAM_ID}/docs`, {
            name: "Notes Doc Forever",  
            parent: {
            id: folder_id,
            type: 5
        },    
        create_page: false 
        },
        { headers: { Authorization: TOKEN } })
        console.log("TEXT TO WRITE:", text);
        
        // Now that doc has been made, we can, use the responses data to directly go the doc file and add pages with the text
        const page = await axios.post(`https://api.clickup.com/api/v3/workspaces/${TEAM_ID}/docs/${response.data.id}/pages`, {
            //parent_page_id: response.data.id,
            name: "Notes Page Forever",  
            sub_title: 'Notes',
            content: text,    
            content_format: 'text/plain'
        },

        { headers: { Authorization: TOKEN } })  
    }






router.post("/", async(req, res)=>{
    // Check to make sure zapier info is recieved
    console.log("BODY RECEIVED FROM ZAPIER:", req.body);
    const hardcoded = req.body.channel;
    const text =  req.body.notes
    console.log("BODY RECEIVED FROM ZAPIER:", req.body.notes);  
    
     
    // This api searches the account space for the right folder and then calls Adddocs() to populate it 
     setTimeout(async () => {
        try {
            console.log("Running delayed ClickUp logic...");

            const response = await axios.get(
                `https://api.clickup.com/api/v2/space/${SPACE_ID}/folder`,
                { headers: { Authorization: TOKEN } }
            );

            for (const folder of response.data.folders) {
                if (folder.name.includes(hardcoded)) {
                    await AddDocs(folder.id, text);
                    console.log("ClickUp doc created successfully");
                }
            }
        } catch (err) {
            console.error("Error during delayed execution:", err);
        }
    }, 5 * 60 * 1000); // 5 minutes
});



module.exports = router;

