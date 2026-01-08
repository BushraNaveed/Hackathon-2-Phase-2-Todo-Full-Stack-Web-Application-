from sqlmodel import SQLModel, Field, Relationship
from typing import Optional
from datetime import datetime
import uuid

# Task model
class TaskBase(SQLModel):
    title: str = Field(min_length=1, max_length=200)
    description: Optional[str] = Field(default=None, max_length=1000)
    completed: bool = Field(default=False)


class Task(TaskBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(foreign_key="user.id")  # Better Auth user ID
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class TaskRead(TaskBase):
    id: int
    user_id: str
    created_at: datetime
    updated_at: datetime


class TaskCreate(TaskBase):
    pass


class TaskUpdate(SQLModel):
    title: Optional[str] = Field(default=None, min_length=1, max_length=200)
    description: Optional[str] = Field(default=None, max_length=1000)
    completed: Optional[bool] = None


# User model (simplified - actual user data comes from Better Auth)
class UserBase(SQLModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: str = Field(unique=True, nullable=False)
    name: Optional[str] = None


class User(UserBase, table=True):
    __tablename__ = "user"  # Better Auth expects this table name
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    email: str = Field(unique=True, nullable=False)
    name: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Relationship to tasks
    tasks: list["Task"] = Relationship(back_populates="user")


class UserRead(UserBase):
    id: str
    created_at: datetime