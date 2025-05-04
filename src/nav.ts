import { useNavigate } from 'react-router-dom';
import routes, { RouteConfig } from './routes';
import { useQuery } from '@tanstack/react-query';
import { User } from './api';

// Generate path with params
const generatePath = (
  path: string,
  params: Record<string, string | number> = {},
  parentPath?: string
) => {
  let result = path;

  // Handle child routes
  if (parentPath && !path.startsWith('/')) {
    // For child routes that are relative (don't start with /)
    const baseParentPath = parentPath.endsWith('/') ? parentPath.slice(0, -1) : parentPath;
    result = `${baseParentPath}/${path}`;
  }

  // Replace parameters
  Object.entries(params).forEach(([key, value]) => {
    result = result.replace(`:${key}`, String(value));
  });

  return result;
};

// Check if user has required permissions
const hasPermissions = (requiredPermissions: string[] = [], userPermissions: string[] = []) => {
  if (!requiredPermissions.length) {
    // No permissions required
    return true;
  }
  return requiredPermissions.some(permission => userPermissions.includes(permission));
};

// Create navigator object
const createNavigator = () => {
  const nav: Record<string, any> = {};

  const processRoute = (route: RouteConfig, parentRoute?: RouteConfig) => {
    nav[route.name] = {
      get: (params: Record<string, string | number> = {}) =>
        generatePath(route.path, params, parentRoute?.path),
      go: (params: Record<string, string | number> = {}) => {},
    };

    if (route.children) {
      route.children.forEach(childRoute => processRoute(childRoute, route));
    }
  };

  routes.forEach(route => processRoute(route));
  return nav;
};

const nav = createNavigator();

// Hook to enhance navigator with actual navigation functionality
export const useNav = () => {
  const navigate = useNavigate();
  const { data: user } = useQuery<User | null>({ queryKey: ['user'] });

  const enhancedNav = { ...nav };

  const findRouteByName = (
    routeName: string
  ): { route: RouteConfig; parent?: RouteConfig } | null => {
    const topRoute = routes.find(r => r.name === routeName);
    if (topRoute) {
      return { route: topRoute };
    }

    for (const parentRoute of routes) {
      if (parentRoute.children) {
        const childRoute = parentRoute.children.find(child => child.name === routeName);
        if (childRoute) {
          return { route: childRoute, parent: parentRoute };
        }
      }
    }

    return null;
  };

  Object.keys(nav).forEach(routeName => {
    const routeInfo = findRouteByName(routeName);

    if (routeInfo) {
      const { route, parent } = routeInfo;

      enhancedNav[routeName].go = (params: Record<string, string | number> = {}) => {
        // Check permissions
        if (route.permissions && user) {
          const userPermissions = user.permissions || [];
          if (!hasPermissions(route.permissions, userPermissions)) {
            alert(`You don't have permission to access this page`);
            navigate('/403');
            return;
          }
        }

        // Navigate to the route
        const path = generatePath(route.path, params, parent?.path);
        navigate(path);
      };
    }
  });

  return enhancedNav;
};

export default nav;
