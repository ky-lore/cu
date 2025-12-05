/**
 * 
 * @param {object} task Task object passed in by handlers
 * @returns {array} Array of tag names
 */
module.exports = function (task) {
  return task.map(obj => {
    return obj.name
  })
}