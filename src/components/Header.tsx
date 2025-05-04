import { useQueryClient, useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useNav } from '../nav';
import { User } from '../api';

function Header() {
  const navigate = useNavigate();
  const nav = useNav();
  const queryClient = useQueryClient();
  const { data: user } = useQuery<User | null>({ queryKey: ['user'] });

  // Check permissions
  const canCreatePost = user?.permissions.includes('CREATE_POST');

  const handleLogout = () => {
    // Remove user from session storage
    sessionStorage.removeItem('user');

    // Remove user from react-query cache
    queryClient.removeQueries({ queryKey: ['user'] });

    // Navigate to login page
    navigate('/login');
  };

  const handleCreatePostClick = () => {
    if (!canCreatePost) {
      alert('You do not have permission to create posts');
      navigate('/403');
    } else {
      nav.createPost.go();
    }
  };

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="text-2xl font-bold text-primary-600">SAN TSG</div>
          </div>
          <div className="flex items-center space-x-3">
            <button onClick={() => nav.dashboard.go()} className="btn btn-secondary">
              Dashboard
            </button>
            <button onClick={() => nav.posts.go()} className="btn btn-secondary">
              Posts
            </button>
            <button
              onClick={handleCreatePostClick}
              className={`btn ${canCreatePost ? 'btn-primary' : 'btn-secondary btn-disabled'}`}
              title={!canCreatePost ? 'You need additional permissions' : ''}
            >
              Create Post
              {!canCreatePost && <span className="ml-1 text-xs">(Restricted)</span>}
            </button>
            <button onClick={handleLogout} className="btn btn-danger">
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
