import { QueryClient } from "@tanstack/react-query";

export interface User {
  id: number;
  username: string;
}

export interface AuthStatusResponse {
  authenticated: boolean;
  user?: User;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  user: User;
}

export interface LogoutResponse {
  success: boolean;
  message: string;
}

// Auth service functions
export async function checkAuthStatus(): Promise<AuthStatusResponse> {
  const response = await fetch('/api/auth/status', {
    credentials: 'include'
  });
  
  if (!response.ok) {
    throw new Error(`Failed to check auth status: ${response.status}`);
  }
  
  return await response.json();
}

export async function login(username: string, password: string): Promise<LoginResponse> {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, password }),
    credentials: 'include'
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Login failed');
  }
  
  return data;
}

export async function logout(): Promise<LogoutResponse> {
  const response = await fetch('/api/auth/logout', {
    method: 'POST',
    credentials: 'include'
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Logout failed');
  }
  
  return data;
}

// Generate a blog post (protected endpoint requiring auth)
export async function generateBlogPost(): Promise<{ success: boolean; message: string; output?: string }> {
  const response = await fetch('/api/admin/generate-blog', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include'
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || data.error || 'Failed to generate blog post');
  }
  
  return data;
}

// Invalidate any cached queries when auth state changes
export function invalidateAuthQueries(queryClient: QueryClient) {
  queryClient.invalidateQueries({ queryKey: ['/api/auth/status'] });
}