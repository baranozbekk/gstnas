import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPosts, deletePost, User } from '../api';
import { useNav } from '../nav';
import { useNavigate } from 'react-router-dom';

function Posts() {
  const nav = useNav();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch user data to check permissions
  const { data: user } = useQuery<User | null>({ queryKey: ['user'] });
  
  // Check permissions
  const canCreatePost = user?.permissions.includes('CREATE_POST');
  const canEditPost = user?.permissions.includes('EDIT_POST');

  // Fetch posts
  const { data: posts, isLoading } = useQuery({
    queryKey: ['posts'],
    queryFn: getPosts,
  });

  // Delete post mutation
  const deletePostMutation = useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      // Invalidate the posts query to refetch
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });

  const handleDelete = (id: number) => {
    if (!user?.permissions.includes('EDIT_POST')) {
      alert('You do not have permission to delete posts');
      navigate('/403');
      return;
    }
    
    if (window.confirm('Are you sure you want to delete this post?')) {
      deletePostMutation.mutate(id);
    }
  };
  
  const handleCreatePostClick = () => {
    if (!canCreatePost) {
      alert('You do not have permission to create posts');
      navigate('/403');
    } else {
      nav.createPost.go();
    }
  };
  
  const handleEditPostClick = (id: number) => {
    if (!canEditPost) {
      alert('You do not have permission to edit posts');
      navigate('/403');
    } else {
      nav.postEdit.go({ id });
    }
  };

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Posts</h1>
          <button 
            onClick={handleCreatePostClick}
            className={`btn ${canCreatePost ? 'btn-primary' : 'btn-secondary btn-disabled'}`}
            title={!canCreatePost ? 'You need additional permissions' : ''}
          >
            Create New Post
            {!canCreatePost && (
              <span className="ml-1 text-xs">(Restricted)</span>
            )}
          </button>
        </div>
        
        {isLoading ? (
          <div className="mt-6 grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-white shadow rounded-lg p-6">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  <div className="mt-4 flex space-x-3">
                    <div className="h-8 bg-gray-200 rounded w-16"></div>
                    <div className="h-8 bg-gray-200 rounded w-16"></div>
                    <div className="h-8 bg-gray-200 rounded w-16"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-6 grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {posts?.map(post => (
              <div key={post.id} className="bg-white shadow rounded-lg overflow-hidden">
                <div className="p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-2 line-clamp-1">{post.title}</h3>
                  <p className="text-gray-500 text-sm line-clamp-3">{post.body}</p>
                  <div className="mt-4 flex space-x-3">
                    <button 
                      onClick={() => nav.post.go({ id: post.id })}
                      className="btn btn-secondary text-xs px-3 py-1"
                    >
                      View
                    </button>
                    <button 
                      onClick={() => handleEditPostClick(post.id)}
                      className={`btn text-xs px-3 py-1 ${canEditPost ? 'btn-secondary' : 'btn-secondary btn-disabled'}`}
                      title={!canEditPost ? 'You need additional permissions' : ''}
                    >
                      Edit
                      {!canEditPost && <span className="ml-1">(•)</span>}
                    </button>
                    <button 
                      onClick={() => handleDelete(post.id)}
                      className={`btn text-xs px-3 py-1 ${canEditPost ? 'btn-danger' : 'btn-secondary btn-disabled'}`}
                      title={!canEditPost ? 'You need additional permissions' : ''}
                    >
                      Delete
                      {!canEditPost && <span className="ml-1">(•)</span>}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Posts; 