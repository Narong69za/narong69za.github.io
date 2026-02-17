const express = require("express");

const app = express();
app.use(express.static(__dirname + "/.."));
app.get("/", (req, res) => {
  res.send("🔥 SN DESIGN SERVER ONLINE 🔥");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
