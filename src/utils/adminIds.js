require('dotenv').config()

/**
 * @returns {array} Array of numbers - the admin IDs defined in environment variables split by '_'
 */
module.exports = process.env.ADMIN_IDS.split('_').map(id => {
  return parseInt(id)
})