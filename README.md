# ERP System - Modular Boilerplate with RBAC

A modern, modular ERP system with Role-Based Access Control (RBAC), built with Node.js and Vue.js.

## 🚀 Features

### Architecture
- **Modular Design**: Easily extensible architecture for adding new ERP modules
- **RBAC**: Fine-grained permission system with role-based access control
- **JWT Authentication**: Secure token-based authentication
- **RESTful API**: Well-structured backend API
- **Responsive UI**: Modern, mobile-friendly interface

### Tech Stack

**Backend:**
- Node.js with Express
- JWT for authentication
- bcryptjs for password hashing
- In-memory data storage (ready for database integration)

**Frontend:**
- Vue 3 with Composition API
- Vite for fast development and building
- Tailwind CSS for styling
- Pinia for state management
- Vue Router for navigation
- Heroicons for icons
- PWA support

## 📦 Project Structure

```
ERP/
├── backend/              # Node.js backend
│   ├── src/
│   │   ├── core/        # Core functionality (middleware, utils)
│   │   ├── modules/     # Feature modules (auth, users, roles)
│   │   ├── data.js      # In-memory data store
│   │   └── index.js     # App entry point
│   └── config/          # Configuration files
├── frontend/            # Vue.js frontend
│   ├── src/
│   │   ├── api/        # API service layer
│   │   ├── components/ # Reusable components
│   │   ├── router/     # Route configuration
│   │   ├── stores/     # State management
│   │   └── views/      # Page components
│   └── vite.config.js  # Vite configuration
├── .vscode/            # VS Code workspace configuration
└── package.json        # Root package.json for scripts
```

## 🛠️ Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ERP
```

2. Install all dependencies (backend + frontend):
```bash
npm run install:all
```

### Development

#### Option 1: Start Both Backend and Frontend (Recommended)
```bash
npm run dev
```

This will start:
- Backend on `http://localhost:3000`
- Frontend on `http://localhost:5173`

#### Option 2: VS Code Launch Configuration
1. Open the project in VS Code
2. Press `F5` or go to Run → Start Debugging
3. Select "Start Dev (Backend + Frontend)"

#### Option 3: Start Individually
```bash
# Backend only
npm run dev:backend

# Frontend only
npm run dev:frontend
```

## 🔐 Default Credentials

```
Username: admin
Password: Admin123!
```

## 📚 Modules

### Implemented Modules
- **Authentication**: Login/Logout with JWT
- **User Management**: CRUD operations for users
- **Role Management**: Create custom roles with granular permissions
- **Dashboard**: Overview and system statistics

### Adding New Modules

1. **Backend**: Create a new folder in `backend/src/modules/`
2. **Add Routes**: Create routes.js and register in `backend/src/index.js`
3. **Define Permissions**: Add permissions to `backend/src/data.js`
4. **Frontend**: Create new views and add routes in `frontend/src/router/`

## 🔒 Security Features

- Password strength validation
- JWT token-based authentication
- RBAC middleware for route protection
- Helmet.js for security headers
- CORS configuration
- Input validation with express-validator

## 🎨 UI/UX

- **Font**: Manrope (Google Fonts)
- **Icons**: Heroicons
- **Framework**: Tailwind CSS
- **Responsive**: Mobile-first design
- **PWA**: Installable as a Progressive Web App

## 📝 API Documentation

### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout

### Users (Protected)
- `GET /api/users` - List all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Roles (Protected)
- `GET /api/roles` - List all roles
- `GET /api/roles/permissions` - Get available permissions
- `GET /api/roles/:id` - Get role by ID
- `POST /api/roles` - Create role
- `PUT /api/roles/:id` - Update role
- `DELETE /api/roles/:id` - Delete role

## 🔧 Configuration

### Backend (.env)
```env
PORT=3000
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=24h
NODE_ENV=development
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3000/api
```

## 🚀 Production Deployment

### Build Frontend
```bash
cd frontend
npm run build
```

### Start Backend
```bash
cd backend
npm start
```

## 📖 Documentation

- [Backend Documentation](./backend/README.md)
- [Frontend Documentation](./frontend/README.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

ISC

## 🎯 Future Enhancements

- Database integration (PostgreSQL, MongoDB)
- Additional ERP modules (Inventory, CRM, Accounting)
- Email notifications
- Audit logging
- Advanced reporting
- Multi-language support
- Dark mode
