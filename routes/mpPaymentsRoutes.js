const express = require("express");
const router = express.Router();

const {
  createMpPreferenceByPlan,
  createMpPreference,
  mpWebhook,
} = require("../controllers/mpPaymentsController");

const { authenticateToken } = require("../middlewares/authenticateToken");
const { authorizeRole } = require("../middlewares/authMiddleware");

// Alumno elige plan y paga con MP
router.post(
  "/preference-by-plan",
  authenticateToken,
  authorizeRole(["alumno"]),
  createMpPreferenceByPlan
);

//  Alumno paga una cuota pendiente ya creada
router.post(
  "/preference",
  authenticateToken,
  authorizeRole(["alumno"]),
  createMpPreference
);

router.post("/webhook", mpWebhook);

module.exports = router;
