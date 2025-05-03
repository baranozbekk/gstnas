import { Navigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

interface UserData {
  name: string;
  permissions: string[];
}

export const PrivateRoute = ({
  component,
  redirectTo = '/',
}: {
  component: React.ReactNode;
  redirectTo?: string;
}) => {
  const { data } = useQuery<UserData>({
    queryKey: ['user'],
    enabled: false,
    queryFn: () => {
      return {
        name: 'John Doe',
        permissions: ['VIEW_POSTS', 'VIEW_COMMENTS'],
      };
    },
  });

  return data?.permissions.includes('VIEW_POSTS') && data?.permissions.includes('VIEW_COMMENTS') ? (
    component
  ) : (
    <Navigate to={redirectTo} />
  );
};
