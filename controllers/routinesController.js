const sequelize = require("../config/database");

// 1) Crear rutina plantilla + ejercicios
// POST /api/routines/create-template
const createRoutineTemplateWithExercises = async (req, res) => {
  const { routineName, exercises } = req.body;

  if (!routineName || !Array.isArray(exercises) || exercises.length === 0) {
    return res.status(400).json({ error: "Missing or invalid input data." });
  }

  // mismo formato que usabas: id_ejercicio,dia,orden,rondas,reps;...
  const exercisesString = exercises
    .map((e) => {
      return `${e.id_ejercicio},${e.dia},${e.orden},${e.rondas ?? ""},${e.repeticiones ?? ""}`;
    })
    .join(";");

  try {
    const [result] = await sequelize.query(
      "CALL CreateRoutineWithExercises(:routineName, :exercises)",
      {
        replacements: {
          routineName,
          exercises: exercisesString,
        },
      }
    );

    // el SP devuelve SELECT v_id_rutina AS id_rutina;
    res.status(201).json({
      message: "Routine template created successfully.",
      routine: result, // { id_rutina: ... }
    });
  } catch (error) {
    console.error("Error creating routine template:", error);
    res
      .status(500)
      .json({ error: error.original?.sqlMessage || "Internal server error" });
  }
};

// 2) Asignar rutina a usuario
// POST /api/routines/assign
const assignRoutineToUser = async (req, res) => {
  const { id_rutina, id_usuario, unica_activa = 1 } = req.body;

  if (!id_rutina || !id_usuario) {
    return res.status(400).json({ error: "id_rutina and id_usuario are required." });
  }

  try {
    await sequelize.query(
      "CALL AssignRoutineToUser(:id_rutina, :id_usuario, :unica_activa)",
      {
        replacements: {
          id_rutina,
          id_usuario,
          unica_activa,
        },
      }
    );

    res.status(200).json({ message: "Routine assigned to user successfully." });
  } catch (error) {
    console.error("Error assigning routine to user:", error);
    res
      .status(500)
      .json({ error: error.original?.sqlMessage || "Internal server error" });
  }
};

// 3) Desactivar rutina de un usuario (no la borra)
// POST /api/routines/deactivate-user
const deactivateUserRoutine = async (req, res) => {
  const { id_rutina, id_usuario } = req.body;

  if (!id_rutina || !id_usuario) {
    return res.status(400).json({ error: "id_rutina and id_usuario are required." });
  }

  try {
    await sequelize.query(
      "CALL DeactivateUserRoutine(:id_rutina, :id_usuario)",
      {
        replacements: {
          id_rutina,
          id_usuario,
        },
      }
    );

    res.status(200).json({ message: "User routine deactivated successfully." });
  } catch (error) {
    console.error("Error deactivating user routine:", error);
    res
      .status(500)
      .json({ error: error.original?.sqlMessage || "Internal server error" });
  }
};

// 4) Obtener las rutinas activas de un usuario
// GET /api/routines/user/:userId
const getRoutinesByUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const results = await sequelize.query("CALL GetRoutinesByUser(:userId)", {
      replacements: { userId },
    });
    res.status(200).json(results);
  } catch (error) {
    console.error("Error getting routines by user:", error);
    res
      .status(500)
      .json({ error: error.original?.sqlMessage || "Internal server error" });
  }
};

// 5) Obtener detalle completo de una rutina (cabecera + ejercicios)
// GET /api/routines/:id
const getRoutineDetail = async (req, res) => {
  const { id } = req.params;

  try {
    // el SP devuelve 2 resultsets
    const results = await sequelize.query("CALL GetRoutineDetail(:id_rutina)", {
      replacements: { id_rutina: id },
      multipleStatements: true,
    });

    // según la config de tu Sequelize puede devolverte un array raro;
    // lo devolvemos raw para que el front lo proces
    res.status(200).json(results);
  } catch (error) {
    console.error("Error getting routine detail:", error);
    res
      .status(500)
      .json({ error: error.original?.sqlMessage || "Internal server error" });
  }
};

// 6) Listar todas las rutinas plantilla
// GET /api/routines
const getAllRoutines = async (req, res) => {
  try {
    const results = await sequelize.query("CALL GetAllRoutines()");
    res.status(200).json(results);
  } catch (error) {
    console.error("Error getting all routines:", error);
    res
      .status(500)
      .json({ error: error.original?.sqlMessage || "Internal server error" });
  }
};

// 7) Activar / desactivar rutina
// PUT /api/routines/:id/active
const setRoutineActive = async (req, res) => {
  const { id } = req.params;
  const { activa } = req.body;

  if (typeof activa === "undefined") {
    return res.status(400).json({ error: "Field 'activa' is required." });
  }

  try {
    await sequelize.query("CALL SetRoutineActive(:id_rutina, :activa)", {
      replacements: {
        id_rutina: id,
        activa,
      },
    });

    res.status(200).json({ message: "Routine status updated successfully." });
  } catch (error) {
    console.error("Error setting routine active:", error);
    res
      .status(500)
      .json({ error: error.original?.sqlMessage || "Internal server error" });
  }
};

// 8) Agregar un ejercicio a una rutina ya creada
// POST /api/routines/:id/add-exercise
const addExerciseToRoutine = async (req, res) => {
  const { id } = req.params;
  const { id_ejercicio, dia, orden, rondas, repeticiones } = req.body;

  if (!id_ejercicio || !dia || !orden) {
    return res
      .status(400)
      .json({ error: "id_ejercicio, dia and orden are required." });
  }

  try {
    await sequelize.query(
      "CALL AddExerciseToRoutine(:id_rutina, :id_ejercicio, :dia, :orden, :rondas, :repeticiones)",
      {
        replacements: {
          id_rutina: id,
          id_ejercicio,
          dia,
          orden,
          rondas: rondas ?? null,
          repeticiones: repeticiones ?? null,
        },
      }
    );

    res.status(201).json({ message: "Exercise added to routine." });
  } catch (error) {
    console.error("Error adding exercise to routine:", error);
    res
      .status(500)
      .json({ error: error.original?.sqlMessage || "Internal server error" });
  }
};

// 9) Quitar un ejercicio de una rutina
// DELETE /api/routines/:id/remove-exercise
const removeExerciseFromRoutine = async (req, res) => {
  const { id } = req.params;
  const { id_ejercicio, dia, orden } = req.body;

  if (!id_ejercicio || !dia || !orden) {
    return res
      .status(400)
      .json({ error: "id_ejercicio, dia and orden are required." });
  }

  try {
    await sequelize.query(
      "CALL RemoveExerciseFromRoutine(:id_rutina, :id_ejercicio, :dia, :orden)",
      {
        replacements: {
          id_rutina: id,
          id_ejercicio,
          dia,
          orden,
        },
      }
    );

    res.status(200).json({ message: "Exercise removed from routine." });
  } catch (error) {
    console.error("Error removing exercise from routine:", error);
    res
      .status(500)
      .json({ error: error.original?.sqlMessage || "Internal server error" });
  }
};

module.exports = {
  createRoutineTemplateWithExercises,
  assignRoutineToUser,
  deactivateUserRoutine,
  getRoutinesByUser,
  getRoutineDetail,
  getAllRoutines,
  setRoutineActive,
  addExerciseToRoutine,
  removeExerciseFromRoutine,
};
