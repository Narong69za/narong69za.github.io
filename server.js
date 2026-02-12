require("dotenv").config();

const express = require("express");
const path = require("path");

const app = express();

const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// static
app.use(express.static(path.join(__dirname)));

// routes
app.use("/api", require("./api.route"));
app.use("/payment", require("./payment.route"));
app.use("/webhook", require("./webhook.route"));

// start
app.listen(PORT, () => {
  console.log("SERVER RUNNING:", PORT);
});
