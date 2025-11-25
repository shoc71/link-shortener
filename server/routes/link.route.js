const express = require('express');
const { createLink, deleteLink, getAllLinks } = require('../controllers/link.controller');

const router = express.Router();

router.post("/add", createLink)
router.delete("/delete/:id", deleteLink)
router.get("/getAll", getAllLinks)

// UPDATE
router.put("/:id", (req, res) => {
    const link = links.find(l => l.id === Number(req.params.id));

    if (!link) {
        return res.status(404).json({ success: false, message: "Not found" });
    }

    link.name = req.body.name ?? link.name;
    link.url = req.body.url ?? link.url;

    res.json({
        success: true,
        data: link
    });
});

router.get("/:short", async (req, res) => {
  try {
    const short = req.params.short;

    const link = await Link.findOne({ newL: short });
    if (!link) return res.status(404).send("Short link not found");

    res.redirect(link.ogL);
  } catch (err) {
    res.status(500).send("Server error");
  }
});

module.exports = router;