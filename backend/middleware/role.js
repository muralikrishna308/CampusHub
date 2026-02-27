module.exports = function requireRole(requiredRoles) {
  return function (req, res, next) {
    if (!req.user) return res.status(401).json({ msg: 'Not authenticated' });

    const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
    const userRole = req.user && req.user.role ? req.user.role : 'NO_ROLE';

    // Allow super_admin (with or without underscore) or the specifically required role(s)
    if (userRole === 'super_admin' || userRole === 'superadmin' || roles.includes(userRole)) {
      return next();
    }

    return res.status(403).json({ msg: 'Access denied' });
  };
};