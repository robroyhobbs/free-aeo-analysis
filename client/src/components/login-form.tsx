import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/use-auth';
import { LockIcon, UserIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginStatus, setLoginStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');
  const { login, isLoading, refreshAuthStatus } = useAuth();
  const { toast } = useToast();

  // Refresh auth status when form mounts
  useEffect(() => {
    refreshAuthStatus();
  }, [refreshAuthStatus]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginStatus('pending');
    
    try {
      const success = await login({ username, password });
      
      if (success) {
        setLoginStatus('success');
        // Double-check auth status after a short delay to ensure the session is established
        setTimeout(() => {
          refreshAuthStatus();
        }, 500);
      } else {
        setLoginStatus('error');
      }
    } catch (error) {
      setLoginStatus('error');
      toast({
        title: 'Login error',
        description: 'There was a problem logging in. Please try again.',
        variant: 'destructive'
      });
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl">Admin Login</CardTitle>
        <CardDescription>
          Login to access the admin dashboard
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                <UserIcon className="h-4 w-4" />
              </div>
              <Input
                id="username"
                placeholder="Enter your username"
                className="pl-10"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={isLoading || loginStatus === 'pending'}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                <LockIcon className="h-4 w-4" />
              </div>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                className="pl-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading || loginStatus === 'pending'}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isLoading || loginStatus === 'pending'}>
            {isLoading || loginStatus === 'pending' ? 'Logging in...' : 'Log in'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}