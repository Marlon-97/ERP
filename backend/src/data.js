import { hashPassword } from '../core/utils/auth.js';

// In-memory data stores (replace with database in production)
export const users = [];
export const roles = [];

// Default admin user
const defaultAdminPassword = await hashPassword('Admin123!');
users.push({
  id: 1,
  username: 'admin',
  email: 'admin@erp.com',
  password: defaultAdminPassword,
  role: 'admin',
  permissions: [],
  createdAt: new Date().toISOString()
});

// Default roles with permissions
roles.push({
  id: 1,
  name: 'admin',
  description: 'Administrator with full system access',
  permissions: ['*'], // Wildcard for all permissions
  createdAt: new Date().toISOString()
});

roles.push({
  id: 2,
  name: 'user',
  description: 'Standard user with limited access',
  permissions: ['users:read', 'roles:read'],
  createdAt: new Date().toISOString()
});

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

export let userIdCounter = 2;
export let roleIdCounter = 3;
