const roleNameById = { 1: 'admin', 2: 'profesor', 3: 'alumno' };

function authorizeRole(allowed = []) {
  // allowed: array de strings como ['admin','profesor'] o de ids [1,2]
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'No autenticado' });

    const userRoleId = req.user.id_rol ?? req.user.roleId ?? null;
    const userRoleName = userRoleId ? roleNameById[userRoleId] : req.user.role; 

    const allowedIds = allowed.filter(a => typeof a === 'number');
    const allowedNames = allowed.filter(a => typeof a === 'string');

    if ( (userRoleId && allowedIds.includes(userRoleId)) ||
         (userRoleName && allowedNames.includes(userRoleName)) ) {
      return next();
    }

    return res.status(403).json({ error: 'No autorizado' });
  };
}

module.exports = { authorizeRole };
