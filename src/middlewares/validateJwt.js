import { verifyToken } from '../libs/jwt.js';

export function validateJwt(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ mensaje: 'Acceso denegado. No se proporcionó token.' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ mensaje: 'Acceso denegado. Formato de token inválido.' });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(403).json({ mensaje: 'Token inválido o expirado.' });
  }
  req.user = decoded;
  next();
}