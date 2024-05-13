const axios = require("axios");
require("dotenv").config();
const stageIdMapping = require("../db/stageIdMappings");

async function ghlOpportunityHandler(task) {
	const taskName = task.name;
	const stage = task.status.status;

	const opportunity = await getOpportunityByName(taskName);
	const opportunityId = opportunity.opportunities?.[0]?.id;
	if (opportunityId) {
		const newStageId = stageIdMapping[stage];
		if (newStageId) {
			await updateOpportunityStage(opportunityId, newStageId);
		} else {
			console.log(`No stage id was found in stageIdMapping for: ${stage}`);
		}
	} else {
		console.log(`No opportunity found in ghl with name: ${taskName}`);
	}
}

async function getOpportunityByName(taskName) {
	const pipelineId = process.env.LIVE_ACCOUNTS_PIPELINE_ID;
	const bearerToken = process.env.GHL_API_KEY;
	const apiUrl = `https://rest.gohighlevel.com/v1/pipelines/${pipelineId}/opportunities?query=${taskName}`;

	try {
		const response = await axios.get(apiUrl, {
			headers: {
				Authorization: `Bearer ${bearerToken}`,
			},
		});

		return response.data;
	} catch (error) {
		console.error("Error:", error.message);
		throw error;
	}
}

async function updateOpportunityStage(opportunityId, newStageId) {
	const pipelineId = process.env.LIVE_ACCOUNTS_PIPELINE_ID;
	const apiUrl = `https://rest.gohighlevel.com/v1/pipelines/${pipelineId}/opportunities/${opportunityId}/status`;

	const bearerToken = process.env.GHL_API_KEY;

	try {
		const response = await axios.put(
			apiUrl,
			{ stageId: newStageId },
			{
				headers: {
					Authorization: `Bearer ${bearerToken}`,
					"Content-Type": "application/json",
				},
			}
		);

		return response.data;
	} catch (error) {
		console.error("Error:", error.message);
		throw error;
	}
}

module.exports = ghlOpportunityHandler;
