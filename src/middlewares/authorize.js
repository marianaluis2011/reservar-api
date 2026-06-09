export const authorize = (rolesPermitidos = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ mensaje: 'No autenticado' });
    }
    if (!rolesPermitidos.includes(req.user.rol)) {
      return res.status(403).json({ mensaje: 'No tienes permisos para realizar esta acción' });
    }
    next();
  };
};