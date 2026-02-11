const express = require("express");
require("dotenv").config();

const app = express();

app.use(express.json());

app.use("/api", require("./routes/api.route"));
app.use("/payment", require("./routes/payment.route"));
app.use("/webhook", require("./routes/webhook.route"));

app.get("/", (req,res)=>{
   res.send("🔥 SN DESIGN SERVER ONLINE 🔥");
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
   console.log("Server running on port " + PORT);
});
