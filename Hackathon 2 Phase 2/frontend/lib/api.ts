import { Task } from '../types/task';

// Base API URL from environment
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

/**
 * API client for interacting with the backend API
 * Automatically attaches JWT token to requests when available
 */
class ApiClient {
  private getAuthToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // Add authorization header if token exists
    const token = this.getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    // Handle responses that don't have a body (like DELETE)
    if (response.status === 204) {
      return {} as T;
    }

    return response.json();
  }

  // Task API methods
  async getTasks(statusFilter: string = 'all', sortBy: string = 'created'): Promise<Task[]> {
    const params = new URLSearchParams({ status: statusFilter, sort_by: sortBy });
    return this.request<Task[]>(`/api/tasks?${params}`);
  }

  async createTask(task: Omit<Task, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<Task> {
    return this.request<Task>('/api/tasks', {
      method: 'POST',
      body: JSON.stringify(task),
    });
  }

  async getTask(taskId: number): Promise<Task> {
    return this.request<Task>(`/api/tasks/${taskId}`);
  }

  async updateTask(taskId: number, task: Partial<Task>): Promise<Task> {
    return this.request<Task>(`/api/tasks/${taskId}`, {
      method: 'PUT',
      body: JSON.stringify(task),
    });
  }

  async deleteTask(taskId: number): Promise<void> {
    await this.request(`/api/tasks/${taskId}`, {
      method: 'DELETE',
    });
  }

  async toggleTaskCompletion(taskId: number): Promise<Task> {
    return this.request<Task>(`/api/tasks/${taskId}/complete`, {
      method: 'PATCH',
    });
  }
}

// Export a singleton instance of the API client
export const api = new ApiClient();

// Define types
export type { Task };