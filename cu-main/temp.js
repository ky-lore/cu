const startOfDay = new Date();
startOfDay.setHours(0, 0, 0, 0);
const timestamp = startOfDay.getTime();
console.log(timestamp)