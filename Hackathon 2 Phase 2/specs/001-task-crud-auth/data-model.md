# Data Model: Full-Stack Web Application (Task CRUD and User Authentication)

## Overview
This document defines the data models for the full-stack web application with user authentication and task management capabilities.

## User Model
The User model represents registered users of the application.

### Fields
- `id` (UUID/Integer): Unique identifier for the user (Primary Key)
- `email` (String): User's email address (Unique, Required, Validated)
- `hashed_password` (String): Bcrypt-hashed password (Required)
- `first_name` (String, Optional): User's first name
- `last_name` (String, Optional): User's last name
- `is_active` (Boolean): Whether the account is active (Default: true)
- `created_at` (DateTime): Timestamp when the user was created
- `updated_at` (DateTime): Timestamp when the user was last updated

### Relationships
- One-to-Many: A user can have many tasks

### Validation Rules
- Email must be a valid email format
- Email must be unique across all users
- Password must meet security requirements (min length, complexity)
- First and last names must not exceed 50 characters each

## Task Model
The Task model represents individual tasks that users can create, update, and delete.

### Fields
- `id` (UUID/Integer): Unique identifier for the task (Primary Key)
- `title` (String): Title of the task (Required, Max 200 characters)
- `description` (Text, Optional): Detailed description of the task
- `status` (Enum): Current status of the task (To-Do, In Progress, Done)
- `priority` (Enum): Priority level (Low, Medium, High) (Default: Medium)
- `due_date` (DateTime, Optional): When the task is due
- `user_id` (UUID/Integer): Foreign key linking to the user who owns the task (Required)
- `created_at` (DateTime): Timestamp when the task was created
- `updated_at` (DateTime): Timestamp when the task was last updated

### Relationships
- Many-to-One: A task belongs to one user (user_id foreign key)

### Validation Rules
- Title is required and must be between 1-200 characters
- Description, if provided, must not exceed 1000 characters
- Status must be one of the allowed values (To-Do, In Progress, Done)
- Priority must be one of the allowed values (Low, Medium, High)
- Due date, if provided, must be in the future
- User_id must reference an existing user

## State Transitions (Task Status)
- To-Do → In Progress: When user starts working on the task
- In Progress → To-Do: When user decides to postpone the task
- In Progress → Done: When user completes the task
- Done → In Progress: When user needs to make changes to completed task
- To-Do → Done: When user completes a task without working on it directly

## Database Schema
```sql
-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tasks table
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'To-Do',
    priority VARCHAR(10) NOT NULL DEFAULT 'Medium',
    due_date TIMESTAMP WITH TIME ZONE,
    user_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Indexes
CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
CREATE INDEX idx_tasks_created_at ON tasks(created_at);
```

## Security Considerations
- User passwords are never stored in plain text, only bcrypt-hashed versions
- Foreign key constraints ensure referential integrity
- CASCADE DELETE on user removal will remove all associated tasks
- All database queries will be parameterized to prevent SQL injection