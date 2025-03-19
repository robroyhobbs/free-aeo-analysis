import { QueryClient, QueryFunction } from "@tanstack/react-query";

// CSRF token cache
let csrfToken: string | undefined;

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

// Function to get CSRF token
async function getCsrfToken(): Promise<string> {
  // If we already have a token, return it
  if (csrfToken) {
    return csrfToken;
  }
  
  // Otherwise fetch a new token
  try {
    const res = await fetch('/api/csrf-token', {
      credentials: 'include'
    });
    
    if (!res.ok) {
      throw new Error('Failed to fetch CSRF token');
    }
    
    const data = await res.json();
    if (!data.csrfToken) {
      throw new Error('No CSRF token found in response');
    }
    
    csrfToken = data.csrfToken;
    return data.csrfToken; // Return directly from data to avoid null issues
  } catch (error) {
    console.error('Error fetching CSRF token:', error);
    throw error;
  }
}

// Function to reset CSRF token (call this after a 403 CSRF error)
export function resetCsrfToken() {
  csrfToken = undefined;
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
  options?: RequestInit
): Promise<Response> {
  // Determine if we need a CSRF token (for state-changing operations)
  const needsCsrfToken = 
    method.toUpperCase() !== 'GET' && 
    method.toUpperCase() !== 'HEAD' &&
    (url.includes('/api/auth/login') || 
     url.includes('/api/auth/logout') || 
     url.includes('/api/analyze') ||
     url.includes('/api/admin/generate-blog'));
  
  // Prepare headers
  const headers: Record<string, string> = {
    ...(data ? { "Content-Type": "application/json" } : {})
  };
  
  // Add CSRF token to headers if needed
  if (needsCsrfToken) {
    try {
      const token = await getCsrfToken();
      // Use the header name expected by csurf middleware
      headers['CSRF-Token'] = token;
    } catch (error) {
      console.error('Failed to add CSRF token to request:', error);
      // Continue with the request even if CSRF token fetch fails
    }
  }

  const requestOptions: RequestInit = {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
    ...options // Spread additional options (signal, cache, etc)
  };

  try {
    const res = await fetch(url, requestOptions);
    
    // If we get a 403 and it might be a CSRF error, invalidate token and try once more
    if (res.status === 403 && needsCsrfToken) {
      const bodyText = await res.text();
      if (bodyText.includes('CSRF') || bodyText.includes('csrf')) {
        // Reset CSRF token and try again
        resetCsrfToken();
        const newToken = await getCsrfToken();
        
        const newHeaders = { ...headers, 'CSRF-Token': newToken };
        const retryOptions = {
          ...requestOptions,
          headers: newHeaders
        };
        
        const retryRes = await fetch(url, retryOptions);
        await throwIfResNotOk(retryRes);
        return retryRes;
      }
      
      // If it's not a CSRF error, throw the original error
      throw new Error(`${res.status}: ${bodyText}`);
    }
    
    await throwIfResNotOk(res);
    return res;
  } catch (error: unknown) {
    // Handle AbortError specifically
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Request was aborted due to timeout');
    }
    throw error;
  }
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    // For certain routes that might need CSRF validation
    const url = queryKey[0] as string;
    const needsCsrfToken = url.includes('/api/auth/status'); // Add any other GET routes that need CSRF token
    
    const headers: Record<string, string> = {};
    
    // Add CSRF token to headers if needed
    if (needsCsrfToken) {
      try {
        const token = await getCsrfToken();
        headers['CSRF-Token'] = token;
      } catch (error) {
        console.error('Failed to add CSRF token to GET request:', error);
      }
    }
    
    const res = await fetch(url, {
      credentials: "include",
      headers
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }
    
    // Handle CSRF errors for GET requests
    if (res.status === 403 && needsCsrfToken) {
      try {
        const bodyText = await res.text();
        if (bodyText.includes('CSRF') || bodyText.includes('csrf')) {
          // Reset token and retry
          resetCsrfToken();
          const newToken = await getCsrfToken();
          
          const retryRes = await fetch(url, {
            credentials: "include",
            headers: { 'CSRF-Token': newToken }
          });
          
          if (unauthorizedBehavior === "returnNull" && retryRes.status === 401) {
            return null;
          }
          
          await throwIfResNotOk(retryRes);
          return await retryRes.json();
        }
        
        throw new Error(`${res.status}: ${bodyText}`);
      } catch (error) {
        throw error;
      }
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
