// controllers/classesController.js
const sequelize = require("../config/database");

const dbg = (...args) => {
  if (process.env.NODE_ENV !== "production") console.log("[classes]", ...args);
};


const getAllClasses = async (req, res) => {
  const { fecha } = req.query;

  // Validación mínima de fecha (YYYY-MM-DD)
  if (!fecha || !/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
    return res.status(400).json({ error: 'Falta parámetro: fecha (YYYY-MM-DD)' });
  }

  try {
    // Llamada al SP
    const rows = await sequelize.query('CALL GetAllClasses(:fecha)', {
      replacements: { fecha },
    });

    // Sequelize con CALL suele devolver un array ya “plano”
    const list = Array.isArray(rows) ? rows : rows?.[0] || [];

    // Normalizo salida para el front (tipos + nombres consistentes)
    const data = list.map((c) => ({
      id_clase: Number(c.id_clase),
      disciplina: c.disciplina ?? null,
      dia: c.dia ?? null,
      hora: c.hora ? String(c.hora).substring(0, 5) : null, // HH:mm
      tipo: c.tipo === 'especial' ? 'especial' : 'normal',
      is_especial: c.is_especial === 1 || c.is_especial === true, // -> boolean
      total: Number(c.total ?? c.capacidad_max ?? 0),
      disponibles: Number(c.disponibles ?? 0),
      descripcion: c.descripcion ?? null,
    }));

    return res.status(200).json(data);
  } catch (error) {
    dbg('getAllClasses error:', error);
    return res.status(500).json({
      error: error?.original?.sqlMessage || error?.message || 'Error interno del servidor',
    });
  }
};

const getClassesByUser = async (req, res) => {
  const { userId, fecha } = req.query;
  if (!userId || !fecha) {
    return res
      .status(400)
      .json({ error: "Faltan parámetros: userId y fecha son obligatorios." });
  }

  try {
    const results = await sequelize.query("CALL GetClassesByUser(:userId, :fecha)", {
      replacements: { userId, fecha },
    });

    return res.status(200).json(results);
  } catch (error) {
    console.error("Error fetching classes by user plan:", error);

    // 👇 acá intentamos sacar el mensaje real del motor
    const sqlMsg =
      error?.original?.sqlMessage ||
      error?.original?.message ||
      error?.message;

    return res.status(500).json({
      error: sqlMsg || "Error interno del servidor",
    });
  }
};



const getClassesByUserNoCredits = async (req, res) => {
  const { userId, fecha } = req.query;
  if (!userId || !fecha) {
    return res.status(400).json({ error: "Faltan parámetros: userId y fecha son obligatorios." });
  }

  try {
    const results = await sequelize.query(
      "CALL GetClassesByUserNoCredits(:userId, :fecha)",
      { replacements: { userId, fecha } }
    );

    res.status(200).json(results);
  } catch (error) {
    console.error("Error fetching classes by user plan (no credits):", error);
    res.status(500).json({ error: error.original?.sqlMessage || "Internal server error" });
  }
};

const registerToClass = async (req, res) => {
  const { userId, fecha, classId, specialClassId } = req.body;

  if (!userId || !fecha || (!classId && !specialClassId) || (classId && specialClassId)) {
    return res.status(400).json({
      error: "Enviá userId, fecha y SOLO uno: classId (normal) o specialClassId (especial).",
    });
  }

  try {
    await sequelize.query(
      "CALL RegisterToClass(:userId, :classId, :specialClassId, :fecha)",
      {
        replacements: {
          userId,
          classId: classId ?? null,
          specialClassId: specialClassId ?? null,
          fecha,
        },
      }
    );

    res.status(200).json({ message: "Usuario registrado correctamente" });
  } catch (error) {
    console.error("Error al registrar usuario en la clase:", error);
    res.status(500).json({ error: error.original?.sqlMessage || "Error interno del servidor" });
  }
};


const unregisterFromClass = async (req, res) => {
  const { userId, fecha, classId, specialClassId } = req.body;

  if (!userId || !fecha || (!classId && !specialClassId) || (classId && specialClassId)) {
    return res.status(400).json({
      error: "Enviá userId, fecha y SOLO uno: classId (normal) o specialClassId (especial).",
    });
  }

  try {
    await sequelize.query(
      "CALL UnregisterFromClass(:userId, :classId, :specialClassId, :fecha)",
      {
        replacements: {
          userId,
          classId: classId ?? null,
          specialClassId: specialClassId ?? null,
          fecha,
        },
      }
    );

    res.status(200).json({ message: "Usuario desinscrito correctamente de la clase." });
  } catch (error) {
    console.error("Error al desinscribir usuario de la clase:", error);
    res.status(500).json({ error: error.original?.sqlMessage || "Error interno del servidor" });
  }
};


