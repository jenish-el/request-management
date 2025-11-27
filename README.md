# Employee Request Management System

A full-stack application for managing employee requests with role-based access control, built with Node.js, Express, TypeScript, PostgreSQL, Prisma ORM, and React.

## Features

- **Authentication & Authorization**: JWT-based authentication with role-based access control (Employee & Manager)
- **Request Management**: Create, assign, approve/reject, and close requests with proper business logic
- **Modern UI**: Beautiful React frontend with responsive design
- **Code Quality**: Clean architecture with separation of concerns (Repository, Service, Controller pattern)
- **Validation**: Comprehensive input validation using express-validator
- **Logging & Monitoring**: Winston-based logging with daily rotation and request/error tracking
- **Security**: Helmet, CORS, rate limiting, and password hashing
- **Type Safety**: Full TypeScript implementation across frontend and backend
- **ORM**: Prisma ORM for type-safe database access

## Business Logic

1. **Employee A** creates a request and assigns it to **Employee B**
2. **Employee B's Manager** can approve or reject the request
3. **Employee B** can only action and close the request once it's approved by their manager

## Project Structure

```
.
├── backend/          # Backend API (Express + TypeScript + Prisma)
│   ├── src/
│   ├── prisma/
│   └── package.json
├── frontend/         # Frontend UI (React + TypeScript + Vite)
│   ├── src/
│   └── package.json
└── package.json      # Root package.json with workspace scripts
```

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Installation

### 1. Install All Dependencies

```bash
npm run install:all
```

Or install separately:

```bash
# Backend
cd backend
npm install

# Frontend
cd frontend
npm install
```

### 2. Set Up Backend

1. **Create PostgreSQL database:**
   ```sql
   CREATE DATABASE employee_request_db;
   ```

2. **Configure environment variables:**
   
   Create `backend/.env` file:
   ```env
   DATABASE_URL="postgresql://postgres:your_password@localhost:5432/employee_request_db?schema=public"
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRES_IN=24h
   PORT=3000
   NODE_ENV=development
   FRONTEND_URL=http://localhost:5173
   LOG_LEVEL=info
   LOG_DIR=./logs
   ```

3. **Run database migrations:**
   ```bash
   cd backend
   npm run prisma:generate
   npm run prisma:migrate
   ```

### 3. Set Up Frontend

The frontend is configured to proxy API requests to `http://localhost:3000`. No additional configuration needed unless you want to change the API URL.

Create `frontend/.env` (optional):
```env
VITE_API_URL=http://localhost:3000/api
```

## Running the Application

### Development Mode (Both Frontend and Backend)

From the root directory:
```bash
npm run dev
```

This will start:
- Backend API on `http://localhost:3000`
- Frontend UI on `http://localhost:5173`

### Run Separately

**Backend only:**
```bash
cd backend
npm run dev
```

**Frontend only:**
```bash
cd frontend
npm run dev
```

### Production Build

```bash
# Build both
npm run build

# Or separately
npm run build:backend
npm run build:frontend
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get current user profile (requires authentication)

### Requests

- `POST /api/requests` - Create a new request (requires authentication)
- `GET /api/requests` - Get all requests (filtered by role)
- `GET /api/requests/my-requests` - Get requests created by current user
- `GET /api/requests/assigned` - Get requests assigned to current user
- `GET /api/requests/:id` - Get a specific request
- `POST /api/requests/:id/approve` - Approve a request (Manager only)
- `POST /api/requests/:id/reject` - Reject a request (Manager only)
- `PUT /api/requests/:id` - Update a request (Assigned employee only, after approval)

### Health Check

- `GET /api/health` - Server health check

## Usage Guide

### 1. Register Users

1. **Register a Manager:**
   - Go to `/register`
   - Fill in name, email, password
   - Select "Manager" role
   - Register

2. **Register an Employee:**
   - Go to `/register`
   - Fill in name, email, password
   - Select "Employee" role
   - Optionally enter Manager ID (the manager you registered)
   - Register

### 2. Create a Request

1. Login as an Employee
2. Click "Create New Request"
3. Fill in title, description, and assign to another user (by User ID)
4. Submit

### 3. Approve/Reject Request (Manager)

1. Login as a Manager
2. View requests assigned to your employees
3. Click "Approve" or "Reject"

### 4. Work on Request (Employee)

1. Login as the assigned Employee
2. View "Assigned to Me" tab
3. Once approved, click "Start Work"
4. After completing, click "Close Request"

## Development

### Backend Commands

```bash
cd backend

# Development with auto-reload
npm run dev

# Generate Prisma Client
npm run prisma:generate

# Create and apply migrations
npm run prisma:migrate

# Open Prisma Studio (database GUI)
npm run prisma:studio

# Build
npm run build

# Start production
npm start
```

### Frontend Commands

```bash
cd frontend

# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Environment Variables

### Backend (.env)

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 3000 |
| `NODE_ENV` | Environment | development |
| `DATABASE_URL` | PostgreSQL connection string | (required) |
| `JWT_SECRET` | JWT secret key | (required) |
| `JWT_EXPIRES_IN` | JWT expiration | 24h |
| `FRONTEND_URL` | Frontend URL for CORS | http://localhost:5173 |
| `LOG_LEVEL` | Logging level | info |
| `LOG_DIR` | Log directory | ./logs |

**DATABASE_URL Format:**
```
postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public
```

### Frontend (.env - optional)

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | http://localhost:3000/api |

## Technology Stack

### Backend
- Node.js + Express
- TypeScript
- PostgreSQL
- Prisma ORM
- JWT Authentication
- Winston Logging

### Frontend
- React 18
- TypeScript
- Vite
- React Router
- Axios
- CSS3

## Security Features

- Password hashing with bcryptjs
- JWT token-based authentication
- Role-based authorization
- Rate limiting
- Helmet for security headers
- CORS configuration
- Input validation and sanitization

## Logging

Backend logs are stored in `backend/logs/` directory:
- `combined-YYYY-MM-DD.log` - All logs
- `error-YYYY-MM-DD.log` - Error logs only

Logs are rotated daily and kept for 14 days.

## License

ISC
