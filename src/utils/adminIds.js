require('dotenv').config()

module.exports = process.env.ADMIN_IDS.split('_').map(id => {
  return parseInt(id)
})