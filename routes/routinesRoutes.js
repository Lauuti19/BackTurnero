const express = require("express");
const router = express.Router();
const {
  createRoutineTemplateWithExercises,
  assignRoutineToUser,
  deactivateUserRoutine,
  getRoutinesByUser,
  getRoutineDetail,
  getAllRoutines,
  setRoutineActive,
  addExerciseToRoutine,
  removeExerciseFromRoutine,
  getRoutineExercises
} = require("../controllers/routinesController.js");
const { authenticateToken } = require("../middlewares/authenticateToken");
const { authorizeRole } = require("../middlewares/authMiddleware");

// crear plantilla de rutina (solo admin/profe)
router.post(
  "/create-template",
  authenticateToken,
  authorizeRole(["admin", "profesor"]),
  createRoutineTemplateWithExercises
);

// asignar rutina -> usuario (admin/profe)
router.post(
  "/assign",
  authenticateToken,
  authorizeRole(["admin", "profesor"]),
  assignRoutineToUser
);

// desactivar rutina para un usuario
router.post(
  "/deactivate-user",
  authenticateToken,
  authorizeRole(["admin", "profesor"]),
  deactivateUserRoutine
);

// obtener las rutinas del usuario logueado o de uno puntual
router.get("/user/:userId", authenticateToken, getRoutinesByUser);

router.get("/detail/:id_rutina", authenticateToken, getRoutineExercises);


// listar todas las rutinas (plantillas)
router.get("/", authenticateToken, getAllRoutines);

// detalle de una rutina
router.get("/:id", authenticateToken, getRoutineDetail);

// activar/desactivar rutina
router.put(
  "/:id/active",
  authenticateToken,
  authorizeRole(["admin", "profesor"]),
  setRoutineActive
);

// agregar ejercicio
router.post(
  "/:id/add-exercise",
  authenticateToken,
  authorizeRole(["admin", "profesor"]),
  addExerciseToRoutine
);

// quitar ejercicio
router.delete(
  "/:id/remove-exercise",
  authenticateToken,
  authorizeRole(["admin", "profesor"]),
  removeExerciseFromRoutine
);

module.exports = router;
