import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'hydronova-secret-key-change-in-production';

// MIDDLEWARE: VERIFICAR JWT
export const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'No autorizado - Token requerido' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token inválido o expirado' });
  }
};

// MIDDLEWARE: SOLO ADMIN (acepta 'admin', 'ADMIN', 'ADMINISTRADOR')
export const adminOnlyMiddleware = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'No autorizado' });
  }

  const userRol = req.user.rol?.toLowerCase();
  
  if (userRol !== 'admin' && userRol !== 'super_admin') {
    return res.status(403).json({ 
      error: 'Acceso denegado - Solo administradores pueden acceder',
      suRol: req.user.rol
    });
  }

  next();
};

// MIDDLEWARE: SOLO SUPER ADMIN
export const superAdminOnlyMiddleware = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'No autorizado' });
  }

  const userRol = req.user.rol?.toLowerCase();
  
  if (userRol !== 'super_admin') {
    return res.status(403).json({ 
      error: 'Acceso denegado - Solo Super Administrador' 
    });
  }

  next();
};