# ERP Backend

RESTful API backend for the modular ERP system with JWT authentication and RBAC.

## Features

- **JWT Authentication**: Secure token-based authentication
- **RBAC**: Role-based access control with granular permissions
- **Modular Architecture**: Easy to extend with new modules
- **Express.js**: Fast and minimal web framework
- **Security**: Helmet.js for security headers, bcrypt for password hashing

## Getting Started

### Installation

```bash
npm install
```

### Environment Variables

Copy `.env.example` to `.env` and update the values:

```bash
cp .env.example .env
```

### Running the Server

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## Default Credentials

- **Username**: admin
- **Password**: Admin123!

## Security Features

- **Rate Limiting**: 
  - Login endpoint: 5 attempts per 15 minutes per IP
  - API endpoints: 100 requests per 15 minutes per IP
- **JWT Authentication**: Secure token-based auth
- **Password Validation**: Strong password requirements
- **Helmet.js**: Security headers
- **CORS**: Configured for frontend origin

## API Endpoints

### Authentication (Rate Limited: 5 req/15min)
- `POST /api/auth/login` - Login and get JWT token
- `POST /api/auth/logout` - Logout (client-side)

### Users (requires authentication, Rate Limited: 100 req/15min)
- `GET /api/users` - Get all users (requires `users:read`)
- `GET /api/users/:id` - Get user by ID (requires `users:read`)
- `POST /api/users` - Create new user (requires `users:create`)
- `PUT /api/users/:id` - Update user (requires `users:update`)
- `DELETE /api/users/:id` - Delete user (requires `users:delete`)

### Roles (requires authentication, Rate Limited: 100 req/15min)
- `GET /api/roles` - Get all roles (requires `roles:read`)
- `GET /api/roles/permissions` - Get available permissions
- `GET /api/roles/:id` - Get role by ID (requires `roles:read`)
- `POST /api/roles` - Create new role (requires `roles:create`)
- `PUT /api/roles/:id` - Update role (requires `roles:update`)
- `DELETE /api/roles/:id` - Delete role (requires `roles:delete`)

## Architecture

```
backend/
├── config/           # Configuration files
├── src/
│   ├── core/        # Core functionality
│   │   ├── middleware/  # Authentication, RBAC
│   │   └── utils/       # Helper functions
│   ├── modules/     # Feature modules
│   │   ├── auth/    # Authentication module
│   │   ├── users/   # User management
│   │   └── roles/   # Role management
│   ├── data.js      # In-memory data store
│   └── index.js     # App entry point
└── package.json
```

## Available Permissions

- `users:create`, `users:read`, `users:update`, `users:delete`
- `roles:create`, `roles:read`, `roles:update`, `roles:delete`
- `inventory:*`, `crm:*`, `accounting:*` (for future modules)
- `*` - Wildcard for all permissions (admin only)

## Adding New Modules

1. Create a new folder in `src/modules/`
2. Create `routes.js` with your API endpoints
3. Import and register routes in `src/index.js`
4. Add module permissions to `src/data.js`
