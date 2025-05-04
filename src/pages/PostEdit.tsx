import { useState, useEffect } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { Post, updatePost, User } from '../api';

function PostEdit() {
  const post = useOutletContext<Post>();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const postId = Number(id);

  // Get user data to check permissions
  const { data: user } = useQuery<User | null>({ queryKey: ['user'] });

  // Check if user has permission to edit
  useEffect(() => {
    if (user && !user.permissions.includes('EDIT_POST')) {
      alert('You do not have permission to edit posts');
      navigate('/403');
    }
  }, [user, navigate]);

  const [formData, setFormData] = useState({
    title: '',
    body: '',
  });

  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title,
        body: post.body,
      });
    }
  }, [post]);

  // Update post mutation
  const updatePostMutation = useMutation({
    mutationFn: updatePost,
    onSuccess: (updatedPost) => {
      // Update post in cache
      queryClient.setQueryData(['post', postId], updatedPost);
      navigate(`/posts/${postId}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (post) {
      updatePostMutation.mutate({
        ...post,
        title: formData.title,
        body: formData.body,
      });
    }
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

  // If user doesn't have edit permission, this should redirect via useEffect
  if (!user.permissions.includes('EDIT_POST')) {
    return <div className="text-gray-600">Redirecting...</div>;
  }

  if (!post) {
    return <div className="text-gray-600 animate-pulse">Loading post data...</div>;
  }

  return (
    <div className="bg-white">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Edit Post</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
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
          />
        </div>
        <div className="mb-4">
          <label htmlFor="body" className="block text-sm font-medium text-gray-700 mb-1">
            Content
          </label>
          <textarea
            id="body"
            name="body"
            value={formData.body}
            onChange={handleChange}
            required
            rows={8}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50"
          />
        </div>
        <div className="flex space-x-3">
          <button
            type="submit"
            disabled={updatePostMutation.isPending}
            className="btn btn-primary"
          >
            {updatePostMutation.isPending ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            type="button"
            onClick={() => navigate(`/posts/${postId}`)}
            className="btn btn-secondary"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default PostEdit; 