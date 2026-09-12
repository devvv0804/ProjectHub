# 🚀 ProjectHub Backend

> A RESTful backend API for a collaborative project management platform built with Node.js, Express.js, MongoDB, Mongoose, and JWT-based authentication.

## 📌 About

**ProjectHub** is a backend application for collaborative project management.

The system is being developed incrementally with a focus on learning and implementing real-world backend engineering concepts such as:

* REST API design
* Authentication and authorization
* MongoDB data modeling
* Mongoose relationships
* Middleware
* Request validation
* Centralized error handling
* Project and team management
* Role-based access control
* Task and subtask management
* Project notes
* Secure email workflows

The project follows a modular architecture where models, controllers, routes, validators, middleware, and utilities are separated into dedicated modules.

---

## 🛠️ Tech Stack

| Technology            | Purpose                             |
| --------------------- | ----------------------------------- |
| **Node.js**           | JavaScript runtime                  |
| **Express.js 5**      | REST API framework                  |
| **MongoDB**           | Database                            |
| **Mongoose**          | MongoDB ODM and schema modeling     |
| **JWT**               | Authentication and token management |
| **bcrypt**            | Password hashing                    |
| **Express Validator** | Request validation                  |
| **Nodemailer**        | Email delivery                      |
| **Mailgen**           | Email template generation           |
| **Cookie Parser**     | Cookie handling                     |
| **CORS**              | Cross-origin request handling       |
| **dotenv**            | Environment configuration           |
| **Nodemon**           | Development workflow                |
| **Prettier**          | Code formatting                     |

The current project configuration uses ES modules and runs from `src/index.js`.

---

# ✨ Current Features

## 🔐 Authentication

The authentication system includes:

* User registration
* User login
* JWT access token generation
* JWT refresh token generation
* Password hashing using bcrypt
* Password verification
* Protected routes using authentication middleware
* Logout
* Current-user retrieval
* Password change
* Email verification
* Forgot-password workflow
* Reset-password workflow
* Resending email verification
* Temporary token generation
* SHA-256 hashing of temporary tokens
* Token expiration handling

---

## ✅ Request Validation

Request validation is implemented using **Express Validator**.

Validation is separated from controllers using reusable validator functions and centralized validation middleware.

Current validation includes:

* Email validation
* Required fields
* Username validation
* Username lowercase enforcement
* Username length validation
* Password validation
* Password-change validation
* Forgot-password validation
* Reset-password validation

### Request Flow

```text
Client Request
      ↓
   Validator
      ↓
Validation Middleware
      ↓
   Controller
      ↓
   Database
      ↓
 API Response
```

---

# 🔑 Authentication Architecture

ProjectHub uses a dual-token JWT authentication architecture.

### Access Token

The access token contains basic user information such as:

```text
_id
email
username
```

The token is signed using a dedicated access-token secret and expiration configuration.

### Refresh Token

The refresh token contains the user's `_id` and uses a separate secret and expiration configuration.

This allows the application to issue a new access token without requiring the user to authenticate again.

```text
User Login
    │
    ▼
Validate Credentials
    │
    ▼
Generate Access Token
    │
    ├──────────────► Client
    │
    ▼
Generate Refresh Token
    │
    └──────────────► Client
                         │
                         ▼
                  Access Token Expires
                         │
                         ▼
                  Refresh Token
                         │
                         ▼
                Generate New Access Token
```

---

# 🔒 Password Security

Passwords are never stored directly in the database.

```text
Plain Password
      ↓
    bcrypt
      ↓
Password Hash
      ↓
   MongoDB
```

During authentication:

```text
Entered Password
      ↓
bcrypt.compare()
      ↓
Stored Password Hash
      ↓
Authentication Result
```

Password hashing is handled through a Mongoose `pre("save")` hook.

---

# 🔐 Temporary Token Security

Temporary tokens are used for workflows such as:

* Email verification
* Password reset

The application generates a secure random token and stores a hashed representation.

```text
Secure Random Token
        ↓
     SHA-256
        ↓
  Hashed Token
        ↓
     MongoDB
```

