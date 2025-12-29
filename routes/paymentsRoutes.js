const express = require("express");
const router = express.Router();

const { getActiveFees, registerFee, payFee } = require("../controllers/paymentsController");

// 👇 IMPORTS CORRECTOS (porque exportás objetos)
const { authenticateToken } = require("../middlewares/authenticateToken");
const { authorizeRole } = require("../middlewares/authMiddleware");

// Alumno/Admin/Profesor ven cuotas (en tu controller, alumno usa id del token)
router.get(
  "/active-fees",
  authenticateToken,
  authorizeRole(["alumno", "admin", "profesor"]),
  getActiveFees
);

// Manual (admin / profesor)
router.post(
  "/register-fee",
  authenticateToken,
  authorizeRole(["admin", "profesor"]),
  registerFee
);

router.post(
  "/pay-fee",
  authenticateToken,
  authorizeRole(["admin", "profesor"]),
  payFee
);

module.exports = router;
