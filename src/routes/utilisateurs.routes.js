const express = require("express");
const router = express.Router();
const c = require("../controllers/utilisateurs.controller");
const { authMiddleware, adminOnly } = require("../middlewares/auth.middleware");

router.get("/", authMiddleware, adminOnly, c.getAll);
router.post("/", authMiddleware, adminOnly, c.create);
router.put("/:id", authMiddleware, adminOnly, c.update);

module.exports = router;