import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { checkAuthStatus, login as loginService, logout as logoutService } from '@/lib/authService';
import { useQueryClient } from '@tanstack/react-query';

interface User {
  id: number;
  username: string;
}

interface LoginCredentials {
  username: string;
  password: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    isLoading: true
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Check auth status on initial load
  useEffect(() => {
    const fetchAuthStatus = async () => {
      try {
        const response = await checkAuthStatus();
        
        setAuthState({
          isAuthenticated: response.authenticated,
          user: response.user || null,
          isLoading: false
        });
      } catch (error) {
        console.error('Failed to check authentication status:', error);
        setAuthState({
          isAuthenticated: false,
          user: null,
          isLoading: false
        });
      }
    };

    fetchAuthStatus();
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      
      const response = await loginService(credentials.username, credentials.password);
      
      if (response.success) {
        setAuthState({
          isAuthenticated: true,
          user: response.user,
          isLoading: false
        });
        
        // Invalidate any admin-related queries
        queryClient.invalidateQueries({ queryKey: ['/api/admin'] });
        
        toast({
          title: 'Login successful',
          description: 'You are now logged in',
          variant: 'default'
        });
        
        return true;
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      
      toast({
        title: 'Login failed',
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
        variant: 'destructive'
      });
      
      return false;
    }
  }, [toast, queryClient]);

  const logout = useCallback(async () => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      
      const response = await logoutService();
      
      if (response.success) {
        setAuthState({
          isAuthenticated: false,
          user: null,
          isLoading: false
        });
        
        toast({
          title: 'Logged out',
          description: 'You have been successfully logged out',
          variant: 'default'
        });
      } else {
        throw new Error(response.message || 'Logout failed');
      }
    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      
      toast({
        title: 'Logout failed',
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
        variant: 'destructive'
      });
    }
  }, [toast]);

  return {
    isAuthenticated: authState.isAuthenticated,
    user: authState.user,
    isLoading: authState.isLoading,
    login,
    logout
  };
}