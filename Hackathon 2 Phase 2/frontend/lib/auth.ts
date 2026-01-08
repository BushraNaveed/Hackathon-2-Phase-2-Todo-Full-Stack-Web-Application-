// Note: Better Auth configuration varies based on version
// This is a simplified implementation based on the requirements
// The actual implementation may vary depending on the specific Better Auth version

// For the frontend, we'll create a simple auth utility that works with JWT tokens
import { useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name?: string;
}

class AuthManager {
  private static instance: AuthManager;
  private user: User | null = null;
  private token: string | null = null;

  private constructor() {
    // Check for existing session on initialization
    this.token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (this.token) {
      this.verifyToken();
    }
  }

  public static getInstance(): AuthManager {
    if (!AuthManager.instance) {
      AuthManager.instance = new AuthManager();
    }
    return AuthManager.instance;
  }

  async signIn(email: string, password: string): Promise<boolean> {
    try {
      // In a real implementation, this would call the Better Auth sign-in endpoint
      // For now, we'll simulate the process
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        this.token = data.token;
        this.user = data.user;

        if (typeof window !== 'undefined') {
          localStorage.setItem('token', this.token);
        }

        return true;
      }
      return false;
    } catch (error) {
      console.error('Sign in error:', error);
      return false;
    }
  }

  async signUp(email: string, password: string, name?: string): Promise<boolean> {
    try {
      // In a real implementation, this would call the Better Auth sign-up endpoint
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name }),
      });

      if (response.ok) {
        const data = await response.json();
        this.token = data.token;
        this.user = data.user;

        if (typeof window !== 'undefined') {
          localStorage.setItem('token', this.token);
        }

        return true;
      }
      return false;
    } catch (error) {
      console.error('Sign up error:', error);
      return false;
    }
  }

  async signOut(): Promise<void> {
    this.token = null;
    this.user = null;

    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
  }

  async verifyToken(): Promise<boolean> {
    if (!this.token) {
      return false;
    }

    try {
      // In a real implementation, this would verify the JWT token with the backend
      const response = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.token}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        this.user = userData.user;
        return true;
      } else {
        // Token is invalid, clear it
        this.signOut();
        return false;
      }
    } catch (error) {
      console.error('Token verification error:', error);
      this.signOut();
      return false;
    }
  }

  isAuthenticated(): boolean {
    return !!this.token && !!this.user;
  }

  getCurrentUser(): User | null {
    return this.user;
  }

  getToken(): string | null {
    return this.token;
  }
}

// Create a hook for using auth in components
export const useAuth = () => {
  const [authManager] = useState(() => AuthManager.getInstance());
  const [isAuthenticated, setIsAuthenticated] = useState(authManager.isAuthenticated());
  const [user, setUser] = useState(authManager.getCurrentUser());

  useEffect(() => {
    const checkAuth = async () => {
      const isValid = await authManager.verifyToken();
      setIsAuthenticated(isValid);
      setUser(authManager.getCurrentUser());
    };

    checkAuth();
  }, []);

  const signIn = async (email: string, password: string) => {
    const success = await authManager.signIn(email, password);
    setIsAuthenticated(success);
    setUser(authManager.getCurrentUser());
    return success;
  };

  const signUp = async (email: string, password: string, name?: string) => {
    const success = await authManager.signUp(email, password, name);
    setIsAuthenticated(success);
    setUser(authManager.getCurrentUser());
    return success;
  };

  const signOut = async () => {
    await authManager.signOut();
    setIsAuthenticated(false);
    setUser(null);
  };

  return {
    isAuthenticated,
    user,
    signIn,
    signUp,
    signOut,
    token: authManager.getToken(),
  };
};