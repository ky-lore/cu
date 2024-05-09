const { datetime } = require('./src/utils')
const { usersDb, billingMapping } = require('./src/db')
const axios = require('axios')

function checkBillingStatus(billingMapping) {
  const today = new Date().getDate();
  const lastDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 0).getDate();

  for (const entry of billingMapping) {
    const billingDate = entry.billingDate;
    
    if (today === billingDate) {
      axios.post('https://hooks.zapier.com/hooks/catch/5506897/3jslvqi/', entry)
      .then(res => {
        console.log(res)
      })
      .catch(err => {
        console.error(err)
      })
    } else if (today === billingDate - 2 || (today === lastDayOfMonth && (billingDate === 1 || billingDate === 2))) {
      console.log(entry, '2days');
    }
  }
}



checkBillingStatus(billingMapping)