The original token is sent to the user through the appropriate email link.

Temporary tokens also have expiration handling to limit their lifetime.

---

# 📧 Email System

Email functionality uses:

* **Nodemailer** for sending emails
* **Mailgen** for generating email content

### Email Verification

```text
User Registration
       ↓
Generate Verification Token
       ↓
Generate Verification URL
       ↓
Send Email
       ↓
User Verifies Account
```

### Password Reset

```text
Forgot Password
       ↓
Generate Temporary Token
       ↓
Generate Reset URL
       ↓
Send Email
       ↓
User Resets Password
```

---

# 📁 Project Architecture

The backend follows a modular structure:

```text
ProjectHub/
│
├── src/
│   │
│   ├── controllers/
│   │   ├── auth.controllers.js
│   │   ├── healthcheck.controller.js
│   │   └── project.controller.js
│   │
│   ├── db/
│   │
│   ├── middlewares/
│   │
│   ├── models/
│   │   ├── user.model.js
│   │   ├── project.models.js
│   │   ├── projectmember.models.js
│   │   ├── tasks.models.js
│   │   ├── subtask.models.js
│   │   └── note.models.js
│   │
│   ├── routes/
│   │   ├── auth.routes.js
│   │   └── healthCheck.routes.js
│   │
│   ├── utils/
│   │
│   ├── validators/
│   │
│   ├── app.js
│   └── index.js
│
├── PRD.md
├── package.json
├── package-lock.json
└── README.md
```

The repository currently separates controllers, database code, middleware, models, routes, utilities, and validators under `src`.

---

# 📂 Database Models

The current backend contains the following major Mongoose models:

## User

Stores user account information and authentication-related data.

```text
User
```

---

## Project

Represents a collaborative project.

```text
Project
├── name
├── description
└── createdBy → User
```

Each project records the user who created it.

---

## ProjectMember

Connects users with projects and stores their project-specific role.

```text
ProjectMember
├── user → User
├── project → Project
└── role
```

This acts as a relationship/bridge collection between users and projects.

Conceptually:

```text
User
  │
  │
  ▼
ProjectMember
  │
  │
  ▼
Project
```

This allows a user to participate in multiple projects and a project to contain multiple users.

---

## Task

Tasks belong to projects and can optionally be assigned to users.

```text
Task
├── title
├── description
├── project → Project
├── assignedTo → User
├── assignedBy → User
├── status
└── attachments
```

---

## SubTask

Subtasks belong to a parent task.

```text
SubTask
├── title
├── task → Task
├── isCompleted
└── createdBy → User
```

Relationship:

```text
Project
   ↓
 Task
   ↓
SubTask
```

---

## Project Note

Project notes belong to a project and contain textual content.

```text
Project
   ↓
Project Note
   └── content
```

---

# 👥 Project Management

Project management functionality has now moved beyond the schema stage.

The project controller currently handles operations including:

* Creating projects
* Listing projects available to the authenticated user
* Fetching an individual project
* Updating project information
* Deleting projects
* Adding users to projects
* Listing project members
* Updating member roles
* Removing project members

The project listing logic also uses MongoDB aggregation to retrieve projects associated with the current user and calculate project member counts.

### Project Membership

```text
User
  │
  ├──────────────┐
  │              │
  ▼              ▼
Project 1      Project 2
  │
  ├── Member A
  ├── Member B
  └── Member C
```

---

# 👤 Role-Based Access Control

The project architecture defines three primary roles:

| Role            | Purpose                                    |
| --------------- | ------------------------------------------ |
| `admin`         | System/project-level administrative access |
| `project_admin` | Administrative access within a project     |
| `member`        | Basic project access                       |

Roles are stored in the `ProjectMember` relationship rather than directly on the project itself.

This allows a user to have different roles across different projects.

For example:

```text
User A
│
├── Project 1 → admin
├── Project 2 → project_admin
└── Project 3 → member
```

---

# 📋 Task Status

The task architecture uses a predefined status system:

```text
todo
in_progress
done
```

These values are maintained through reusable application constants to prevent inconsistent status values.

---

# 🛡️ Error & Response Handling

