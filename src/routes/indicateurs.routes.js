const express = require("express");
const router = express.Router();
const c = require("../controllers/indicateurs.controller");
const { authMiddleware, adminOnly } = require("../middlewares/auth.middleware");

router.get("/", c.getAll);
router.get("/:id", c.getOne);
router.post("/", authMiddleware, adminOnly, c.create);
router.put("/:id", authMiddleware, adminOnly, c.update);
router.delete("/:id", authMiddleware, adminOnly, c.remove);

module.exports = router;