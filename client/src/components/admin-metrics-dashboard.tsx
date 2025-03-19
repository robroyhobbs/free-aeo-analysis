import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Calendar, Globe, BarChart } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { getQueryFn } from '@/lib/queryClient';

// Interface for the metrics data
interface UsageMetrics {
  totalAnalyses: number;
  recentAnalyses: number;
  averageScore: number;
  topDomains: Array<{ domain: string; count: number }>;
}

export function AdminMetricsDashboard() {
  // Fetch metrics data
  const { data: metrics, isLoading, error } = useQuery<UsageMetrics>({
    queryKey: ['/api/admin/metrics'],
    queryFn: getQueryFn<UsageMetrics>({ on401: 'throw' })
  });

  // If loading, show skeletons
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(5)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                <Skeleton className="h-4 w-24" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-20 mb-1" />
              <Skeleton className="h-4 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // If error, show error message
  if (error) {
    return (
      <div className="bg-destructive/15 text-destructive p-4 rounded-lg">
        <h3 className="font-medium">Error loading metrics</h3>
        <p className="text-sm">
          {error instanceof Error ? error.message : 'Failed to load dashboard metrics'}
        </p>
      </div>
    );
  }

  // Format the average score to 1 decimal place
  const formattedAvgScore = metrics ? metrics.averageScore.toFixed(1) : '0';

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Site Analytics</h2>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Total Analyses Card */}
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">
              Total Analyses
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.totalAnalyses || 0}</div>
            <p className="text-xs text-muted-foreground">
              URLs analyzed by users
            </p>
          </CardContent>
        </Card>
        
        {/* Recent Analyses Card */}
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">
              24h Activity
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.recentAnalyses || 0}</div>
            <p className="text-xs text-muted-foreground">
              Analyses in last 24 hours
            </p>
          </CardContent>
        </Card>
        
        {/* Average Score Card */}
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">
              Average Score
            </CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formattedAvgScore}/100</div>
            <p className="text-xs text-muted-foreground">
              Overall website performance
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Top Domains */}
      {metrics?.topDomains && metrics.topDomains.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Top Analyzed Domains</CardTitle>
            <CardDescription>
              Most frequently analyzed websites
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {metrics.topDomains.map((item: { domain: string; count: number }, i: number) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Globe className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="font-medium">{item.domain}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">{item.count} analyses</span>
                  </div>
                </div>
              ))}
              
              {metrics.topDomains.length === 0 && (
                <p className="text-muted-foreground text-sm">No domains analyzed yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}