const mongoose = require('mongoose');
const Link = require('../models/link.model');


exports.getAllLinks = async (req, res) => {
    try {
        const link = await Link.find().sort({ _id: -1 });
        return res.status(200).json({ success: true, data: link });
    } catch (error) {
        console.error("Server Error Create product: ", error.message);
        return res.status(500).json({ success: false, message: "Server Error Create product: ", error });
    }
}

exports.createLink = async (req, res) => {
    try {
        const { originalLink, newLink } = req.body

        if (!originalLink || !originalLink.trim()) {
            return res.status(400).json({ success: false, error: "Original URL is required" });
        }

        const link = await Link.create({
            originalLink,
            newLink
        })
        
        return res.status(201).json({ success: true, data: link });

    } catch (error) {
        if (e.code === 11000) {
            return res.status(400).json({ success: false, error: "This URL already exists" });
        }
        console.error("Server Error Create Link(s): ", error.message);
        return res.status(500).json({ success: false, message: "Server Error Create Link(s): ", error });
    }
}

exports.deleteLink = async (req, res) => {
    
    // const link = await Link.findById(req.params.id);

    // if (!link) {
    //     return res.status(404).json({ success: false, message: "Link(s) not found" });
    // }
    
    try {
        
        const deleted = await Link.findByIdAndDelete(req.params.id)

        if (!deleted) {
            return res.status(404).json({ success: false, error: "Link not found" });
        }

        return res.status(204).json({ success: true, data: deleted })

    } catch (error) {
        console.error("Server Error Delete Link(s): ", error.message);
        return res.status(500).json({ success: false, message: "Server Error Delete Link(s): ", error });
    }
}

// module.exports = {
//     createLink, 
//     deleteLink
// };