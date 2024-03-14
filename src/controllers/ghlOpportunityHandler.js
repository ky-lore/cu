const axios = require("axios");
require("dotenv").config();
const { stageIdMapping } = {
	onboarding: "7aceedaa-538c-4e37-ae6f-6dcf77d7848d",
	strategizing: "3b5b86b0-a685-4c62-9bbd-be4c66b3e449",
	development: "7699df27-cabb-4837-97d0-bf6b95b9817a",
	live: "1bb6729c-8fc0-47d8-aa8b-544d8aa6b85e",
	optimizations: "5c2ce962-d409-44be-a564-79e8f5bad21f",
	paused: "dd7651fb-2a73-4ea4-9a19-142e9d5fe2c6",
};

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
