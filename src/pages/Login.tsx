import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
const USER_QUERY_KEY = ['user'];
export default function Login() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const USER: {
    name: string;
    permissions: string[];
  } = {
    name: 'John Doe',
    permissions: ['VIEW_POSTS', 'VIEW_COMMENTS'],
  };

  const handleLogin = (event: React.FormEvent) => {
    event.preventDefault();
    queryClient.setQueryData(USER_QUERY_KEY, USER);
    navigate('/dashboard');
  };
  return (
    <div>
      <h1>Login Page</h1>
      <form onSubmit={handleLogin}>
        <button type="submit">Log In</button>
      </form>
    </div>
  );
}
