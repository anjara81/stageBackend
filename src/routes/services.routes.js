const express = require("express");
const router = express.Router();
const c = require("../controllers/services.controller");
const { authMiddleware, adminOnly } = require("../middlewares/auth.middleware");

router.get("/", c.getAll);
router.post("/", authMiddleware, adminOnly, c.create);

module.exports = router;