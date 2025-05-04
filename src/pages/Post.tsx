import { useParams, Link, Outlet, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getPost, User } from '../api';

function Post() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const postId = Number(id);

  // Fetch post
  const { data: post, isLoading } = useQuery({
    queryKey: ['post', postId],
    queryFn: () => getPost(postId),
    enabled: !!postId,
  });

  // Fetch current user to check permissions
  const { data: user } = useQuery<User | null>({ queryKey: ['user'] });

  // Check if user has edit permission
  const hasEditPermission = user?.permissions.includes('EDIT_POST');

  // Handle edit click with permission check
  const handleEditClick = (e: React.MouseEvent) => {
    if (!hasEditPermission) {
      e.preventDefault();
      alert('You do not have permission to edit posts');
      navigate('/403');
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">Post not found</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h1 className="text-2xl font-bold text-gray-900 leading-tight">{post.title}</h1>
        </div>
        <div className="border-t border-gray-200">
          <div className="px-4 py-5 sm:p-6 prose max-w-none">
            <p className="text-gray-700 whitespace-pre-line">{post.body}</p>
          </div>
        </div>
        
        <div className="border-t border-gray-200 px-4 py-4">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              {hasEditPermission ? (
                <Link 
                  to="edit" 
                  className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
                >
                  Edit Post
                </Link>
              ) : (
                <span 
                  onClick={handleEditClick}
                  className="border-transparent text-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm cursor-not-allowed"
                  title="You need additional permissions"
                >
                  Edit Post (Requires Permission)
                </span>
              )}
              <Link 
                to="comments" 
                className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
              >
                Comments
              </Link>
            </nav>
          </div>
          
          <div className="mt-6">
            <Outlet context={post} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Post; 