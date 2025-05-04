import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { createPost, User } from '../api';

function CreatePost() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  // Get user data to check permissions
  const { data: user } = useQuery<User | null>({ queryKey: ['user'] });

  // Check if user has permission to create posts
  useEffect(() => {
    if (user && !user.permissions.includes('CREATE_POST')) {
      alert('You do not have permission to create posts');
      navigate('/403');
    }
  }, [user, navigate]);
  
  const [formData, setFormData] = useState({
    title: '',
    body: '',
  });

  // Create post mutation
  const createPostMutation = useMutation({
    mutationFn: () => createPost({
      ...formData,
      userId: 1, // Dummy user ID since we're not handling real users
    }),
    onSuccess: () => {
      // Invalidate posts query to refetch the list
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      navigate('/posts');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createPostMutation.mutate();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Show loading while checking permissions
  if (!user) {
    return <div className="text-gray-600 animate-pulse">Checking permissions...</div>;
  }

  // If user doesn't have create permission, this should redirect via useEffect
  if (!user.permissions.includes('CREATE_POST')) {
    return <div className="text-gray-600">Redirecting...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h1 className="text-2xl font-bold text-gray-900">Create New Post</h1>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50"
                placeholder="Enter post title"
              />
            </div>
            <div className="mb-6">
              <label htmlFor="body" className="block text-sm font-medium text-gray-700 mb-1">
                Content
              </label>
              <textarea
                id="body"
                name="body"
                value={formData.body}
                onChange={handleChange}
                required
                rows={10}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50"
                placeholder="Enter post content"
              />
            </div>
            <div className="flex space-x-3">
              <button
                type="submit"
                disabled={createPostMutation.isPending}
                className="btn btn-primary"
              >
                {createPostMutation.isPending ? 'Creating...' : 'Create Post'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/posts')}
                className="btn btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreatePost; 