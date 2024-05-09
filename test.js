const { datetime } = require('./src/utils')
const { usersDb, billingMapping } = require('./src/db')

function billingCheck() {
  for (account in billingMapping) {
    console.log(billingMapping[account].billingDate)
  }
}


console.log(billingCheck())