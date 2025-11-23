const express = require('express');
const cors = require('cors');
const connectDB  = require('./config/db');
const { createLink, deleteLink, getAllLinks } = require('./controllers/link.controller');
require('dotenv').config();

const app = express();
app.use(express.json({ limit: "10mb" }));
app.use(cors());

const PORT = process.env.PORT || 3001;

app.use("/api/add", createLink)
app.use("/api/delete/:id", deleteLink)
app.use("/api/getAll", getAllLinks)

app.listen(PORT, () => {
    connectDB();
    console.log(`Server Live: http://localhost:${PORT}`);
})