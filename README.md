# 🚀 ProjectHub Backend

> A backend API for a collaborative project management platform, built with Node.js, Express.js, MongoDB, and JWT-based authentication.


## 📌 About

**ProjectCamp** is a RESTful backend application designed to support collaborative project management.

The planned platform will allow users to create and manage projects, collaborate with team members, organize tasks and subtasks, maintain project notes, and securely access resources through role-based permissions.

The project is being developed with a focus on building a **structured, maintainable, and production-oriented backend architecture** rather than simply creating basic CRUD APIs.

### Current focus

The authentication and request-validation layer has been implemented, while project, task, and collaboration functionality is being developed incrementally.

---

## 🛠️ Tech Stack

| Technology            | Purpose                           |
| --------------------- | --------------------------------- |
| **Node.js**           | JavaScript runtime                |
| **Express.js 5**      | REST API framework                |
| **MongoDB**           | Database                          |
| **Mongoose**          | MongoDB ODM                       |
| **JWT**               | Authentication & token management |
| **bcrypt**            | Password hashing                  |
| **Express Validator** | Request validation                |
| **Nodemailer**        | Email delivery                    |
| **Mailgen**           | Email template generation         |
| **Cookie Parser**     | Cookie handling                   |
| **CORS**              | Cross-origin request handling     |
| **dotenv**            | Environment configuration         |
| **Nodemon**           | Development workflow              |

---

## ✨ Current Features

### 🔐 Authentication

The authentication layer currently includes:

* User registration architecture
* User login architecture
* JWT access token generation
* JWT refresh token generation
* Password hashing using bcrypt
* Password verification
* Protected routes using JWT middleware
* Logout route
* Current-user route
* Change-password route
* Email verification workflow
* Forgot-password workflow
* Reset-password workflow
* Resend email verification
* Temporary token generation using cryptographically secure random values
* Hashed temporary tokens using SHA-256
* Token expiration handling

---

### ✅ Request Validation

Input validation is implemented using **Express Validator**.

Current validation includes:

* Email format validation
* Required-field validation
* Username validation
* Username lowercase validation
* Username length validation
* Password validation
* Password-change validation
* Forgot-password validation
* Reset-password validation

Validation is separated from controllers using reusable validator functions and a centralized validation middleware.

Example architecture:

```text
Request
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


## 🔑 Authentication Architecture

ProjectCamp uses a **dual-token JWT authentication system**.

### Access Token

The access token contains basic user information:

```text
_id
email
username
```

and is signed using a dedicated access-token secret and expiration time.

### Refresh Token

The refresh token contains the user's `_id` and uses a separate secret and expiration configuration.

This separation allows short-lived access credentials to be renewed without requiring the user to log in again.

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
                 New Access Token
```

---

## 🔒 Password Security

Passwords are never stored directly.

Before saving a user:

```text
Plain Password
      ↓
bcrypt
      ↓
Hashed Password
      ↓
MongoDB
```

When authenticating:

```text
Entered Password
      ↓
bcrypt.compare()
      ↓
Stored Hash
      ↓
Authentication Result
```

The password hashing logic is implemented using a Mongoose `pre("save")` hook so passwords are automatically hashed when created or modified.

---

## 🔐 Temporary Token Security

Temporary tokens are used for workflows such as:

* Email verification
* Password reset

The application generates a cryptographically secure random token and stores only its SHA-256 hash.

```text
Random Token
     ↓
SHA-256 Hash
     ↓
Database
```

The original token is sent to the user through the email link.

Temporary tokens also have an expiration time to reduce the risk of misuse.

---

## 📧 Email System

Email functionality is implemented using:

* **Nodemailer** for sending emails
* **Mailgen** for generating email content

Current email workflows include:

### Email Verification

```text
Registration
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

The application is currently configured for development/testing email infrastructure and can later be connected to a production email provider.

---

## 🛡️ Error & Response Handling

ProjectCamp uses standardized API response and error classes.

### `ApiError`

Provides a consistent structure for application errors:

```json
{
  "statusCode": 404,
  "success": false,
  "message": "User does not exist",
  "errors": []
}
```

### `ApiResponse`

Provides a standardized successful response structure:

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Success",
  "data": {}
}
```

This keeps API responses consistent across different controllers.

---

## ⚡ Async Error Handling

Asynchronous controller functions are wrapped using a reusable `asyncHandler`.

Instead of repeatedly writing:

```javascript
try {
    // controller logic
} catch (error) {
    next(error);
}
```

controllers can be wrapped and automatically forward rejected promises to Express's error-handling pipeline.

---

## 👥 Planned Role-Based Access Control

The application architecture includes three planned user roles:

| Role            | Description                           |
| --------------- | ------------------------------------- |
| `admin`         | Full system-level access              |
| `project_admin` | Administrative access within projects |
| `member`        | Basic project access                  |

The role constants have already been defined and will be used as project-management functionality is implemented.

---

## 📋 Planned Task Status

Tasks will use the following status system:

```text
todo
in_progress
done
```

These values are already defined as reusable application constants to prevent inconsistent status values throughout the application.

---

## 🔌 Current API Routes

### Authentication

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

### Health Check

```text
/api/v1/healthcheck
```

| Method | Endpoint | Purpose          |
| ------ | -------- | ---------------- |
| GET    | `/`      | Check API health |

---


## 📈 Development Roadmap

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
* [ ] Complete authentication workflows
* [ ] Complete email verification workflow
* [ ] Complete password reset workflow

### Project Management

* [ ] Project schema
* [ ] Project CRUD
* [ ] Project membership
* [ ] Member role management
* [ ] Role-based authorization

### Task Management

* [ ] Task schema
* [ ] Task CRUD
* [ ] Task assignment
* [ ] Task status management
* [ ] Subtask management
* [ ] File attachments

### Project Notes

* [ ] Note schema
* [ ] Note CRUD
* [ ] Note authorization

### Quality & Deployment

* [ ] API testing
* [ ] API documentation
* [ ] Pagination
* [ ] Filtering/search
* [ ] Rate limiting
* [ ] Dockerization
* [ ] CI/CD
* [ ] Production deployment

---

## 🎯 Project Goals

The goal of ProjectCamp is to build practical experience with backend engineering concepts used in real-world applications:

```text
REST API Design
       ↓
Database Modeling
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
Email Services
       ↓
Testing
       ↓
Deployment
```

---
