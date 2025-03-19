import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { BlogAdminPanel } from '@/components/blog-admin-panel';
import { LoginForm } from '@/components/login-form';
import { SEO } from '@/components/seo';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { LogOutIcon, LockIcon } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

// Admin page for managing blog content
export default function AdminPage() {
  const { isAuthenticated, user, isLoading, logout } = useAuth();

  return (
    <>
      <SEO 
        title="Admin Dashboard" 
        description="Administrator dashboard for managing blog content and site features"
        keywords="admin, dashboard, blog management, content management"
      />
      
      <div className="flex flex-col min-h-screen">
        <Header />
        
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto space-y-8">
            <div>
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-muted-foreground mt-2">
                Manage blog content and site features
              </p>
            </div>
            
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
              </div>
            ) : isAuthenticated ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between bg-muted p-4 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="bg-primary text-primary-foreground p-2 rounded-full">
                      <LockIcon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium">Logged in as <span className="text-primary">{user?.username}</span></p>
                      <p className="text-sm text-muted-foreground">You have admin access</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={logout}>
                    <LogOutIcon className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                </div>
                
                <BlogAdminPanel />
              </div>
            ) : (
              <div className="flex justify-center py-8">
                <LoginForm />
              </div>
            )}
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
}