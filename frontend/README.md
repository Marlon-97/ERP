# ERP Frontend

Vue 3 + Vite frontend for the modular ERP system with PWA support.

## Features

- **Vue 3 Composition API**: Modern Vue.js development
- **Vite**: Fast build tool and dev server
- **Tailwind CSS**: Utility-first CSS framework with Manrope font
- **Pinia**: State management for authentication
- **Vue Router**: Client-side routing with guards
- **Heroicons**: Beautiful hand-crafted SVG icons
- **PWA**: Progressive Web App support for offline capability

## Getting Started

### Installation

```bash
npm install
```

### Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
frontend/
├── public/              # Static assets
├── src/
│   ├── api/            # API service layer
│   ├── components/     # Reusable components
│   │   └── layout/    # Layout components
│   ├── router/         # Vue Router configuration
│   ├── stores/         # Pinia stores (state management)
│   ├── views/          # Page components
│   ├── App.vue         # Root component
│   ├── main.js         # App entry point
│   └── style.css       # Global styles with Tailwind
├── index.html
├── vite.config.js      # Vite configuration with PWA
└── tailwind.config.js  # Tailwind configuration
```

## Available Views

- **Login**: User authentication
- **Dashboard**: Landing page with system overview
- **Users**: User management (CRUD operations)
- **Roles**: Role management with permission assignment

## Authentication

The frontend uses JWT token-based authentication:
- Tokens are stored in localStorage
- Protected routes require authentication
- Permission-based UI rendering

## PWA Configuration

The app is configured as a Progressive Web App:
- Service worker for offline support
- Web app manifest for installability
- Optimized caching strategies

## Styling

- **Framework**: Tailwind CSS v4
- **Font**: Manrope from Google Fonts
- **Icons**: Heroicons v2

## Environment Variables

Create a `.env` file to override defaults:

```
VITE_API_URL=http://localhost:3000/api
```

## API Integration

All API calls go through the centralized API service (`src/api/index.js`):
- Automatic token injection
- Error handling
- Centralized endpoint management
