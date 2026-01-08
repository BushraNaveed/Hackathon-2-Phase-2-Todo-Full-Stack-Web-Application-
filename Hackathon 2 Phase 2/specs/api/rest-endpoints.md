# REST API Endpoints

## Base URL
- Development: http://localhost:8000
- Production: https://api.example.com

## Authentication
All endpoints require JWT token in header:
`Authorization: Bearer <token>`

## Endpoints

### GET /api/tasks
List all tasks for authenticated user.

Query Parameters:
- status: 'all', 'active', 'completed' (default: 'all')
- sort: 'created', 'updated', 'title' (default: 'created')

Response: Array of Task objects

### POST /api/tasks
Create a new task.

Request Body:
- title: string (required, 1-200 chars)
- description: string (optional, max 1000 chars)
- completed: boolean (default: false)

Response: Created Task object

### GET /api/tasks/{id}
Get task details.

Path Parameters:
- id: task ID

Response: Task object

### PUT /api/tasks/{id}
Update a task.

Path Parameters:
- id: task ID

Request Body:
- title: string (optional)
- description: string (optional)
- completed: boolean (optional)

Response: Updated Task object

### DELETE /api/tasks/{id}
Delete a task.

Path Parameters:
- id: task ID

Response: Empty body, 204 status

### PATCH /api/tasks/{id}/complete
Toggle completion status.

Path Parameters:
- id: task ID

Response: Updated Task object with toggled completion status