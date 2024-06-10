const express = require("express");
const { handleDailies } = require("./src/services");
const { assignLsa } = require("./routes/_helpers/helpers");

const app = express();

app.use("/tasks", require("./routes/tasks"));
app.use("/recur", require("./routes/recur"));
app.use("/reschedule", require("./routes/reschedule"));
app.use("/morning", require("./routes/morning"));
app.use("/night", require("./routes/night"));
app.use("/billing", require("./routes/billing"));

const port = process.env.PORT;

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
