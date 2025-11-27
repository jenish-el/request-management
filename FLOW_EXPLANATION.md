# Complete System Flow Explanation

## 📋 Table of Contents
1. [What is manager_id and Why is it Needed?](#what-is-manager_id)
2. [Where to Add manager_id](#where-to-add-manager_id)
3. [Complete Flow Diagrams](#complete-flow)
4. [Step-by-Step Examples](#step-by-step-examples)

---

## 🔍 What is manager_id and Why is it Needed?

### In the User Table:
- **`manager_id`** in the `User` table links an **Employee** to their **Manager**
- It creates a hierarchical relationship: `Manager` → `Employee`
- **Managers** have `manager_id = null` (they don't have a manager)
- **Employees** have `manager_id = <manager's user id>` (they report to a manager)

### In the Request Table:
- **`manager_id`** in the `Request` table stores which manager approved/rejected the request
- It's set to `null` when a request is created
- It's automatically set when a manager approves or rejects a request
- This allows tracking which manager handled each request

### Why It's Needed:
1. **Authorization**: Only the assigned employee's manager can approve/reject requests
2. **Tracking**: Know which manager reviewed each request
3. **Filtering**: Managers can see requests for their employees
4. **Hierarchy**: Maintains the organizational structure

---

## 📍 Where to Add manager_id

### 1. **During Employee Registration** (Frontend)
Location: `frontend/src/components/Register.tsx`

**Current Implementation:**
- The form shows a "Manager ID" field **only when role is Employee**
- Manager ID is optional (can be left empty)
- If provided, it must be a valid manager's user ID

**Code Location:**
```typescript
// Lines 91-102 in Register.tsx
{formData.role === UserRole.EMPLOYEE && (
  <div className="form-group">
    <label>Manager ID (Optional)</label>
    <input
      type="number"
      name="manager_id"
      value={formData.manager_id}
      onChange={handleChange}
      placeholder="Enter manager ID"
    />
  </div>
)}
```

### 2. **During Manager Registration**
- **Managers should NOT have a manager_id**
- The form automatically hides the manager_id field when role is "Manager"
- Backend sets `manager_id = null` for managers

### 3. **In Request Creation** (Automatic)
- When creating a request, `manager_id` is **NOT** set initially
- It's automatically set when a manager approves/rejects the request
- The system uses the assigned employee's `manager_id` to find their manager

---

## 🔄 Complete Flow

### Flow 1: Creating a Manager

```
┌─────────────────────────────────────────────────────────┐
│ Step 1: User fills registration form                   │
│ - Name: "John Manager"                                  │
│ - Email: "john@example.com"                             │
│ - Password: "password123"                               │
│ - Role: "Manager"                                       │
│ - manager_id field: HIDDEN (not shown)                 │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│ Step 2: Frontend sends request                         │
│ POST /api/auth/register                                 │
│ {                                                       │
│   name: "John Manager",                                 │
│   email: "john@example.com",                            │
│   password: "password123",                               │
│   role: "manager",                                      │
│   manager_id: null  ← Automatically set to null         │
│ }                                                       │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│ Step 3: Backend validates                              │
│ - Email is unique ✓                                     │
│ - manager_id is null (correct for manager) ✓           │
│ - Password is hashed                                    │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│ Step 4: User created in database                       │
│ users table:                                            │
│ {                                                       │
│   id: 1,                                                │
│   name: "John Manager",                                 │
│   email: "john@example.com",                            │
│   role: "manager",                                       │
│   manager_id: null  ← No manager                       │
│ }                                                       │
└─────────────────────────────────────────────────────────┘
```

### Flow 2: Creating an Employee

```
┌─────────────────────────────────────────────────────────┐
│ Step 1: User fills registration form                   │
│ - Name: "Jane Employee"                                 │
│ - Email: "jane@example.com"                             │
│ - Password: "password123"                               │
│ - Role: "Employee"                                      │
│ - Manager ID: "1"  ← ID of John Manager (from above)   │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│ Step 2: Frontend sends request                         │
│ POST /api/auth/register                                 │
│ {                                                       │
│   name: "Jane Employee",                                │
│   email: "jane@example.com",                            │
│   password: "password123",                               │
│   role: "employee",                                     │
│   manager_id: 1  ← John Manager's ID                    │
│ }                                                       │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│ Step 3: Backend validates                              │
│ - Email is unique ✓                                     │
│ - manager_id = 1 exists? ✓                             │
│ - User with ID 1 is a manager? ✓                       │
│ - Password is hashed                                    │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│ Step 4: User created in database                       │
│ users table:                                            │
│ {                                                       │
│   id: 2,                                                │
│   name: "Jane Employee",                                │
│   email: "jane@example.com",                            │
│   role: "employee",                                      │
│   manager_id: 1  ← Links to John Manager                │
│ }                                                       │
└─────────────────────────────────────────────────────────┘
```

### Flow 3: Creating and Assigning a Request

```
┌─────────────────────────────────────────────────────────┐
│ Step 1: Employee creates a request                     │
│ - Title: "Fix bug in login page"                       │
│ - Description: "Users cannot login..."                  │
│ - Assign To: User ID "2" (Jane Employee)                │
│ - Created By: User ID "1" (John Manager)               │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│ Step 2: Frontend sends request                         │
│ POST /api/requests                                      │
│ Authorization: Bearer <token>                           │
│ {                                                       │
│   title: "Fix bug in login page",                      │
│   description: "Users cannot login...",                 │
│   assigned_to: 2  ← Jane Employee's ID                  │
│ }                                                       │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│ Step 3: Backend validates                              │
│ - Assigned user (ID 2) exists? ✓                       │
│ - Cannot assign to self? ✓                             │
│ - Creates request with:                                 │
│   * created_by: 1 (John Manager)                       │
│   * assigned_to: 2 (Jane Employee)                      │
│   * status: "pending"                                    │
│   * manager_id: null  ← Not set yet!                    │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│ Step 4: Request created in database                    │
│ requests table:                                         │
│ {                                                       │
│   id: 1,                                                │
│   title: "Fix bug in login page",                      │
│   description: "Users cannot login...",                 │
│   created_by: 1,                                        │
│   assigned_to: 2,                                       │
│   status: "pending",                                     │
│   manager_approval: null,                               │
│   manager_id: null  ← Will be set on approval          │
│ }                                                       │
└─────────────────────────────────────────────────────────┘
```

### Flow 4: Manager Approval Flow

```
┌─────────────────────────────────────────────────────────┐
│ Step 1: Manager views pending requests                 │
│ GET /api/requests                                       │
│ - System finds all requests where:                      │
│   * assigned_to employee has manager_id = current user  │
│   * OR manager_id = current user (already reviewed)    │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│ Step 2: Manager approves request                       │
│ POST /api/requests/1/approve                           │
│ Authorization: Bearer <manager_token>                   │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│ Step 3: Backend validates authorization                │
│ - Request exists? ✓                                     │
│ - Assigned user (ID 2) exists? ✓                       │
│ - Assigned user's manager_id = current manager? ✓      │
│   (Jane's manager_id = 1, current user = 1) ✓          │
│ - Request not already reviewed? ✓                      │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│ Step 4: Request updated in database                    │
│ requests table (ID 1):                                  │
│ {                                                       │
│   id: 1,                                                │
│   title: "Fix bug in login page",                      │
│   status: "approved",                                    │
│   manager_approval: true,                               │
│   manager_id: 1  ← NOW SET! (Manager's ID)             │
│ }                                                       │
└─────────────────────────────────────────────────────────┘
```

---

## 📝 Step-by-Step Examples

### Example 1: Complete Setup from Scratch

#### Step 1: Create First Manager
```
Registration Form:
- Name: "Alice Manager"
- Email: "alice@company.com"
- Password: "SecurePass123"
- Role: Manager
- Manager ID: (field hidden)

Result:
- User ID: 1
- Role: manager
- manager_id: null
```

#### Step 2: Create Employee Under Alice
```
Registration Form:
- Name: "Bob Employee"
- Email: "bob@company.com"
- Password: "SecurePass123"
- Role: Employee
- Manager ID: 1  ← Alice's ID

Result:
- User ID: 2
- Role: employee
- manager_id: 1  ← Links to Alice
```

#### Step 3: Create Another Employee Under Alice
```
Registration Form:
- Name: "Charlie Employee"
- Email: "charlie@company.com"
- Password: "SecurePass123"
- Role: Employee
- Manager ID: 1  ← Alice's ID

Result:
- User ID: 3
- Role: employee
- manager_id: 1  ← Also links to Alice
```

#### Step 4: Bob Creates a Request for Charlie
```
Request Form:
- Title: "Update documentation"
- Description: "Need to update API docs"
- Assign To: 3  ← Charlie's ID

Result:
- Request ID: 1
- created_by: 2 (Bob)
- assigned_to: 3 (Charlie)
- status: pending
- manager_id: null  ← Not set yet
```

#### Step 5: Alice Approves the Request
```
Alice (Manager ID: 1) approves Request ID: 1

System checks:
- Request assigned_to = 3 (Charlie)
- Charlie's manager_id = 1 (Alice) ✓
- Alice can approve ✓

Result:
- Request ID: 1
- status: approved
- manager_approval: true
- manager_id: 1  ← NOW SET to Alice's ID
```

---

## 🔑 Key Points to Remember

### For Managers:
1. ✅ **Never** provide a manager_id when registering
2. ✅ manager_id is automatically set to `null`
3. ✅ Can approve/reject requests for their employees
4. ✅ Can see all requests assigned to their employees

### For Employees:
1. ✅ **Should** provide their manager's user ID when registering
2. ✅ manager_id links them to their manager
3. ✅ Can create requests and assign to other users
4. ✅ Can only update requests assigned to them (after approval)

### For Requests:
1. ✅ manager_id starts as `null` when created
2. ✅ manager_id is automatically set when manager approves/rejects
3. ✅ Only the assigned employee's manager can approve
4. ✅ System uses `assigned_to` employee's `manager_id` to find the manager

---

## 🐛 Common Issues and Solutions

### Issue 1: "Manager not found" error
**Cause**: Employee provided a manager_id that doesn't exist
**Solution**: Check that the manager_id is a valid user ID

### Issue 2: "Specified user is not a manager" error
**Cause**: Employee provided a manager_id that belongs to another employee
**Solution**: Make sure the manager_id belongs to a user with role "manager"

### Issue 3: "You are not authorized to approve this request"
**Cause**: Manager trying to approve a request for an employee they don't manage
**Solution**: The request's assigned employee must have manager_id = current manager's ID

### Issue 4: Manager registration fails with "Manager ID must be an integer"
**Cause**: Frontend sending manager_id: null (now fixed!)
**Solution**: Already fixed - validator now accepts null for managers

---

## 📊 Database Relationships

```
User (Manager)
├── id: 1
├── role: "manager"
└── manager_id: null
    │
    ├── User (Employee 1)
    │   ├── id: 2
    │   ├── role: "employee"
    │   └── manager_id: 1  ← Points to Manager
    │
    └── User (Employee 2)
        ├── id: 3
        ├── role: "employee"
        └── manager_id: 1  ← Points to Manager

Request
├── id: 1
├── created_by: 2 (Employee 1)
├── assigned_to: 3 (Employee 2)
├── manager_id: 1  ← Set when Manager approves
└── status: "approved"
```

---

## 🎯 Summary

1. **manager_id in User**: Links employees to their manager (null for managers)
2. **manager_id in Request**: Tracks which manager approved/rejected (set on approval)
3. **Registration**: Managers don't need manager_id, Employees should provide it
4. **Request Creation**: manager_id is null initially, set on approval
5. **Authorization**: System uses employee's manager_id to determine who can approve

This creates a clear hierarchy: **Manager → Employee → Request** with proper authorization at each level.

