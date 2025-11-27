# Quick Start Guide

## Prerequisites Check

- ✅ Node.js installed (v18+)
- ✅ PostgreSQL installed and running
- ✅ Database created: `employee_request_db`

## Step-by-Step Setup

### 1. Install Dependencies

```bash
# Install root dependencies (concurrently)
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

Or use the convenience script:
```bash
npm run install:all
```

### 2. Configure Backend

1. Create `backend/.env` file:
   ```bash
   cd backend
   cp ENV_TEMPLATE.txt .env
   ```

2. Edit `backend/.env` and update:
   ```env
   DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/employee_request_db?schema=public"
   JWT_SECRET="your-super-secret-key-change-this"
   ```

### 3. Set Up Database

```bash
cd backend

# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run prisma:migrate
```

### 4. Start the Application

**Option 1: Run both together (recommended)**
```bash
# From root directory
npm run dev
```

**Option 2: Run separately**

Terminal 1 (Backend):
```bash
cd backend
npm run dev
```

Terminal 2 (Frontend):
```bash
cd frontend
npm run dev
```

### 5. Access the Application

- **Frontend UI**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **API Health Check**: http://localhost:3000/api/health

## First Steps

1. **Register a Manager:**
   - Go to http://localhost:5173/register
   - Fill in details, select "Manager" role
   - Note the User ID (you'll need it for employees)

2. **Register an Employee:**
   - Go to http://localhost:5173/register
   - Fill in details, select "Employee" role
   - Enter the Manager ID from step 1

3. **Create a Request:**
   - Login as an Employee
   - Click "Create New Request"
   - Assign to another user (use their User ID)

4. **Approve Request:**
   - Login as the Manager
   - View requests assigned to your employees
   - Click "Approve" or "Reject"

5. **Work on Request:**
   - Login as the assigned Employee
   - View "Assigned to Me" tab
   - Once approved, click "Start Work"
   - After completing, click "Close Request"

## Troubleshooting

### Database Connection Error

- Check PostgreSQL is running
- Verify DATABASE_URL in `backend/.env`
- Ensure database exists: `CREATE DATABASE employee_request_db;`
- Run migrations: `cd backend && npm run prisma:migrate`

### Port Already in Use

- Backend (3000): Change `PORT` in `backend/.env`
- Frontend (5173): Change in `frontend/vite.config.ts`

### CORS Errors

- Ensure `FRONTEND_URL` in `backend/.env` matches frontend URL
- Default: `FRONTEND_URL=http://localhost:5173`

## Useful Commands

```bash
# View database in Prisma Studio
cd backend
npm run prisma:studio

# Reset database (WARNING: deletes all data)
cd backend
npx prisma migrate reset

# Check Prisma connection
cd backend
npx prisma db pull
```

## Need Help?

Check the main [README.md](./README.md) for detailed documentation.

