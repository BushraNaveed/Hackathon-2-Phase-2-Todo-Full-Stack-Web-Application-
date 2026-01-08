export interface Task {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  user_id: string;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
}