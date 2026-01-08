/**
 * RBAC Middleware - Check if user has required permissions
 * @param {string|string[]} requiredPermissions - Permission(s) required to access the route
 */
export const checkPermissions = (requiredPermissions) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Admin role has all permissions
    if (req.user.role === 'admin') {
      return next();
    }

    // Convert to array if single permission
    const permissions = Array.isArray(requiredPermissions) 
      ? requiredPermissions 
      : [requiredPermissions];

    // Check if user has all required permissions
    const hasPermission = permissions.every(permission => 
      req.user.permissions && req.user.permissions.includes(permission)
    );

    if (!hasPermission) {
      return res.status(403).json({ 
        error: 'Insufficient permissions',
        required: permissions,
        current: req.user.permissions || []
      });
    }

    next();
  };
};

/**
 * RBAC Middleware - Check if user has required role
 * @param {string|string[]} requiredRoles - Role(s) required to access the route
 */
export const checkRole = (requiredRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'Insufficient role',
        required: roles,
        current: req.user.role
      });
    }

    next();
  };
};
