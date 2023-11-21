const express = require("express");

const app = express();

app.use("/tasks", require("./routes/tasks"));

const port = process.env.PORT || 6000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
