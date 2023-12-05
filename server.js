const express = require("express");
const { handleDailies } = require('./src/services')

const app = express();

app.use("/tasks", require("./routes/tasks"));
app.use("/recur", require("./routes/recur"));
app.use("/reschedule", require("./routes/reschedule"));

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

handleDailies();