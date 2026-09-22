const express = require("express");
const router = express.Router();

const c = require("../controllers/valeurs.controller");
const { authMiddleware } = require("../middlewares/auth.middleware");

router.get("/stats", authMiddleware, c.getStats);
router.get("/", authMiddleware, c.getAll);
router.post("/", authMiddleware, c.upsert);

module.exports = router;