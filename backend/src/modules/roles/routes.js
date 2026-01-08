import express from 'express';
import { body, validationResult } from 'express-validator';
import { Role } from '../../core/database/models.js';
import { availablePermissions } from '../../core/database/seed.js';
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
router.get('/', authenticateToken, checkPermissions('roles:read'), async (req, res) => {
  try {
    const roles = await Role.findAll();
    res.json(roles);
  } catch (error) {
    console.error('Error fetching roles:', error);
    res.status(500).json({ error: 'An error occurred while fetching roles' });
  }
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
router.get('/:id', authenticateToken, checkPermissions('roles:read'), async (req, res) => {
  try {
    const role = await Role.findByPk(parseInt(req.params.id));
    if (!role) {
      return res.status(404).json({ error: 'Role not found' });
    }
    res.json(role);
  } catch (error) {
    console.error('Error fetching role:', error);
    res.status(500).json({ error: 'An error occurred while fetching role' });
  }
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
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, permissions } = req.body;

    try {
      // Check if role name already exists
      const existingRole = await Role.findOne({ where: { name } });
      if (existingRole) {
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
      const newRole = await Role.create({
        name,
        description: description || '',
        permissions
      });

      res.status(201).json(newRole);
    } catch (error) {
      console.error('Error creating role:', error);
      res.status(500).json({ error: 'An error occurred while creating role' });
    }
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
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const role = await Role.findByPk(parseInt(req.params.id));
      if (!role) {
        return res.status(404).json({ error: 'Role not found' });
      }

      // Prevent modifying admin role
      if (role.name === 'admin') {
        return res.status(400).json({ error: 'Cannot modify admin role' });
      }

      const { name, description, permissions } = req.body;

      // Check if new name already exists
      if (name && name !== role.name) {
        const existingRole = await Role.findOne({ where: { name } });
        if (existingRole) {
          return res.status(400).json({ error: 'Role name already exists' });
        }
        role.name = name;
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
        role.permissions = permissions;
      }

      if (description !== undefined) {
        role.description = description;
      }

      await role.save();
      res.json(role);
    } catch (error) {
      console.error('Error updating role:', error);
      res.status(500).json({ error: 'An error occurred while updating role' });
    }
  }
);

/**
 * DELETE /api/roles/:id
 * Delete role (requires roles:delete permission)
 */
router.delete('/:id', authenticateToken, checkPermissions('roles:delete'), async (req, res) => {
  try {
    const role = await Role.findByPk(parseInt(req.params.id));
    if (!role) {
      return res.status(404).json({ error: 'Role not found' });
    }

    // Prevent deleting default roles
    if (['admin', 'user'].includes(role.name)) {
      return res.status(400).json({ error: 'Cannot delete default system roles' });
    }

    await role.destroy();
    res.json({ message: 'Role deleted successfully' });
  } catch (error) {
    console.error('Error deleting role:', error);
    res.status(500).json({ error: 'An error occurred while deleting role' });
  }
});

export default router;
