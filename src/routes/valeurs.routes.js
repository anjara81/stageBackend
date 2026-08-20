const express = require("express");
const router = express.Router();
const controller = require("../controllers/valeurs.controller");

router.get("/", controller.getAll);
router.post("/", controller.upsert);

module.exports = router;