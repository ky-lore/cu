/**
 * 
 * @param {object} task Parses task object sent in from each handler function
 * @returns {object} Parsed object with keys of '___ MAIN POC' with values = assignee IDs for the respective field
 */
module.exports = function parseLeads(task) {
  const resultObject = {};
  
  const customFields = task.custom_fields
  
  customFields.forEach(customField => {
    const name = customField.name;
    const value = customField.value;
  
    switch (name) {
      case 'CRO MAIN POC':
        resultObject.croLead = value[0].id;
        break;
      case 'SEARCH MAIN POC':
        resultObject.srchLead = value[0].id;
        break;
      case 'SOCIAL MAIN POC':
        resultObject.soclLead = value[0].id;
        break;
    }
  });
  
  
  return resultObject;
}