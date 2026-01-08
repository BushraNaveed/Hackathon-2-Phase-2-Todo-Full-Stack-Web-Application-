'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Task } from '@/types/task';
import { TaskItem } from '@/components/TaskItem';
import { TaskForm } from '@/components/TaskForm';
import { Button } from '@/components/Button';
import { useAuth } from '@/lib/auth';
import { api } from '@/lib/api';
import { LogOut, Plus } from 'lucide-react';

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [sortBy, setSortBy] = useState<'created' | 'updated' | 'title'>('created');
  const router = useRouter();
  const { isAuthenticated, signOut } = useAuth();

  // Check authentication on mount
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else {
      fetchTasks();
    }
  }, [isAuthenticated, router]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const tasksData = await api.getTasks(statusFilter, sortBy);
      setTasks(tasksData);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchTasks();
    }
  }, [statusFilter, sortBy, isAuthenticated]);

  const handleCreateTask = async (taskData: Omit<Task, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    try {
      const newTask = await api.createTask(taskData);
      setTasks([...tasks, newTask]);
      setShowForm(false);
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleUpdateTask = async (taskData: Partial<Task>) => {
    if (!editingTask) return;

    try {
      const updatedTask = await api.updateTask(editingTask.id, taskData);
      setTasks(tasks.map(t => t.id === editingTask.id ? updatedTask : t));
      setEditingTask(null);
      setShowForm(false);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDeleteTask = async (id: number) => {
    try {
      await api.deleteTask(id);
      setTasks(tasks.filter(task => task.id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleToggleComplete = async (id: number) => {
    try {
      const updatedTask = await api.toggleTaskCompletion(id);
      setTasks(tasks.map(task => task.id === id ? updatedTask : task));
    } catch (error) {
      console.error('Error toggling task completion:', error);
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
  };

  if (!isAuthenticated) {
    return null; // Redirect happens in useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Todo Dashboard</h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">Welcome!</span>
            <Button
              variant="ghost"
              icon={LogOut}
              onClick={handleSignOut}
              aria-label="Sign out"
            >
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
          <div className="flex space-x-2 mb-4 sm:mb-0">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Tasks</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="created">Sort by Created</option>
              <option value="updated">Sort by Updated</option>
              <option value="title">Sort by Title</option>
            </select>
          </div>
          
          <Button
            variant="primary"
            icon={Plus}
            onClick={() => {
              setEditingTask(null);
              setShowForm(true);
            }}
          >
            Add Task
          </Button>
        </div>

        {showForm ? (
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">
              {editingTask ? 'Edit Task' : 'Create New Task'}
            </h2>
            <TaskForm
              task={editingTask || undefined}
              onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
              onCancel={() => {
                setShowForm(false);
                setEditingTask(null);
              }}
            />
          </div>
        ) : null}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : tasks.length === 0 ? (
          <div className="bg-white shadow rounded-lg p-6 text-center">
            <p className="text-gray-500">No tasks found. Create your first task!</p>
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {tasks.map((task) => (
                <li key={task.id}>
                  <TaskItem
                    task={task}
                    onToggleComplete={handleToggleComplete}
                    onDelete={handleDeleteTask}
                    onEdit={handleEditTask}
                  />
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>
    </div>
  );
}