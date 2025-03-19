import { QueryClient } from "@tanstack/react-query";
import { apiRequest } from "./queryClient";

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
  try {
    const response = await apiRequest('GET', '/api/auth/status');
    return await response.json();
  } catch (error) {
    console.error('Auth status check failed:', error);
    return { authenticated: false };
  }
}

export async function login(username: string, password: string): Promise<LoginResponse> {
  try {
    const response = await apiRequest(
      'POST', 
      '/api/auth/login', 
      { username, password }
    );
    
    return await response.json();
  } catch (error) {
    // If we get a specific error message from the server, use it
    if (error instanceof Error) {
      throw error;
    }
    // Otherwise use a generic message
    throw new Error('Login failed. Please try again.');
  }
}

export async function logout(): Promise<LogoutResponse> {
  try {
    const response = await apiRequest('POST', '/api/auth/logout');
    return await response.json();
  } catch (error) {
    // If we get a specific error message from the server, use it
    if (error instanceof Error) {
      throw error;
    }
    // Otherwise use a generic message
    throw new Error('Logout failed. Please try again.');
  }
}

// Generate a blog post (protected endpoint requiring auth)
export async function generateBlogPost(): Promise<{ success: boolean; message: string; output?: string }> {
  try {
    const response = await apiRequest('POST', '/api/admin/generate-blog');
    return await response.json();
  } catch (error) {
    console.error('Blog post generation failed:', error);
    
    // If we get a specific error message from the server, use it
    if (error instanceof Error) {
      throw error;
    }
    // Otherwise use a generic message
    throw new Error('Failed to generate blog post. Please try again.');
  }
}

// Invalidate any cached queries when auth state changes
export function invalidateAuthQueries(queryClient: QueryClient) {
  queryClient.invalidateQueries({ queryKey: ['/api/auth/status'] });
}