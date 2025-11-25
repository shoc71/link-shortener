const mongoose = require('mongoose');

const linkSchema = new mongoose.Schema({
    originalLink: {
        type: String,
        required: [true, "Original URL is required"],
        unique: true,
    },
    newLink: {
        type: String,
        required: true,
        unique: true
    }
},{
    timestamps: true
});

const Link = mongoose.model("Link", linkSchema);

module.exports = Link;