const getUsersByClassAndDate = async (req, res) => {
  const { classId, classType, fecha } = req.query;

  if (!classId || !classType || !fecha) {
    return res
      .status(400)
      .json({ error: "Faltan parámetros: classId, classType y fecha son obligatorios." });
  }

  try {
    const results = await sequelize.query(
      "CALL GetUsersByClassAndDate(:classId, :classType, :fecha)",
      { replacements: { classId, classType, fecha } }
    );

    res.status(200).json(results);
  } catch (error) {
    console.error("Error fetching users by class and date:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


const createClass = async (req, res) => {
  const { id_disciplina, id_dia, hora, capacidad_max } = req.body;

  if (!id_disciplina || !id_dia || !hora || !capacidad_max) {
    return res.status(400).json({
      error: "Faltan parámetros: id_disciplina, id_dia, hora y capacidad_max son obligatorios.",
    });
  }

  try {
    await sequelize.query("CALL CreateClass(:id_disciplina, :id_dia, :hora, :capacidad_max)", {
      replacements: { id_disciplina, id_dia, hora, capacidad_max },
    });

    res.status(201).json({ message: "Clase creada exitosamente." });
  } catch (error) {
    console.error("Error al crear clase:", error);
    res.status(500).json({ error: error.original?.sqlMessage || "Error interno del servidor" });
  }
};


const getClassesByDay = async (req, res) => {
  const { id_dia } = req.query;

  if (!id_dia) {
    return res.status(400).json({ error: "Falta el parámetro id_dia." });
  }

  try {
    const results = await sequelize.query("CALL GetClassesByDay(:id_dia)", {
      replacements: { id_dia },
    });

    res.status(200).json(results);
  } catch (error) {
    console.error("Error al obtener clases por día:", error);
    res.status(500).json({ error: error.original?.sqlMessage || "Error interno del servidor" });
  }
};


const updateClass = async (req, res) => {
  const { id_clase, id_disciplina, id_dia, hora, capacidad_max } = req.body;

  if (!id_clase) {
    return res.status(400).json({ error: "El parámetro id_clase es obligatorio." });
  }

  try {
    await sequelize.query(
      "CALL UpdateClasses(:id_clase, :id_disciplina, :id_dia, :hora, :capacidad_max)",
      {
        replacements: {
          id_clase,
          id_disciplina: id_disciplina ?? null,
          id_dia: id_dia ?? null,
          hora: hora ?? null,
          capacidad_max: capacidad_max ?? null,
        },
      }
    );

    res.status(200).json({ message: "Clase actualizada correctamente." });
  } catch (error) {
    console.error("Error al modificar clase:", error);
    res.status(500).json({ error: error.original?.sqlMessage || "Error interno del servidor" });
  }
};


const deleteClass = async (req, res) => {
  const { classId } = req.body;

  if (!classId) {
    return res.status(400).json({ error: "Missing classId parameter." });
  }

  try {
    await sequelize.query("CALL DeleteClass(:classId)", { replacements: { classId } });

    res.status(200).json({ message: "Class logically deleted." });
  } catch (error) {
    console.error("Error logically deleting class:", error);
    res.status(500).json({ error: error.original?.sqlMessage || "Internal server error" });
  }
};


const updateAttendance = async (req, res) => {
  const { tipo_clase, id_clase, fecha, asistencias } = req.body;

  if (!tipo_clase || !id_clase || !fecha || !asistencias) {
    return res.status(400).json({
      error: "Faltan parámetros: tipo_clase, id_clase, fecha y asistencias son obligatorios.",
    });
  }

  try {
    const asistenciasJson =
      typeof asistencias === "string" ? asistencias : JSON.stringify(asistencias);

    await sequelize.query(
      "CALL ActualizarAsistenciaClase(:tipo_clase, :id_clase, :fecha, :asistencias)",
      {
        replacements: { tipo_clase, id_clase, fecha, asistencias: asistenciasJson },
      }
    );

    res.status(200).json({ message: "Asistencia actualizada correctamente." });
  } catch (error) {
    console.error("Error al actualizar asistencia:", error);
    res.status(500).json({
      error: error.original?.sqlMessage || "Error interno del servidor",
    });
  }
};


const checkAttendanceQR = async (req, res) => {
  const { id_usuario } = req.body;

  if (!id_usuario) {
    return res.status(400).json({ error: "Falta el parámetro id_usuario." });
  }

  try {
    const [result] = await sequelize.query("CALL GetTodayClassByUser(:id_usuario)", {
      replacements: { id_usuario },
    });

    if (!result || result.length === 0) {
      return res.status(200).json({
        tieneClaseHoy: false,
        message: "El usuario no tiene clases registradas hoy.",
      });
    }

    const clase = result[0];
    const yaPresente = clase.presente === 1;

    res.status(200).json({
      tieneClaseHoy: true,
      yaPresente,
      clase: {
        id_clase: clase.id_clase,
        disciplina: clase.disciplina,
        hora: clase.hora,
      },
      message: yaPresente
        ? "El usuario ya marcó asistencia en esta clase."
        : "Clase disponible para marcar asistencia.",
    });
  } catch (error) {
    console.error("Error al verificar asistencia QR:", error);
    res.status(500).json({
      error: error.original?.sqlMessage || "Error interno del servidor",
    });
  }
};


const registerIndividualAttendance = async (req, res) => {
  const { classId, userId, date } = req.body;

  if (!classId || !userId || !date) {
    return res.status(400).json({
      error: "Missing parameters: classId, userId, and date are required.",
    });
  }

  try {
    await sequelize.query(
      "CALL RegisterIndividualAttendance(:classId, :userId, :date)",
      {
        replacements: { classId, userId, date },
      }
    );

    res.status(200).json({ message: "Attendance successfully registered." });
  } catch (error) {
    console.error("Error registering individual attendance:", error);
    res.status(500).json({
      error: error.original?.sqlMessage || "Internal server error",
    });
  }
};
const createSpecialClass = async (req, res) => {
  const { fecha, id_disciplina, hora, capacidad_max, descripcion } = req.body;

  if (!fecha || !id_disciplina || !hora || !capacidad_max) {
    return res.status(400).json({
      error: "Faltan parámetros: fecha, id_disciplina, hora y capacidad_max son obligatorios.",
    });
  }

  try {
    await sequelize.query(
      "CALL CreateClaseEspecial(:fecha, :id_disciplina, :hora, :capacidad_max, :descripcion)",
      {
        replacements: { fecha, id_disciplina, hora, capacidad_max, descripcion },
      }
    );
    res.status(201).json({ message: "Clase especial creada exitosamente." });
  } catch (error) {
    console.error("Error al crear clase especial:", error);
    res.status(500).json({
      error: error.original?.sqlMessage || "Error interno del servidor",
    });
  }
};
const updateSpecialClass = async (req, res) => {
  const {
    id_clase_especial,
    fecha,
    id_disciplina,
    hora,
    capacidad_max,
    descripcion,
    activa,
  } = req.body;

  if (!id_clase_especial) {
    return res.status(400).json({
      error: "El parámetro id_clase_especial es obligatorio.",
    });
  }

  try {
    await sequelize.query(
      "CALL UpdateClaseEspecial(:id_clase_especial, :fecha, :id_disciplina, :hora, :capacidad_max, :descripcion, :activa)",
      {
        replacements: {
          id_clase_especial,
          fecha: fecha ?? null,
          id_disciplina: id_disciplina ?? null,
          hora: hora ?? null,
          capacidad_max: capacidad_max ?? null,
          descripcion: descripcion ?? null,
          activa: typeof activa === "undefined" ? null : activa,
        },
      }
    );

    res.status(200).json({ message: "Clase especial actualizada correctamente." });
  } catch (error) {
    console.error("Error al actualizar clase especial:", error);
    res.status(500).json({
      error: error.original?.sqlMessage || "Error interno del servidor",
    });
  }
};

const deleteSpecialClass = async (req, res) => {
  const { id_clase_especial } = req.body;

  if (!id_clase_especial) {
    return res
      .status(400)
      .json({ error: "El parámetro id_clase_especial es obligatorio." });
  }

  try {
    await sequelize.query(
      "CALL DeleteClaseEspecial(:id_clase_especial)",
      { replacements: { id_clase_especial } }
    );

    res
      .status(200)
      .json({ message: "Clase especial eliminada correctamente." });
  } catch (error) {
    console.error("Error al eliminar clase especial:", error);
    res.status(500).json({
      error: error.original?.sqlMessage || "Error interno del servidor",
    });
  }
};



module.exports = {
  // listados
  getAllClasses,
  getClassesByUser,
  getClassesByUserNoCredits,
  getUsersByClassAndDate,
  getClassesByDay,

  // alta/baja/mod
  createClass,
  updateClass,
  deleteClass,
  createSpecialClass,
  updateSpecialClass,
  deleteSpecialClass,

  // inscripción / asistencia
  registerToClass,
  unregisterFromClass,
  updateAttendance,
  checkAttendanceQR,
  registerIndividualAttendance,
};
