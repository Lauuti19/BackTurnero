// routes/deudasRoutes.js
const express = require("express");
const router = express.Router();

const {
  getAllDeudas,
  getDeudasUsuario,
  getResumenDeudasUsuario,
  getMisMovimientos,
} = require("../controllers/deudasController");

const { authenticateToken } = require("../middlewares/authenticateToken");

// 👇 primero las rutas "fijas"
router.get("/movimientos", authenticateToken, getMisMovimientos);
router.get("/all", authenticateToken, getAllDeudas);

// 👇 después las que tienen params
router.get("/:id_usuario/resumen", authenticateToken, getResumenDeudasUsuario);
router.get("/:id_usuario", authenticateToken, getDeudasUsuario);

module.exports = router;
