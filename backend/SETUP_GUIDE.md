# Setup Guide - Troubleshooting Database Connection

## Common Error: P1000 - Can't reach database server

If you see this error, follow these steps:

### Step 1: Check PostgreSQL is Running

**Windows:**
```powershell
# Check if PostgreSQL service is running
Get-Service -Name postgresql*

# If not running, start it
Start-Service -Name postgresql-x64-XX  # Replace XX with your version
```

**Linux/Mac:**
```bash
# Check if PostgreSQL is running
sudo systemctl status postgresql

# If not running, start it
sudo systemctl start postgresql
```

### Step 2: Verify .env File Exists

1. Copy `ENV_TEMPLATE.txt` to `.env`:
   ```bash
   # Windows PowerShell
   Copy-Item ENV_TEMPLATE.txt .env
   
   # Linux/Mac
   cp ENV_TEMPLATE.txt .env
   ```

2. Edit `.env` and set your `DATABASE_URL`:
   ```env
   DATABASE_URL="postgresql://postgres:your_password@localhost:5432/employee_request_db?schema=public"
   ```

### Step 3: Create the Database

Connect to PostgreSQL and create the database:

```sql
-- Connect to PostgreSQL (default user is usually 'postgres')
-- Windows: psql -U postgres
-- Linux/Mac: sudo -u postgres psql

CREATE DATABASE employee_request_db;
```

### Step 4: Run Prisma Migrations

```bash
# Generate Prisma Client
npm run prisma:generate

# Create and apply migrations
npm run prisma:migrate
```

### Step 5: Verify Connection

Test the connection:
```bash
npm run dev
```

You should see: `✅ Database connected successfully`

## Quick Setup Commands

```bash
# 1. Install dependencies
npm install

# 2. Create .env file (copy from template)
# Windows: Copy-Item ENV_TEMPLATE.txt .env
# Linux/Mac: cp ENV_TEMPLATE.txt .env

# 3. Edit .env and set DATABASE_URL with your credentials

# 4. Create database in PostgreSQL
# psql -U postgres
# CREATE DATABASE employee_request_db;

# 5. Generate Prisma Client and run migrations
npm run prisma:generate
npm run prisma:migrate

# 6. Start the server
npm run dev
```

## DATABASE_URL Format

```
postgresql://USERNAME:PASSWORD@HOST:PORT/DATABASE_NAME?schema=public
```

**Examples:**

- Default PostgreSQL:
  ```
  postgresql://postgres:postgres@localhost:5432/employee_request_db?schema=public
  ```

- Custom user:
  ```
  postgresql://myuser:mypassword@localhost:5432/employee_request_db?schema=public
  ```

- Remote database:
  ```
  postgresql://user:pass@example.com:5432/employee_request_db?schema=public
  ```

## Still Having Issues?

1. **Check PostgreSQL port**: Default is 5432, but yours might be different
2. **Check credentials**: Make sure username and password are correct
3. **Check database exists**: The database must exist before running migrations
4. **Check firewall**: Make sure PostgreSQL port is not blocked
5. **Check Prisma Client**: Run `npm run prisma:generate` after schema changes

## Useful Commands

```bash
# View database in Prisma Studio (GUI)
npm run prisma:studio

# Check Prisma connection
npx prisma db pull

# Reset database (WARNING: deletes all data)
npx prisma migrate reset
```

