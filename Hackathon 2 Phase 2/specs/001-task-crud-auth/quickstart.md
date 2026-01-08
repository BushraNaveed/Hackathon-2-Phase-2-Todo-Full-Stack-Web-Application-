# Quickstart Guide: Full-Stack Web Application

## Prerequisites
- Node.js 18+ (for frontend)
- Python 3.11+ (for backend)
- PostgreSQL or Neon Serverless PostgreSQL
- Better Auth compatible environment

## Setup Instructions

### 1. Clone and Navigate
```bash
git clone <repository-url>
cd hackathon-todo
```

### 2. Backend Setup
```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set environment variables
cp .env.example .env
# Update DATABASE_URL and BETTER_AUTH_SECRET in .env

# Run the application
uvicorn main:app --reload
```

### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Set environment variables
cp .env.example .env.local
# Update NEXT_PUBLIC_BETTER_AUTH_URL and NEXT_PUBLIC_API_BASE_URL in .env.local

# Run the application
npm run dev
```

## Configuration

### Environment Variables

#### Backend (.env)
```env
DATABASE_URL=postgresql://username:password@localhost:5432/todo_db
BETTER_AUTH_SECRET=your-super-secret-jwt-key-here
```

#### Frontend (.env.local)
```env
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

## Running the Application

### Development Mode
1. Start the backend: `cd backend && uvicorn main:app --reload`
2. Start the frontend: `cd frontend && npm run dev`
3. Visit `http://localhost:3000` in your browser

### API Endpoints
- Backend API: `http://localhost:8000/api/`
- Frontend: `http://localhost:3000/`

## Key Features
- User authentication with Better Auth
- Task CRUD operations
- JWT-based security
- User data isolation
- Responsive UI with Tailwind CSS