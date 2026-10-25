const express = require("express");
const router = express.Router();
const ventasController = require("../controllers/ventas.controller");

router.get("/", ventasController.getAll);
router.get("/:id", ventasController.getById);
router.post("/", ventasController.create);

module.exports = router;
