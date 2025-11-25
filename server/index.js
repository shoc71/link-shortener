const express = require('express');
const cors = require('cors');
const connectDB  = require('./config/db');
const Link = require('./models/link.model');
const linkRoutes = require("./routes/link.route.js")
require('dotenv').config();

const app = express();
app.use(express.json({ limit: "10mb" }));
app.use(cors());

const PORT = process.env.PORT || 3001;

app.use("/api", linkRoutes);

app.get("/:short", async (req, res) => {
  try {
    const { short } = req.params;
    const link = await Link.findOne({ newLink: short });
    if (!link) return res.status(404).send("Short link not found");
    return res.redirect(link.originalLink);
  } catch (err) {
    res.status(500).send("Server error");
  }
});

app.listen(PORT, () => {
    connectDB();
    console.log(`Server Live: http://localhost:${PORT}`);
})