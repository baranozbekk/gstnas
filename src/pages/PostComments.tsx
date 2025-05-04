import { useParams, useOutletContext } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getComments, Post } from '../api';

function PostComments() {
  const post = useOutletContext<Post>();
  const { id } = useParams<{ id: string }>();
  const postId = Number(id);

  // Fetch comments for this post
  const { data: comments, isLoading } = useQuery({
    queryKey: ['comments', postId],
    queryFn: () => getComments(postId),
    enabled: !!postId,
  });

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex space-x-4">
            <div className="flex-1 py-1 space-y-4">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Comments for "{post.title}"
      </h2>
      
      {comments && comments.length > 0 ? (
        <div className="space-y-6">
          {comments.map(comment => (
            <div key={comment.id} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-800 font-bold">
                  {comment.email.charAt(0).toUpperCase()}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">{comment.name}</p>
                  <p className="text-xs text-gray-500">{comment.email}</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 whitespace-pre-line">{comment.body}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 rounded-lg px-4 py-5 border border-gray-200">
          <p className="text-center text-gray-500">No comments found for this post.</p>
        </div>
      )}
    </div>
  );
}

export default PostComments; 