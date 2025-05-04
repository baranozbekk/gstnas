import { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation, Outlet } from 'react-router-dom';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import routes, { RouteConfig } from './routes';
import Header from './components/Header';
import { useNav } from './nav';
import { User } from './api';
import { prefetchRouteTranslations } from './i18n';
import { TranslationProvider } from './i18n/context';
import Spinner from './components/Spinner';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

// Function to get user from session storage
const getUser = (): User | null => {
  const storedUser = sessionStorage.getItem('user');
  return storedUser ? JSON.parse(storedUser) : null;
};

// Layout component with header
function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
    </div>
  );
}

// Protected Route component - checks for authentication and permissions before rendering
function ProtectedRoute({
  element,
  requiredPermissions = [],
}: {
  element: React.ReactNode;
  requiredPermissions?: string[];
}) {
  const location = useLocation();
  const nav = useNav();
  const { data: user, isLoading } = useQuery<User | null>({
    queryKey: ['user'],
    queryFn: getUser,
  });

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <Spinner />
        <span className="ml-2 text-gray-500">Verifying access...</span>
      </div>
    );
  }

  // User is not authenticated - redirect to login
  if (!user && location.pathname !== '/login') {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user has required permissions
  const hasRequiredPermissions =
    !requiredPermissions.length ||
    requiredPermissions.some(permission => user?.permissions.includes(permission));

  // User doesn't have required permissions - redirect to forbidden
  if (user && requiredPermissions.length > 0 && !hasRequiredPermissions) {
    return <Navigate to="/403" replace />;
  }

  // User is authenticated and has permissions - render the element
  return <>{element}</>;
}

// Translation prefetching component
function TranslationLoader({ children, route }: { children: React.ReactNode; route: RouteConfig }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Prefetch translations for this route
    prefetchRouteTranslations(route)
      .then(() => {
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Error loading translations:', err);
        setIsLoading(false);
      });
  }, [route]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Spinner />
        <span className="ml-2 text-gray-500">Loading resources...</span>
      </div>
    );
  }

  return <>{children}</>;
}

// Recursive function to render routes with translation loading and route protection
const renderRoutes = (routesList: RouteConfig[]) => {
  return routesList.map(route => (
    <Route
      key={route.name}
      path={route.path}
      element={
        <TranslationLoader route={route}>
          <ProtectedRoute element={route.element} requiredPermissions={route.permissions || []} />
        </TranslationLoader>
      }
    >
      {route.children && renderRoutes(route.children)}
    </Route>
  ));
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TranslationProvider>
        <div className="app">
          <Routes>
            <Route path="/" element={<Layout />}>
              {renderRoutes(routes)}
            </Route>
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </div>
      </TranslationProvider>
    </QueryClientProvider>
  );
}

export default App;
