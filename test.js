// const { datetime } = require('./src/utils')
// const { usersDb, billingMapping } = require('./src/db')
const axios = require('axios')

// function checkBillingStatus(billingMapping) {
//   const today = new Date().getDate();
//   const lastDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 0).getDate();

//   for (const entry of billingMapping) {
//     const billingDate = entry.billingDate;

//     if (today === billingDate - 2 || (today === lastDayOfMonth && (billingDate === 1 || billingDate === 2))) {
//       axios.post('https://hooks.zapier.com/hooks/catch/5506897/3jslvqi/', entry)
//       .then(res => {
//         console.log(res)
//       })
//       .catch(err => {
//         console.error(err)
//       })
//     }
//   }
// }



// checkBillingStatus(billingMapping)

const header = require("./routes/_resources/header");

/**
 *
 * @param {*} taskArray array of initialized tasks from taskHandler.js
 * @param {*} listId needed to push to corresponding CU board
 */
function testCall(listId) {

    axios.get(`https://api.clickup.com/api/v2/list/${listId}/task?statuses[]=preparation`, header)
    .then(res => {
      res.data.tasks.forEach(task => {
        console.log(task.status)
      })
    })
    .catch(err => {
      console.error(err)
    })

  ;
}

testCall('900901670366')