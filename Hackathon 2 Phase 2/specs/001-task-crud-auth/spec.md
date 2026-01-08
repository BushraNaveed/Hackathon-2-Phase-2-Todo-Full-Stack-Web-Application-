# Feature Specification: Full-Stack Web Application (Task CRUD and User Authentication)

## Overview
Implement a full-stack web application with user authentication and task management capabilities. The application will allow users to sign up, sign in, and manage their personal tasks through a responsive web interface.

## Requirements

### 1. Backend (FastAPI)
- Set up FastAPI project structure
- Implement JWT-based authentication system
- Create Task model with SQLModel (including user_id foreign key)
- Implement JWT Verification Middleware to protect routes and ensure user isolation
- Implement RESTful CRUD endpoints for tasks:
  - `GET /api/tasks` - Get all tasks for authenticated user
  - `POST /api/tasks` - Create a new task for authenticated user
  - `GET /api/tasks/{task_id}` - Get a specific task for authenticated user
  - `PUT /api/tasks/{task_id}` - Update a specific task for authenticated user
  - `DELETE /api/tasks/{task_id}` - Delete a specific task for authenticated user

### 2. Frontend (Next.js)
- Set up Next.js project with App Router
- Configure Better Auth JWT plugin for authentication
- Create API client in `/lib/api.ts` to automatically attach JWT tokens
- Implement responsive UI for:
  - User sign-up/sign-in pages
  - Main task list page with create/update/delete functionality

### 3. Security Requirements
- All backend routes must be protected by JWT verification middleware
- Users can only access their own tasks (user isolation)
- Passwords must be properly hashed
- JWT tokens must be properly validated

### 4. Database
- Use SQLModel for database models
- Define Task model with appropriate fields and relationships
- Ensure proper foreign key relationships between users and tasks

## Technical Constraints
- Use FastAPI for backend API
- Use Next.js with App Router for frontend
- Use Tailwind CSS for styling
- Use Server Components by default in Next.js
- Follow security best practices for authentication