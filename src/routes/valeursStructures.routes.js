const express = require("express");

const router = express.Router();

const controller = require("../controllers/valeursStructures.controller");

const { authMiddleware } = require("../middlewares/auth.middleware");

router.get("/", authMiddleware, controller.getAll);

router.post("/", authMiddleware, controller.upsert);

module.exports = router;