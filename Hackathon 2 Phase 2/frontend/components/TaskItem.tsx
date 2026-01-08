import React from 'react';
import { Task } from '@/types/task';
import { Button } from './Button';
import { CheckCircle, Circle, Trash2, Edit3 } from 'lucide-react';

interface TaskItemProps {
  task: Task;
  onToggleComplete: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit: (task: Task) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggleComplete, onDelete, onEdit }) => {
  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-200 hover:bg-gray-50">
      <div className="flex items-center space-x-3">
        <button
          onClick={() => onToggleComplete(task.id)}
          className="focus:outline-none"
          aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
        >
          {task.completed ? (
            <CheckCircle className="h-5 w-5 text-green-500" />
          ) : (
            <Circle className="h-5 w-5 text-gray-400" />
          )}
        </button>
        <div>
          <h3 className={`font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
            {task.title}
          </h3>
          {task.description && (
            <p className={`text-sm mt-1 ${task.completed ? 'line-through text-gray-400' : 'text-gray-500'}`}>
              {task.description}
            </p>
          )}
          <p className="text-xs text-gray-400 mt-1">
            Created: {new Date(task.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>
      <div className="flex space-x-2">
        <Button
          variant="ghost"
          size="sm"
          icon={Edit3}
          onClick={() => onEdit(task)}
          aria-label="Edit task"
        >
          Edit
        </Button>
        <Button
          variant="danger"
          size="sm"
          icon={Trash2}
          onClick={() => onDelete(task.id)}
          aria-label="Delete task"
        >
          Delete
        </Button>
      </div>
    </div>
  );
};

export { TaskItem };