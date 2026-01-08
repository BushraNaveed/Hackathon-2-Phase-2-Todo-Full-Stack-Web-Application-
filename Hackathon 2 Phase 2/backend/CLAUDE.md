# Backend Guidelines

## Stack
- FastAPI
- SQLModel (ORM)
- Neon PostgreSQL
- Better Auth JWT verification

## Project Structure
- `main.py` - FastAPI app entry point
- `models.py` - SQLModel database models
- `routes/` - API route handlers
- `auth.py` - Authentication and JWT verification
- `db.py` - Database connection

## API Conventions
- All routes under `/api/`
- Return JSON responses
- Use Pydantic models for request/response
- Handle errors with HTTPException
- All endpoints require JWT token in header: `Authorization: Bearer <token>`

## Database
- Use SQLModel for all database operations
- Connection string from environment variable: DATABASE_URL
- Implement user isolation - filter all queries by authenticated user's ID

## Authentication
- Verify JWT tokens using shared secret with Better Auth
- Extract user ID from token claims
- Enforce user isolation on all data access

## Running
`uvicorn main:app --reload --port 8000`