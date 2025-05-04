import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { getPosts, getComments, User } from '../api';
import { useNav } from '../nav';
import Spinner from '../components/Spinner';

function Dashboard() {
  const nav = useNav();
  
  // Fetch posts with limited count
  const { data: posts, isLoading: postsLoading } = useQuery({
    queryKey: ['dashboard-posts'],
    queryFn: async () => {
      const allPosts = await getPosts();
      return allPosts.slice(0, 5); // Get only the first 5 posts
    },
  });

  // Fetch comments with limited count
  const { data: comments, isLoading: commentsLoading } = useQuery({
    queryKey: ['dashboard-comments'],
    queryFn: async () => {
      const allComments = await getComments();
      return allComments.slice(0, 5); // Get only the first 5 comments
    },
  });

  // Fetch user information
  const { data: user } = useQuery<User | null>({ queryKey: ['user'] });

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Welcome to the Dashboard
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            {user ? `Hello, ${user.name}!` : 'Loading user information...'}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Recent Posts */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-gray-900">Recent Posts</h2>
                <Link 
                  to="/posts" 
                  className="text-sm font-medium text-primary-600 hover:text-primary-500"
                >
                  View all posts
                </Link>
              </div>
              
              {postsLoading ? (
                <div className="py-8 flex justify-center">
                  <Spinner />
                </div>
              ) : (
                <div className="space-y-4">
                  {posts?.map(post => (
                    <div key={post.id} className="border-b border-gray-200 pb-3">
                      <Link 
                        to={`/posts/${post.id}`}
                        className="block hover:bg-gray-50 -m-3 p-3 rounded-md transition duration-150 ease-in-out"
                      >
                        <h3 className="text-base font-medium text-gray-900 truncate">
                          {post.title}
                        </h3>
                        <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                          {post.body}
                        </p>
                      </Link>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-6">
                <button
                  onClick={() => nav.posts.go()}
                  className="btn btn-primary w-full"
                >
                  Browse All Posts
                </button>
              </div>
            </div>
          </div>
          
          {/* Recent Comments */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Comments</h2>
              
              {commentsLoading ? (
                <div className="py-8 flex justify-center">
                  <Spinner />
                </div>
              ) : (
                <div className="space-y-4">
                  {comments?.map(comment => (
                    <div key={comment.id} className="border-b border-gray-200 pb-3">
                      <div className="hover:bg-gray-50 -m-3 p-3 rounded-md transition duration-150 ease-in-out">
                        <div className="flex items-start">
                          <div className="flex-shrink-0">
                            <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-800 font-bold">
                              {comment.email.charAt(0).toUpperCase()}
                            </div>
                          </div>
                          <div className="ml-3">
                            <Link 
                              to={`/posts/${comment.postId}`}
                              className="text-sm font-medium text-gray-900 hover:text-primary-600"
                            >
                              {comment.name}
                            </Link>
                            <p className="text-xs text-gray-500">{comment.email}</p>
                            <p className="mt-1 text-sm text-gray-600 line-clamp-2">{comment.body}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard; 