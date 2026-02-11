const express = require("express");

const app = express();

// IMPORTANT — trust proxy (Railway edge)
app.set("trust proxy", true);

app.get("/", (req, res) => {
  res.status(200).send("🔥 SN DESIGN SERVER ONLINE 🔥");
});

app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

const PORT = process.env.PORT;

app.listen(PORT, "0.0.0.0", () => {
  console.log("Server running on port " + PORT);
});
