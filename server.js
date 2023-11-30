const express = require("express");
const { handleDailies } = require('./src/services')

const app = express();

app.use("/tasks", require("./routes/tasks"));
app.use("/recur", require("./routes/recur"));

const port = process.env.PORT || 6000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

handleDailies();