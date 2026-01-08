# API Contract: Full-Stack Web Application (Task CRUD and User Authentication)

## Overview
This document defines the API contracts for the full-stack web application with user authentication and task management capabilities.

## Base URL
`https://api.yourdomain.com` (or `http://localhost:8000` for development)

## Authentication
All endpoints except authentication endpoints require a valid JWT token in the Authorization header:
```
Authorization: Bearer <jwt_token_here>
```

## Common Response Format
Success responses follow the format:
```json
{
  "success": true,
  "data": { /* response data */ },
  "message": "Optional success message"
}
```

Error responses follow the format:
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message"
  }
}
```

## Endpoints

### Authentication Endpoints

#### POST /auth/register
Register a new user account.

Request Body:
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "first_name": "John",
  "last_name": "Doe"
}
```

Response (201 Created):
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid-string",
      "email": "user@example.com",
      "first_name": "John",
      "last_name": "Doe",
      "created_at": "2023-01-01T00:00:00Z"
    },
    "token": "jwt-token-string"
  },
  "message": "Account created successfully"
}
```

#### POST /auth/login
Authenticate a user and return a JWT token.

Request Body:
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

Response (200 OK):
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid-string",
      "email": "user@example.com",
      "first_name": "John",
      "last_name": "Doe",
      "created_at": "2023-01-01T00:00:00Z"
    },
    "token": "jwt-token-string"
  },
  "message": "Login successful"
}
```

#### POST /auth/logout
Logout the current user (invalidate the session).

Headers:
```
Authorization: Bearer <jwt_token_here>
```

Response (200 OK):
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

#### GET /auth/me
Get information about the currently authenticated user.

Headers:
```
Authorization: Bearer <jwt_token_here>
```

Response (200 OK):
```json
{
  "success": true,
  "data": {
    "id": "uuid-string",
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "is_active": true,
    "created_at": "2023-01-01T00:00:00Z",
    "updated_at": "2023-01-01T00:00:00Z"
  }
}
```

### Task Management Endpoints

#### GET /api/tasks
Retrieve all tasks for the authenticated user.

Query Parameters:
- `status` (optional): Filter by status (to-do, in-progress, done)
- `priority` (optional): Filter by priority (low, medium, high)
- `limit` (optional): Number of tasks to return (default: 10, max: 100)
- `offset` (optional): Number of tasks to skip (for pagination)

Headers:
```
Authorization: Bearer <jwt_token_here>
```

Response (200 OK):
```json
{
  "success": true,
  "data": {
    "tasks": [
      {
        "id": "uuid-string",
        "title": "Sample Task",
        "description": "Task description",
        "status": "to-do",
        "priority": "medium",
        "due_date": "2023-12-31T23:59:59Z",
        "user_id": "user-uuid-string",
        "created_at": "2023-01-01T00:00:00Z",
        "updated_at": "2023-01-01T00:00:00Z"
      }
    ],
    "total_count": 1,
    "limit": 10,
    "offset": 0
  }
}
```

#### POST /api/tasks
Create a new task for the authenticated user.

Headers:
```
Authorization: Bearer <jwt_token_here>
```

Request Body:
```json
{
  "title": "New Task",
  "description": "Task description",
  "status": "to-do",
  "priority": "medium",
  "due_date": "2023-12-31T23:59:59Z"
}
```

Response (201 Created):
```json
{
  "success": true,
  "data": {
    "task": {
      "id": "uuid-string",
      "title": "New Task",
      "description": "Task description",
      "status": "to-do",
      "priority": "medium",
      "due_date": "2023-12-31T23:59:59Z",
      "user_id": "user-uuid-string",
      "created_at": "2023-01-01T00:00:00Z",
      "updated_at": "2023-01-01T00:00:00Z"
    }
  },
  "message": "Task created successfully"
}
```

#### GET /api/tasks/{task_id}
Retrieve a specific task for the authenticated user.

Path Parameters:
- `task_id`: UUID of the task to retrieve

Headers:
```
Authorization: Bearer <jwt_token_here>
```

Response (200 OK):
```json
{
  "success": true,
  "data": {
    "task": {
      "id": "uuid-string",
      "title": "Sample Task",
      "description": "Task description",
      "status": "to-do",
      "priority": "medium",
      "due_date": "2023-12-31T23:59:59Z",
      "user_id": "user-uuid-string",
      "created_at": "2023-01-01T00:00:00Z",
      "updated_at": "2023-01-01T00:00:00Z"
    }
  }
}
```

#### PUT /api/tasks/{task_id}
Update a specific task for the authenticated user.

Path Parameters:
- `task_id`: UUID of the task to update

Headers:
```
Authorization: Bearer <jwt_token_here>
```

Request Body:
```json
{
  "title": "Updated Task Title",
  "description": "Updated task description",
  "status": "in-progress",
  "priority": "high",
  "due_date": "2023-12-31T23:59:59Z"
}
```

Response (200 OK):
```json
{
  "success": true,
  "data": {
    "task": {
      "id": "uuid-string",
      "title": "Updated Task Title",
      "description": "Updated task description",
      "status": "in-progress",
      "priority": "high",
      "due_date": "2023-12-31T23:59:59Z",
      "user_id": "user-uuid-string",
      "created_at": "2023-01-01T00:00:00Z",
      "updated_at": "2023-01-02T00:00:00Z"
    }
  },
  "message": "Task updated successfully"
}
```

#### DELETE /api/tasks/{task_id}
Delete a specific task for the authenticated user.

Path Parameters:
- `task_id`: UUID of the task to delete

Headers:
```
Authorization: Bearer <jwt_token_here>
```

Response (200 OK):
```json
{
  "success": true,
  "message": "Task deleted successfully"
}
```

## Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| AUTH_001 | 401 | Invalid or expired token |
| AUTH_002 | 401 | Invalid credentials |
| AUTH_003 | 400 | Registration validation error |
| TASK_001 | 404 | Task not found |
| TASK_002 | 403 | Access denied - user doesn't own the task |
| VALIDATION_ERROR | 400 | Request validation failed |
| SERVER_ERROR | 500 | Internal server error |