import { useNav } from '../nav';

function NotFound() {
  const nav = useNav();

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h1 className="text-9xl font-extrabold text-primary-600">404</h1>
          <h2 className="mt-2 text-3xl font-bold text-gray-900">Page not found</h2>
          <p className="mt-3 text-base text-gray-500">
            Sorry, the page you are looking for doesn't exist or has been moved.
          </p>
        </div>
        
        <div className="mt-6">
          <button 
            onClick={() => nav.dashboard.go()} 
            className="btn btn-primary w-full sm:w-auto"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

export default NotFound; 