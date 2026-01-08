# ERP System - Modular Boilerplate with RBAC

A modern, modular ERP system with Role-Based Access Control (RBAC), built with Node.js and Vue.js.

## 🚀 Features

### Architecture
- **Modular Design**: Easily extensible architecture for adding new ERP modules
- **RBAC**: Fine-grained permission system with role-based access control
- **JWT Authentication**: Secure token-based authentication
- **RESTful API**: Well-structured backend API
- **Responsive UI**: Modern, mobile-friendly interface with gradient design
- **Database Support**: SQLite for development, PostgreSQL for production
- **Email Integration**: Azure Communication Service for email notifications

### Tech Stack

**Backend:**
- Node.js with Express
- JWT for authentication
- bcryptjs for password hashing
- Sequelize ORM with SQLite/PostgreSQL support
- Azure Communication Service for emails

**Frontend:**
- Vue 3 with Composition API
- Vite for fast development and building
- Tailwind CSS for styling with custom color palette
- Pinia for state management
- Vue Router for navigation
- Heroicons for icons
- PWA support
- Modern gradient design with animations

## 📦 Project Structure

```
ERP/
├── backend/              # Node.js backend
│   ├── src/
│   │   ├── core/        # Core functionality (middleware, utils, database)
│   │   │   ├── database/    # Database models and connection
│   │   │   ├── services/    # Email and other services
│   │   │   ├── middleware/  # Authentication and RBAC
│   │   │   └── utils/       # Utility functions
│   │   ├── modules/     # Feature modules (auth, users, roles)
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

The system automatically creates a default admin user on first startup if it doesn't exist:

```
Username: admin
Password: Admin123!
```

## 💾 Database Configuration

The application uses different databases based on the environment:

- **Development**: SQLite (file-based, no setup required)
- **Production**: PostgreSQL (configured via `DATABASE_URL` environment variable)

### Environment Variables

Create a `.env` file in the `backend` directory:

```env
# Server Configuration
PORT=3000
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=24h
NODE_ENV=development

# Database Configuration
# For production, use PostgreSQL:
# DATABASE_URL=postgresql://username:password@host:port/database
# For development (SQLite is used by default):
DATABASE_STORAGE=./database.sqlite

# Azure Communication Service (optional)
# AZURE_EMAIL_CONNECTION_STRING=endpoint=https://your-resource.communication.azure.com/;accesskey=your-key
# AZURE_SENDER_EMAIL=DoNotReply@yourdomain.com
```

## 📧 Email Integration

The system includes Azure Communication Service integration for sending emails:

- Welcome emails when new users are created
- Password reset emails (when implemented)
- Email service gracefully degrades if not configured

To enable email functionality:
1. Create an Azure Communication Service resource
2. Add the connection string to your `.env` file
3. Configure the sender email address

## 📚 Modules

### Implemented Modules
- **Authentication**: Login/Logout with JWT
- **User Management**: CRUD operations for users with email notifications
- **Role Management**: Create custom roles with granular permissions
- **Dashboard**: Overview and system statistics with modern design

### Adding New Modules

1. **Backend**: Create a new folder in `backend/src/modules/`
2. **Add Routes**: Create routes.js and register in `backend/src/index.js`
3. **Define Permissions**: Add permissions to `backend/src/core/database/seed.js`
4. **Frontend**: Create new views and add routes in `frontend/src/router/`

## 🔒 Security Features

- Password strength validation
- JWT token-based authentication
- RBAC middleware for route protection
- Helmet.js for security headers
- CORS configuration
- Input validation with express-validator
- Secure database storage with Sequelize ORM

## 🎨 UI/UX

- **Font**: Manrope (Google Fonts)
- **Icons**: Heroicons
- **Framework**: Tailwind CSS with custom color palette
- **Design**: Modern gradient design with animations
- **Colors**: Primary (blue), Secondary (purple), Accent (green)
- **Responsive**: Mobile-first design
- **PWA**: Installable as a Progressive Web App
- **Animations**: Fade-in, slide-in, and scale-in effects

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

### Prerequisites
- Node.js v18 or higher
- PostgreSQL database (for production)
- Azure Communication Service (optional, for emails)

### Build Frontend
```bash
cd frontend
npm run build
```

### Configure Backend for Production
1. Set `NODE_ENV=production` in your environment
2. Configure `DATABASE_URL` with your PostgreSQL connection string
3. Set a strong `JWT_SECRET`
4. (Optional) Configure Azure Communication Service

### Start Backend
```bash
cd backend
npm start
```

The backend will:
- Connect to PostgreSQL database
- Create default admin user if not exists
- Start server on configured port

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

## 🎯 Recent Enhancements

- ✅ Database integration (SQLite for dev, PostgreSQL for production)
- ✅ Email notifications via Azure Communication Service
- ✅ Modern gradient UI design with animations
- ✅ Automatic default user creation on startup
- Additional ERP modules (Inventory, CRM, Accounting)
- Audit logging
- Multi-language support
- Dark mode
- Advanced reporting
- Multi-language support
- Dark mode
