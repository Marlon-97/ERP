import express from 'express';
import { body, validationResult } from 'express-validator';
import { roles, roleIdCounter, availablePermissions } from '../../data.js';
import { authenticateToken } from '../../core/middleware/auth.js';
import { checkPermissions } from '../../core/middleware/rbac.js';
import { apiLimiter } from '../../core/middleware/rateLimiter.js';

const router = express.Router();

// Apply rate limiting to all routes
router.use(apiLimiter);

/**
 * GET /api/roles
 * Get all roles (requires roles:read permission)
 */
router.get('/', authenticateToken, checkPermissions('roles:read'), (req, res) => {
  res.json(roles);
});

/**
 * GET /api/roles/permissions
 * Get all available permissions
 */
router.get('/permissions', authenticateToken, (req, res) => {
  res.json(availablePermissions);
});

/**
 * GET /api/roles/:id
 * Get role by ID (requires roles:read permission)
 */
router.get('/:id', authenticateToken, checkPermissions('roles:read'), (req, res) => {
  const role = roles.find(r => r.id === parseInt(req.params.id));
  if (!role) {
    return res.status(404).json({ error: 'Role not found' });
  }
  res.json(role);
});

/**
 * POST /api/roles
 * Create new role (requires roles:create permission)
 */
router.post('/',
  authenticateToken,
  checkPermissions('roles:create'),
  [
    body('name').notEmpty().withMessage('Role name is required'),
    body('description').optional(),
    body('permissions').isArray().withMessage('Permissions must be an array')
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, permissions } = req.body;

    // Check if role name already exists
    if (roles.find(r => r.name === name)) {
      return res.status(400).json({ error: 'Role name already exists' });
    }

    // Validate permissions
    const invalidPermissions = permissions.filter(p => 
      !availablePermissions.includes(p) && p !== '*'
    );
    if (invalidPermissions.length > 0) {
      return res.status(400).json({ 
        error: 'Invalid permissions',
        invalid: invalidPermissions
      });
    }

    // Create new role
    const newRole = {
      id: roleIdCounter++,
      name,
      description: description || '',
      permissions,
      createdAt: new Date().toISOString()
    };

    roles.push(newRole);
    res.status(201).json(newRole);
  }
);

/**
 * PUT /api/roles/:id
 * Update role (requires roles:update permission)
 */
router.put('/:id',
  authenticateToken,
  checkPermissions('roles:update'),
  [
    body('name').optional().notEmpty(),
    body('description').optional(),
    body('permissions').optional().isArray()
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const roleIndex = roles.findIndex(r => r.id === parseInt(req.params.id));
    if (roleIndex === -1) {
      return res.status(404).json({ error: 'Role not found' });
    }

    // Prevent modifying admin role
    if (roles[roleIndex].name === 'admin') {
      return res.status(400).json({ error: 'Cannot modify admin role' });
    }

    const { name, description, permissions } = req.body;

    // Check if new name already exists
    if (name && roles.find(r => r.name === name && r.id !== parseInt(req.params.id))) {
      return res.status(400).json({ error: 'Role name already exists' });
    }

    // Validate permissions if provided
    if (permissions) {
      const invalidPermissions = permissions.filter(p => 
        !availablePermissions.includes(p) && p !== '*'
      );
      if (invalidPermissions.length > 0) {
        return res.status(400).json({ 
          error: 'Invalid permissions',
          invalid: invalidPermissions
        });
      }
    }

    // Update role
    if (name) roles[roleIndex].name = name;
    if (description !== undefined) roles[roleIndex].description = description;
    if (permissions) roles[roleIndex].permissions = permissions;
    roles[roleIndex].updatedAt = new Date().toISOString();

    res.json(roles[roleIndex]);
  }
);

/**
 * DELETE /api/roles/:id
 * Delete role (requires roles:delete permission)
 */
router.delete('/:id', authenticateToken, checkPermissions('roles:delete'), (req, res) => {
  const roleIndex = roles.findIndex(r => r.id === parseInt(req.params.id));
  if (roleIndex === -1) {
    return res.status(404).json({ error: 'Role not found' });
  }

  // Prevent deleting default roles
  if (['admin', 'user'].includes(roles[roleIndex].name)) {
    return res.status(400).json({ error: 'Cannot delete default system roles' });
  }

  roles.splice(roleIndex, 1);
  res.json({ message: 'Role deleted successfully' });
});

export default router;
