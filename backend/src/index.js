import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from '../config/config.js';
import { initializeDatabase } from './core/database/index.js';
import { initializeDefaultData } from './core/database/seed.js';

// Import routes
import authRoutes from './modules/auth/routes.js';
import userRoutes from './modules/users/routes.js';
import roleRoutes from './modules/roles/routes.js';

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'ERP Backend'
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/roles', roleRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    ...(config.nodeEnv === 'development' && { stack: err.stack })
  });
});

// Initialize database and start server
const startServer = async () => {
  try {
    // Initialize database
    await initializeDatabase();
    
    // Create default data (roles and admin user)
    await initializeDefaultData();
    
    // Start server
    app.listen(config.port, () => {
      console.log(`🚀 ERP Backend running on port ${config.port}`);
      console.log(`📝 Environment: ${config.nodeEnv}`);
      console.log(`💾 Database: ${config.nodeEnv === 'production' ? 'PostgreSQL' : 'SQLite'}`);
      console.log(`\n✅ Default admin credentials:`);
      console.log(`   Username: admin`);
      console.log(`   Password: Admin123!\n`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
