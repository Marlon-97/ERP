import express from 'express';
import { body, validationResult } from 'express-validator';
import { User } from '../../core/database/models.js';
import { generateToken, comparePassword } from '../../core/utils/auth.js';
import { authLimiter } from '../../core/middleware/rateLimiter.js';

const router = express.Router();

/**
 * POST /api/auth/login
 * Login user and return JWT token
 */
router.post('/login',
  authLimiter,
  [
    body('username').notEmpty().withMessage('Username is required'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;

    try {
      // Find user
      const user = await User.findOne({ where: { username } });
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Verify password
      const isValid = await comparePassword(password, user.password);
      if (!isValid) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Get user's role permissions
      const token = generateToken(user);

      // Return user info without password
      const { password: _, ...userWithoutPassword } = user.toJSON();

      res.json({
        message: 'Login successful',
        token,
        user: userWithoutPassword
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'An error occurred during login' });
    }
  }
);

/**
 * POST /api/auth/logout
 * Logout user (client-side token removal)
 */
router.post('/logout', (req, res) => {
  res.json({ message: 'Logout successful' });
});

export default router;
