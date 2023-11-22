module.exports = function parseLeads(task) {
  const customFields = task.custom_fields

  const resultObject = {};
  
  for (const customField of customFields) {
    const fieldName = customField.name;
    const fieldValue = customField.value;

    // Check for specific field names and extract their values
    switch (fieldName) {
      case 'CRO MAIN POC':
        resultObject.croLead = fieldValue[0].id;
        break;
      case 'SEARCH MAIN POC':
        resultObject.srchLead = fieldValue[0].id;
        break;
      case 'SOCIAL MAIN POC':
        resultObject.soclLead = fieldValue[0].id;
        break;
      case 'CREATIVE MAIN POC':
        resultObject.ctvLead = fieldValue[0].id;
        break
      // Add more cases as needed
    }
  }
  return resultObject;
}