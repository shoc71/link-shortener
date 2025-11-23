const mongoose = require('mongoose');

const linkSchema = new mongoose.Schema({
    originalLink: {
        type: String,
        unique: true
    },
    newLink: {
        type: String,
        unique: true
    }
},{
    timestamps: true
});

const Link = mongoose.model("Link", linkSchema);

module.exports = Link;