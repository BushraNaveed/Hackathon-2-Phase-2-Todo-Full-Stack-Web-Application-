from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlmodel import Session, select
from typing import List
from datetime import datetime

from models import Task, TaskRead, TaskCreate, TaskUpdate
from auth import get_current_user, verify_user_access
from db import engine
from pydantic import BaseModel

router = APIRouter()

class ToggleCompleteResponse(BaseModel):
    task: TaskRead

@router.get("/tasks", response_model=List[TaskRead])
async def get_tasks(
    current_user: dict = Depends(get_current_user),
    status_filter: str = Query("all", description="Filter by status: all, active, completed"),
    sort_by: str = Query("created", description="Sort by: created, updated, title")
):
    """
    Get all tasks for the authenticated user.
    """
    with Session(engine) as session:
        # Build query to filter tasks by user ID
        query = select(Task).where(Task.user_id == current_user.user_id)
        
        # Apply status filter if specified
        if status_filter == "active":
            query = query.where(Task.completed == False)
        elif status_filter == "completed":
            query = query.where(Task.completed == True)
        
        # Apply sorting
        if sort_by == "updated":
            query = query.order_by(Task.updated_at.desc())
        elif sort_by == "title":
            query = query.order_by(Task.title)
        else:  # default to created
            query = query.order_by(Task.created_at.desc())
        
        tasks = session.exec(query).all()
        return tasks


@router.post("/tasks", response_model=TaskRead)
async def create_task(task: TaskCreate, current_user: dict = Depends(get_current_user)):
    """
    Create a new task for the authenticated user.
    """
    with Session(engine) as session:
        # Create task with user association
        db_task = Task(**task.model_dump(), user_id=current_user.user_id)
        session.add(db_task)
        session.commit()
        session.refresh(db_task)
        return db_task


@router.get("/tasks/{task_id}", response_model=TaskRead)
async def get_task(task_id: int, current_user: dict = Depends(get_current_user)):
    """
    Get a specific task by ID for the authenticated user.
    """
    with Session(engine) as session:
        # Get task and verify it belongs to the current user
        task = session.get(Task, task_id)
        if not task:
            raise HTTPException(status_code=404, detail="Task not found")
        
        # Verify user access
        if not verify_user_access(current_user.user_id, task.user_id):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to access this task"
            )
        
        return task


@router.put("/tasks/{task_id}", response_model=TaskRead)
async def update_task(task_id: int, task_update: TaskUpdate, current_user: dict = Depends(get_current_user)):
    """
    Update a specific task by ID for the authenticated user.
    """
    with Session(engine) as session:
        # Get task and verify it belongs to the current user
        db_task = session.get(Task, task_id)
        if not db_task:
            raise HTTPException(status_code=404, detail="Task not found")
        
        # Verify user access
        if not verify_user_access(current_user.user_id, db_task.user_id):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to update this task"
            )
        
        # Update task fields
        task_data = task_update.dict(exclude_unset=True)
        for field, value in task_data.items():
            setattr(db_task, field, value)
        
        # Update timestamp
        db_task.updated_at = datetime.utcnow()
        
        session.add(db_task)
        session.commit()
        session.refresh(db_task)
        return db_task


@router.delete("/tasks/{task_id}")
async def delete_task(task_id: int, current_user: dict = Depends(get_current_user)):
    """
    Delete a specific task by ID for the authenticated user.
    """
    with Session(engine) as session:
        # Get task and verify it belongs to the current user
        task = session.get(Task, task_id)
        if not task:
            raise HTTPException(status_code=404, detail="Task not found")
        
        # Verify user access
        if not verify_user_access(current_user.user_id, task.user_id):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to delete this task"
            )
        
        session.delete(task)
        session.commit()
        return {"message": "Task deleted successfully"}


@router.patch("/tasks/{task_id}/complete", response_model=TaskRead)
async def toggle_task_completion(task_id: int, current_user: dict = Depends(get_current_user)):
    """
    Toggle the completion status of a specific task for the authenticated user.
    """
    with Session(engine) as session:
        # Get task and verify it belongs to the current user
        task = session.get(Task, task_id)
        if not task:
            raise HTTPException(status_code=404, detail="Task not found")
        
        # Verify user access
        if not verify_user_access(current_user.user_id, task.user_id):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to update this task"
            )
        
        # Toggle completion status
        task.completed = not task.completed
        task.updated_at = datetime.utcnow()
        
        session.add(task)
        session.commit()
        session.refresh(task)
        return task