ProjectHub uses standardized response and error classes.

## ApiError

Application errors follow a consistent structure:

```json
{
  "statusCode": 404,
  "success": false,
  "message": "User does not exist",
  "errors": []
}
```

## ApiResponse

Successful responses follow a consistent structure:

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Success",
  "data": {}
}
```

This provides a consistent API response format across controllers.

---

# ⚡ Async Error Handling

Asynchronous controllers are wrapped using a reusable `asyncHandler`.

Instead of repeatedly writing:

```javascript
try {
  // controller logic
} catch (error) {
  next(error);
}
```

controllers can be wrapped using `asyncHandler`, allowing rejected promises to be forwarded to Express's centralized error-handling pipeline.

---

# 🔌 API Routes

## Authentication

Base URL:

```text
/api/v1/auth
```

| Method | Endpoint                           | Purpose                   |
| ------ | ---------------------------------- | ------------------------- |
| POST   | `/register`                        | Register a user           |
| POST   | `/login`                           | Login                     |
| POST   | `/logout`                          | Logout                    |
| POST   | `/current-user`                    | Get current user          |
| POST   | `/change-password`                 | Change password           |
| POST   | `/refresh-token`                   | Refresh access token      |
| GET    | `/verify-email/:verificationToken` | Verify email              |
| POST   | `/forgot-password`                 | Request password reset    |
| POST   | `/reset-password/:resetToken`      | Reset password            |
| POST   | `/resend-email-verification`       | Resend verification email |

## Health Check

Base URL:

```text
/api/v1/healthcheck
```

| Method | Endpoint | Purpose          |
| ------ | -------- | ---------------- |
| GET    | `/`      | Check API health |

---

# 🚧 Development Status

The project is being developed incrementally.

### Authentication

* [x] User schema
* [x] Password hashing
* [x] Password verification
* [x] JWT access-token generation
* [x] JWT refresh-token generation
* [x] Request validation
* [x] Authentication route structure
* [x] Temporary token generation
* [x] Email service architecture
* [x] Email verification architecture
* [x] Password reset architecture

### Project Management

* [x] Project schema
* [x] Project controller
* [x] Project creation
* [x] Project listing
* [x] Project details
* [x] Project update
* [x] Project deletion
* [x] Project membership model
* [x] Add project members
* [x] List project members
* [x] Update member roles
* [x] Remove project members
* [ ] Complete role-based authorization middleware

### Task Management

* [x] Task schema
* [x] Task status architecture
* [x] Task assignment fields
* [x] File attachment schema
* [ ] Task controller
* [ ] Task CRUD
* [ ] Task assignment workflow
* [ ] Task status management
* [ ] Subtask controller
* [ ] Subtask CRUD

### Project Notes

* [x] Note schema
* [ ] Note controller
* [ ] Note CRUD
* [ ] Note authorization

### Quality & Deployment

* [ ] API testing
* [ ] API documentation
* [ ] Pagination
* [ ] Filtering and search
* [ ] Rate limiting
* [ ] Dockerization
* [ ] CI/CD
* [ ] Production deployment

---

# 🗺️ Development Roadmap

```text
Authentication
      ↓
Project Management
      ↓
Project Membership
      ↓
Role-Based Authorization
      ↓
Task Management
      ↓
Subtask Management
      ↓
Project Notes
      ↓
Testing
      ↓
API Documentation
      ↓
Deployment
```

The next major development stage is to build the task, subtask, and project-note controllers and connect them to their respective routes.

---

# 🎯 Project Goals

ProjectHub is being developed as a practical backend engineering project focused on understanding how production-oriented APIs are structured.

The main learning goals are:

```text
REST API Design
       ↓
Database Modeling
       ↓
MongoDB Aggregation
       ↓
Authentication
       ↓
Authorization
       ↓
Input Validation
       ↓
Middleware
       ↓
Error Handling
       ↓
Project Collaboration
       ↓
Task Management
       ↓
Testing
       ↓
Deployment
```

The goal is not simply to implement CRUD operations, but to understand how the different backend components work together to create a maintainable application.

---

