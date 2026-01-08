import express from 'express';
import { body, validationResult } from 'express-validator';
import { User, Role } from '../../core/database/models.js';
import { hashPassword, validatePasswordStrength } from '../../core/utils/auth.js';
import { authenticateToken } from '../../core/middleware/auth.js';
import { checkPermissions } from '../../core/middleware/rbac.js';
import { apiLimiter } from '../../core/middleware/rateLimiter.js';
import { sendWelcomeEmail } from '../../core/services/emailService.js';

const router = express.Router();

// Apply rate limiting to all routes
router.use(apiLimiter);

/**
 * GET /api/users
 * Get all users (requires users:read permission)
 */
router.get('/', authenticateToken, checkPermissions('users:read'), async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] }
    });
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'An error occurred while fetching users' });
  }
});

/**
 * GET /api/users/:id
 * Get user by ID (requires users:read permission)
 */
router.get('/:id', authenticateToken, checkPermissions('users:read'), async (req, res) => {
  try {
    const user = await User.findByPk(parseInt(req.params.id), {
      attributes: { exclude: ['password'] }
    });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'An error occurred while fetching user' });
  }
});

/**
 * POST /api/users
 * Create new user (requires users:create permission)
 */
router.post('/',
  authenticateToken,
  checkPermissions('users:create'),
  [
    body('username').notEmpty().withMessage('Username is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
    body('role').notEmpty().withMessage('Role is required')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password, role } = req.body;

    try {
      // Check if username already exists
      const existingUsername = await User.findOne({ where: { username } });
      if (existingUsername) {
        return res.status(400).json({ error: 'Username already exists' });
      }

      // Check if email already exists
      const existingEmail = await User.findOne({ where: { email } });
      if (existingEmail) {
        return res.status(400).json({ error: 'Email already exists' });
      }

      // Validate password strength
      const passwordValidation = validatePasswordStrength(password);
      if (!passwordValidation.valid) {
        return res.status(400).json({ error: passwordValidation.message });
      }

      // Check if role exists
      const userRole = await Role.findOne({ where: { name: role } });
      if (!userRole) {
        return res.status(400).json({ error: 'Invalid role' });
      }

      // Hash password
      const hashedPassword = await hashPassword(password);

      // Create new user
      const newUser = await User.create({
        username,
        email,
        password: hashedPassword,
        role,
        permissions: userRole.permissions
      });

      // Send welcome email (async, don't wait for it)
      sendWelcomeEmail(newUser.toJSON()).catch(err => {
        console.error('Failed to send welcome email:', err);
      });

      // Return user without password
      const { password: _, ...userWithoutPassword } = newUser.toJSON();
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ error: 'An error occurred while creating user' });
    }
  }
);

/**
 * PUT /api/users/:id
 * Update user (requires users:update permission)
 */
router.put('/:id',
  authenticateToken,
  checkPermissions('users:update'),
  [
    body('username').optional().notEmpty(),
    body('email').optional().isEmail(),
    body('role').optional().notEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findByPk(parseInt(req.params.id));
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const { username, email, role, password } = req.body;

      // Check if new username already exists
      if (username && username !== user.username) {
        const existingUsername = await User.findOne({ where: { username } });
        if (existingUsername) {
          return res.status(400).json({ error: 'Username already exists' });
        }
        user.username = username;
      }

      // Check if new email already exists
      if (email && email !== user.email) {
        const existingEmail = await User.findOne({ where: { email } });
        if (existingEmail) {
          return res.status(400).json({ error: 'Email already exists' });
        }
        user.email = email;
      }

      // Update role
      if (role && role !== user.role) {
        const userRole = await Role.findOne({ where: { name: role } });
        if (!userRole) {
          return res.status(400).json({ error: 'Invalid role' });
        }
        user.role = role;
        user.permissions = userRole.permissions;
      }

      // Update password if provided
      if (password) {
        const passwordValidation = validatePasswordStrength(password);
        if (!passwordValidation.valid) {
          return res.status(400).json({ error: passwordValidation.message });
        }
        user.password = await hashPassword(password);
      }

      await user.save();

      const { password: _, ...userWithoutPassword } = user.toJSON();
      res.json(userWithoutPassword);
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ error: 'An error occurred while updating user' });
    }
  }
);

/**
 * DELETE /api/users/:id
 * Delete user (requires users:delete permission)
 */
router.delete('/:id', authenticateToken, checkPermissions('users:delete'), async (req, res) => {
  try {
    const user = await User.findByPk(parseInt(req.params.id));
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Prevent deleting admin user if it's the last admin
    if (user.role === 'admin') {
      const adminCount = await User.count({ where: { role: 'admin' } });
      if (adminCount === 1) {
        return res.status(400).json({ error: 'Cannot delete the last admin user' });
      }
    }

    await user.destroy();
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'An error occurred while deleting user' });
  }
});

export default router;
