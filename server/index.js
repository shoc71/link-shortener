const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const connectDB  = require('./config/db');
const Link = require('./models/link.model');
const linkRoutes = require("./routes/link.route.js")
require('dotenv').config();

const app = express();
app.use(express.json({ limit: "10mb" }));
app.use(cors());

const PORT = process.env.PORT || 3001;

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.log("MongoDB connection error:", err));

// ------------------------------
// Heartbeat route
// ------------------------------
app.get("/heartbeat", async (req, res) => {
  const state = mongoose.connection.readyState;
  /**
   * 0 = disconnected
   * 1 = connected
   * 2 = connecting
   * 3 = disconnecting
   */
  if (state === 1) {
    return res.json({ alive: true, message: "MongoDB is connected" });
  } else {
    return res.status(503).json({ alive: false, message: "MongoDB is not connected. Attempting Reconnection..." });
  }
});

// optional endpoint to trigger manual reconnect
app.get("/api/reconnectMongo", async (req, res) => {
  await reconnectMongo();
  res.json({ success: mongoose.connection.readyState === 1 });
});

// ------------------------------
// API routes
// ------------------------------
app.use("/api", linkRoutes);

// ------------------------------
// Catch-all redirect route
// Must be last
// ------------------------------

const path = require("path");

app.use(express.static(path.join(__dirname, "../client/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});


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