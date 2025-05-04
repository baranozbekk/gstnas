import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { loginUser } from '../api';

function Login() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleLogin = (isAdmin: boolean) => {
    // Get user data from the dummy login function
    const user = loginUser(isAdmin);
    
    // Store user in session storage
    sessionStorage.setItem('user', JSON.stringify(user));
    
    // Update react-query cache
    queryClient.setQueryData(['user'], user);
    
    // Navigate to dashboard
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-center text-3xl font-extrabold text-gray-900">Login</h1>
        <p className="mt-2 text-center text-sm text-gray-600">
          Choose a user type to login:
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Admin User Card */}
          <div className="bg-white py-8 px-4 shadow-md rounded-lg sm:px-10 flex-1 flex flex-col">
            <h2 className="text-xl font-semibold text-gray-900">Admin User</h2>
            <p className="mt-2 text-sm text-gray-600">Has all permissions:</p>
            <ul className="mt-4 space-y-2 text-sm text-gray-500 list-disc list-inside mb-6">
              <li>VIEW_POSTS</li>
              <li>VIEW_COMMENTS</li>
              <li>EDIT_POST</li>
              <li>CREATE_POST</li>
            </ul>
            <button 
              onClick={() => handleLogin(true)}
              className="mt-auto w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Login as Admin
            </button>
          </div>

          {/* Basic User Card */}
          <div className="bg-white py-8 px-4 shadow-md rounded-lg sm:px-10 flex-1 flex flex-col">
            <h2 className="text-xl font-semibold text-gray-900">Basic User</h2>
            <p className="mt-2 text-sm text-gray-600">Has limited permissions:</p>
            <ul className="mt-4 space-y-2 text-sm text-gray-500 list-disc list-inside mb-6">
              <li>VIEW_POSTS</li>
              <li>VIEW_COMMENTS</li>
            </ul>
            <button 
              onClick={() => handleLogin(false)}
              className="mt-auto w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-secondary-600 hover:bg-secondary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-500"
            >
              Login as Basic User
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login; 