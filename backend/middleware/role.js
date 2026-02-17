module.exports = function requireRole(requiredRole) {
  return function (req, res, next) {
    if (!req.user) return res.status(401).json({ msg: 'Not authenticated' });
    if (req.user.role !== requiredRole) return res.status(403).json({ msg: 'Access denied' });
    next();
  };
};
