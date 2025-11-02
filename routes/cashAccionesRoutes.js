// routes/cashAccionesRoutes.js
const express = require("express");
const router = express.Router();

const {
  // ACCIONES
  upsertAccionUsuario,
  desactivarAccionUsuario,
  getAccionesActivas,
  // DISTRIBUCIÓN
  getDistribucionGananciasByCaja,
  // CAJAS
  getAllCajasMensuales,
  getCajasMensuales,
} = require("../controllers/cashAccionesController");

const { authenticateToken } = require("../middlewares/authenticateToken");
const { authorizeRole } = require("../middlewares/authMiddleware");

// ---------- ACCIONES ----------
router.get(
  "/activas",
  authenticateToken,
  authorizeRole(["admin"]),
  getAccionesActivas
);

router.post(
  "/upsert",
  authenticateToken,
  authorizeRole(["admin"]),
  upsertAccionUsuario
);

router.post(
  "/desactivar",
  authenticateToken,
  authorizeRole(["admin"]),
  desactivarAccionUsuario
);

// ---------- DISTRIBUCIÓN ----------
router.get(
  "/distribucion/by-caja",
  authenticateToken,
  authorizeRole(["admin"]),
  getDistribucionGananciasByCaja
);

// ---------- CAJAS MENSUALES ----------
router.get(
  "/cajas/todas",
  authenticateToken,
  authorizeRole(["admin"]),
  getAllCajasMensuales
);

router.get(
  "/cajas",
  authenticateToken,
  authorizeRole(["admin"]),
  getCajasMensuales
);

module.exports = router;
