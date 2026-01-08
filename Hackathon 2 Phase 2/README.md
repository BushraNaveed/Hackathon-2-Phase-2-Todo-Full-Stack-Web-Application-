# Todo App - Hackathon II

A full-stack web application with user authentication and task management capabilities built using Next.js 16, FastAPI, and Neon Serverless PostgreSQL.

## Tech Stack

- **Frontend**: Next.js 16, TypeScript, Tailwind CSS
- **Backend**: FastAPI, SQLModel, Python 3.11+
- **Database**: Neon Serverless PostgreSQL
- **Authentication**: Better Auth with JWT tokens

## Features

- User authentication (sign up, sign in, sign out)
- Task CRUD operations (Create, Read, Update, Delete)
- Task completion toggling
- User data isolation (each user only sees their own tasks)
- Responsive UI with Tailwind CSS

## Project Structure

```
hackathon-todo/
├── specs/                 # Specification files
│   ├── overview.md
│   ├── features/
│   │   ├── task-crud.md
│   │   └── authentication.md
│   ├── api/
│   │   └── rest-endpoints.md
│   └── database/
│       └── schema.md
├── frontend/              # Next.js application
│   ├── app/               # App Router pages
│   ├── components/        # Reusable UI components
│   ├── lib/               # Utilities and API client
│   ├── types/             # TypeScript type definitions
│   ├── public/            # Static assets
│   └── package.json
└── backend/               # FastAPI application
    ├── main.py           # Application entry point
    ├── models.py         # SQLModel database models
    ├── auth.py           # Authentication and JWT handling
    ├── db.py             # Database connection
    ├── routes/           # API route handlers
    │   └── tasks.py
    └── requirements.txt
```

## Setup Instructions

### Prerequisites

- Node.js 18+ (for frontend)
- Python 3.11+ (for backend)
- PostgreSQL or Neon Serverless PostgreSQL account

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Set environment variables:
   ```bash
   cp .env.example .env
   ```
   Update `DATABASE_URL` and `BETTER_AUTH_SECRET` in `.env`

5. Run the application:
   ```bash
   uvicorn main:app --reload
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set environment variables:
   ```bash
   cp .env.example .env.local
   ```
   Update `NEXT_PUBLIC_BETTER_AUTH_URL` and `NEXT_PUBLIC_API_BASE_URL` in `.env.local`

4. Run the application:
   ```bash
   npm run dev
   ```

## API Endpoints

All endpoints require a JWT token in the Authorization header: `Authorization: Bearer <token>`

- `GET /api/tasks` - Get all tasks for authenticated user
- `POST /api/tasks` - Create a new task
- `GET /api/tasks/{id}` - Get a specific task
- `PUT /api/tasks/{id}` - Update a task
- `DELETE /api/tasks/{id}` - Delete a task
- `PATCH /api/tasks/{id}/complete` - Toggle task completion status

## Environment Variables

### Backend (.env)
```env
DATABASE_URL=postgresql://username:password@localhost:5432/todo_db
BETTER_AUTH_SECRET=your-super-secret-jwt-key-here
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

## Running the Application

1. Start the backend: `cd backend && uvicorn main:app --reload`
2. Start the frontend: `cd frontend && npm run dev`
3. Visit `http://localhost:3000` in your browser