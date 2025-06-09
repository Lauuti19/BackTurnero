const sequelize = require('../config/database');

const getPlanes = async (req, res) => {
  try {
    const planes = await sequelize.query('CALL GetPlanes()');
    res.json({ planes });
  } catch (error) {
    console.error('Error al obtener planes:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};
const deletePlan = async (req, res) => {
  const { planId } = req.body;

  if (!planId) {
    return res.status(400).json({ error: 'Missing planId parameter.' });
  }

  try {
    await sequelize.query('CALL DeletePlan(:planId)', {
      replacements: { planId }
    });

    res.status(200).json({ message: 'Plan logically deleted.' });
  } catch (error) {
    console.error('Error logically deleting plan:', error);
    res.status(500).json({ error: error.original?.sqlMessage || 'Internal server error' });
  }
};

const createPlan = async (req, res) => {
  const { name, description, price, totalCredits, disciplines } = req.body;

  if (!name || !description || !price || !totalCredits || !Array.isArray(disciplines) || disciplines.length === 0) {
    return res.status(400).json({ error: 'Missing required plan parameters or disciplines.' });
  }

  const disciplineIds = disciplines.join(',');

  try {
    await sequelize.query(
      'CALL CreatePlan(:name, :description, :price, :totalCredits, :disciplineIds)',
      {
        replacements: {
          name,
          description,
          price,
          totalCredits,
          disciplineIds
        }
      }
    );

    res.status(201).json({ message: 'Plan created successfully with associated disciplines.' });
  } catch (error) {
    console.error('Error creating plan:', error);
    res.status(500).json({ error: error.original?.sqlMessage || 'Internal server error' });
  }
};



const updatePlan = async (req, res) => {
  const { planId, name, description, price, totalCredits } = req.body;

  if (!planId) {
    return res.status(400).json({ error: 'Missing planId parameter.' });
  }

  try {
    await sequelize.query(
      'CALL UpdatePlan(:planId, :name, :description, :price, :totalCredits)',
      {
        replacements: {
          planId,
          name: name ?? null,
          description: description ?? null,
          price: price ?? null,
          totalCredits: totalCredits ?? null
        }
      }
    );

    res.status(200).json({ message: 'Plan updated successfully.' });
  } catch (error) {
    console.error('Error updating plan:', error);
    res.status(500).json({ error: error.original?.sqlMessage || 'Internal server error' });
  }
}

module.exports = { getPlanes,
  deletePlan,
  createPlan,
  updatePlan
};