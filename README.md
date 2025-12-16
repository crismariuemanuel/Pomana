# Fundraise Frontend

Fundraising web application built with Angular and Angular Material. Provides a modern UI for browsing campaigns, submitting donations, managing user authentication, and administrative features.

## Project Structure

```
src/app/
├── core/                    # Core functionality and shared services
│   ├── auth/               # Authentication module
│   │   ├── auth.service.ts          # Authentication service (login, register, logout)
│   │   ├── auth.guard.ts            # Route guard for authenticated routes
│   │   ├── admin.guard.ts           # Route guard for admin-only routes
│   │   └── auth.interceptor.ts      # HTTP interceptor for JWT tokens
│   └── causes/             # Causes service
│       └── causes.service.ts        # Service for fetching cause data
│
├── features/               # Feature modules (organized by functionality)
│   ├── home/               # Home page
│   │   └── home.component.ts
│   ├── auth/               # Authentication pages
│   │   ├── login/          # Login page
│   │   └── register/       # Registration page
│   ├── add-cause/          # Add new cause page (authenticated)
│   │   └── add-cause.component.ts
│   ├── cause-details/     # Cause details page
│   │   └── cause-details.component.ts
│   ├── all-causes/        # All causes listing page
│   │   └── all-causes.component.ts
│   └── admin/             # Admin features
│       └── develop/       # Development page (admin only)
│           └── develop.component.ts
│
├── shared/                # Shared components
│   └── components/
│       └── cause-card/     # Reusable cause card component
│
├── environments/          # Environment configuration
│   ├── environment.ts     # Development environment
│   └── environment.prod.ts # Production environment
│
├── app.routes.ts         # Application routes configuration
├── app.config.ts         # Application configuration
├── app.ts                # Root component
└── app.html              # Root component template
```

## Features

### Authentication
- **User Registration**: Create new user accounts
- **User Login**: Authenticate with email and password
- **JWT Token Management**: Automatic token handling via HTTP interceptor
- **Route Protection**: Guards for authenticated and admin-only routes
- **Session Management**: Persistent login state using localStorage

### Cause Management
- **Browse Causes**: View all available causes on home page
- **Cause Details**: View detailed information about a specific cause
- **Add Cause**: Create new causes (authenticated users only)
- **Delete Cause**: Remove causes (authenticated users only)
- **Progress Tracking**: Visual progress bars for fundraising goals

### User Roles
- **Regular Users**: Can browse, view details, and add causes
- **Admin Users**: Additional access to admin panel and development features

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Backend API running (see backend README)

## Installation

1. Install dependencies:
```bash
npm install
```

## Development

Start the development server:
```bash
npm start
```

The application will be available at `http://localhost:4200`

## Production Build

Build for production:
```bash
npm run build
```

The production build will be in the `dist/` directory.

## Testing

Run unit tests:
```bash
npm test
```

## Routes

| Route | Component | Access |
|-------|-----------|--------|
| `/` | HomeComponent | Public |
| `/login` | LoginComponent | Public |
| `/register` | RegisterComponent | Public |
| `/add-cause` | AddCauseComponent | Authenticated |
| `/cause/:id` | CauseDetailsComponent | Public |
| `/all-causes` | AllCausesComponent | Public |
| `/develop` | DevelopComponent | Admin only |

```


## Project Scripts

- `npm start`: Start development server
- `npm run build`: Build for production
- `npm test`: Run unit tests
- `ng generate component component-name`: Generate new component

