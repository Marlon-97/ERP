import express from 'express';
import { body, validationResult } from 'express-validator';
import { users, userIdCounter, roles } from '../../data.js';
import { hashPassword, validatePasswordStrength } from '../../core/utils/auth.js';
import { authenticateToken } from '../../core/middleware/auth.js';
import { checkPermissions } from '../../core/middleware/rbac.js';

const router = express.Router();

/**
 * GET /api/users
 * Get all users (requires users:read permission)
 */
router.get('/', authenticateToken, checkPermissions('users:read'), (req, res) => {
  const usersWithoutPasswords = users.map(({ password, ...user }) => user);
  res.json(usersWithoutPasswords);
});

/**
 * GET /api/users/:id
 * Get user by ID (requires users:read permission)
 */
router.get('/:id', authenticateToken, checkPermissions('users:read'), (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const { password, ...userWithoutPassword } = user;
  res.json(userWithoutPassword);
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

    // Check if username already exists
    if (users.find(u => u.username === username)) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    // Check if email already exists
    if (users.find(u => u.email === email)) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Validate password strength
    const passwordValidation = validatePasswordStrength(password);
    if (!passwordValidation.valid) {
      return res.status(400).json({ error: passwordValidation.message });
    }

    // Check if role exists
    const userRole = roles.find(r => r.name === role);
    if (!userRole) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create new user
    const newUser = {
      id: userIdCounter++,
      username,
      email,
      password: hashedPassword,
      role,
      permissions: userRole.permissions,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);

    // Return user without password
    const { password: _, ...userWithoutPassword } = newUser;
    res.status(201).json(userWithoutPassword);
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

    const userIndex = users.findIndex(u => u.id === parseInt(req.params.id));
    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { username, email, role, password } = req.body;

    // Check if new username already exists
    if (username && users.find(u => u.username === username && u.id !== parseInt(req.params.id))) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    // Check if new email already exists
    if (email && users.find(u => u.email === email && u.id !== parseInt(req.params.id))) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Update user
    if (username) users[userIndex].username = username;
    if (email) users[userIndex].email = email;
    if (role) {
      const userRole = roles.find(r => r.name === role);
      if (!userRole) {
        return res.status(400).json({ error: 'Invalid role' });
      }
      users[userIndex].role = role;
      users[userIndex].permissions = userRole.permissions;
    }
    if (password) {
      const passwordValidation = validatePasswordStrength(password);
      if (!passwordValidation.valid) {
        return res.status(400).json({ error: passwordValidation.message });
      }
      users[userIndex].password = await hashPassword(password);
    }

    users[userIndex].updatedAt = new Date().toISOString();

    const { password: _, ...userWithoutPassword } = users[userIndex];
    res.json(userWithoutPassword);
  }
);

/**
 * DELETE /api/users/:id
 * Delete user (requires users:delete permission)
 */
router.delete('/:id', authenticateToken, checkPermissions('users:delete'), (req, res) => {
  const userIndex = users.findIndex(u => u.id === parseInt(req.params.id));
  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found' });
  }

  // Prevent deleting admin user
  if (users[userIndex].role === 'admin' && users.filter(u => u.role === 'admin').length === 1) {
    return res.status(400).json({ error: 'Cannot delete the last admin user' });
  }

  users.splice(userIndex, 1);
  res.json({ message: 'User deleted successfully' });
});

export default router;
