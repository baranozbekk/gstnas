import { useQuery } from '@tanstack/react-query';
import { User } from '../api';
import { useNav } from '../nav';

function Forbidden() {
  const nav = useNav();
  const { data: user } = useQuery<User | null>({ queryKey: ['user'] });

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-red-100">
            <svg 
              className="h-16 w-16 text-red-600" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor" 
              aria-hidden="true"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
              />
            </svg>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Access Denied (403)
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            You don't have the required permissions to access this page.
          </p>
        </div>
        
        {user && (
          <div className="bg-white py-4 px-5 border border-gray-200 rounded-md shadow-sm">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Current User Details
            </h3>
            <p className="text-sm text-gray-600 mb-1">
              <span className="font-medium">Logged in as:</span> {user.name}
            </p>
            <p className="text-sm text-gray-600 mb-3">
              <span className="font-medium">Your permissions:</span>
            </p>
            <ul className="list-disc pl-5 mb-2 text-sm text-gray-600">
              {user.permissions.map(permission => (
                <li key={permission}>{permission}</li>
              ))}
            </ul>
            <p className="text-sm text-gray-500 italic">
              You need additional permissions to access this resource.
            </p>
          </div>
        )}
        
        <div className="flex flex-col space-y-3">
          <button 
            onClick={() => nav.dashboard.go()}
            className="btn btn-primary w-full"
          >
            Return to Dashboard
          </button>
          <button 
            onClick={() => nav.login.go()}
            className="btn btn-secondary w-full"
          >
            Switch User
          </button>
        </div>
      </div>
    </div>
  );
}

export default Forbidden; 