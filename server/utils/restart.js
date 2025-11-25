// utils/reconnectMongo.js
const mongoose = require("mongoose");

async function reconnectMongo() {
  if (mongoose.connection.readyState !== 1) { // not connected
    try {
      await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log("MongoDB reconnected!");
    } catch (err) {
      console.error("MongoDB reconnection failed:", err.message);
    }
  }
}

module.exports = reconnectMongo;
