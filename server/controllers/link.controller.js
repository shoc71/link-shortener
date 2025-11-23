const mongoose = require('mongoose');
const Link = require('../models/link.model');

exports.getAllLinks = async (req, res) => {
    try {
        const link = await Link.find({});
        res.status(200).json({ success: true, data: { link } });
    } catch (error) {
        console.error("Server Error Create product: ", error.message);
        res.status(500).json({ success: false, message: "Server Error Create product: ", error });
    }
}

exports.createLink = async (req, res) => {
    try {
        const { originalLink, newLink } = req.body

        const link = await Link.create({
            originalLink,
            newLink
        })
        
        res.status(201).json({ success: true, data: link });

    } catch (error) {
        console.error("Server Error Create Link(s): ", error.message);
        res.status(500).json({ success: false, message: "Server Error Create Link(s): ", error });
    }
}

exports.deleteLink = async (req, res) => {
    
    const link = await Link.findById(req.params.id);

    if (!link) {
        return res.status(404).json({ success: false, message: "Link(s) not found" });
    }
    
    try {
        
        await Link.findByIdAndDelete(req.params.id)

        res.status(204).json({ success: true, message: 'Link successfully deleted'})

    } catch (error) {
        console.error("Server Error Delete Link(s): ", error.message);
        res.status(500).json({ success: false, message: "Server Error Delete Link(s): ", error });
    }
}

// module.exports = {
//     createLink, 
//     deleteLink
// };