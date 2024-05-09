const { datetime } = require('./src/utils')
const { usersDb, billingMapping } = require('./src/db')

function billingCheck() {
  const today = new Date().getDate();
  for (i in billingMapping) {
    if(today == billingMapping[i].billingDate) {
      console.log(billingMapping[i])
    }
  }
}

billingCheck()