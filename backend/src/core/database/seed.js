import { User, Role } from './models.js';
import { hashPassword } from '../utils/auth.js';

export const initializeDefaultData = async () => {
  try {
    // Check if admin role exists
    let adminRole = await Role.findOne({ where: { name: 'admin' } });
    
    if (!adminRole) {
      // Create default admin role
      adminRole = await Role.create({
        name: 'admin',
        description: 'Administrator with full system access',
        permissions: ['*']
      });
      console.log('✅ Admin role created');
    }

    // Check if user role exists
    let userRole = await Role.findOne({ where: { name: 'user' } });
    
    if (!userRole) {
      // Create default user role
      userRole = await Role.create({
        name: 'user',
        description: 'Standard user with limited access',
        permissions: ['users:read', 'roles:read']
      });
      console.log('✅ User role created');
    }

    // Check if default admin user exists
    const adminUser = await User.findOne({ where: { username: 'admin' } });
    
    if (!adminUser) {
      // Create default admin user
      const defaultPassword = await hashPassword('Admin123!');
      await User.create({
        username: 'admin',
        email: 'admin@erp.com',
        password: defaultPassword,
        role: 'admin',
        permissions: []
      });
      console.log('✅ Default admin user created');
      console.log('   Username: admin');
      console.log('   Password: Admin123!');
    } else {
      console.log('✅ Default admin user already exists');
    }
  } catch (error) {
    console.error('❌ Error initializing default data:', error);
    throw error;
  }
};

// Available permissions in the system
export const availablePermissions = [
  'users:create',
  'users:read',
  'users:update',
  'users:delete',
  'roles:create',
  'roles:read',
  'roles:update',
  'roles:delete',
  'inventory:create',
  'inventory:read',
  'inventory:update',
  'inventory:delete',
  'crm:create',
  'crm:read',
  'crm:update',
  'crm:delete',
  'accounting:create',
  'accounting:read',
  'accounting:update',
  'accounting:delete'
];
