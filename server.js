const express = require("express");
const { handleDailies } = require("./src/services");
const { assignLsa } = require("./routes/_helpers/helpers");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use("/tasks", require("./routes/tasks"));
// app.use("/recur", require("./routes/recur"));
// app.use("/reschedule", require("./routes/reschedule"));
// app.use("/morning", require("./routes/morning"));
// app.use("/night", require("./routes/night"));
// app.use("/billing", require("./routes/billing"));
// app.use("/clickup", require("./routes/clickup"));
// app.use("/overdue", require("./routes/overdue"));
// app.use("/clients", require("./routes/clients"));
app.use("/health", require("./routes/health"));


const port = 8080;

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
