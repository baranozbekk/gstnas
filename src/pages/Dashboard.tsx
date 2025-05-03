import { useQuery } from '@tanstack/react-query';

interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

interface Comment {
  postId: number;
  id: number;
  name: string;
  email: string;
  body: string;
}

const fetchPosts = async (): Promise<Post[]> => {
  const res = await fetch(
    'https://jsonplaceholder.typicode.com/posts?_limit=5&_sort=id&_order=desc'
  );
  if (!res.ok) throw new Error('Failed to fetch posts');
  return res.json();
};

const fetchComments = async (): Promise<Comment[]> => {
  const res = await fetch(
    'https://jsonplaceholder.typicode.com/comments?_limit=5&_sort=id&_order=desc'
  );
  if (!res.ok) throw new Error('Failed to fetch comments');
  return res.json();
};

const Dashboard: React.FC = () => {
  const {
    data: posts,
    isLoading: postsLoading,
    isError: postsError,
  } = useQuery<Post[]>({
    queryKey: ['posts'],
    queryFn: fetchPosts,
  });

  const {
    data: comments,
    isLoading: commentsLoading,
    isError: commentsError,
  } = useQuery<Comment[]>({
    queryKey: ['comments'],
    queryFn: fetchComments,
  });

  if (postsLoading || commentsLoading) return <p>Loading...</p>;
  if (postsError || commentsError) return <p>Error loading data</p>;

  console.log('Posts:', posts);
  console.log('Comments:', comments);

  return (
    <div style={styles.dashboard}>
      <div style={styles.card}>
        <h2>Recent Posts</h2>
        <ul>
          {posts?.map(post => (
            <li key={post.id}>
              <strong>{post.title}</strong>
              <p>{post.body.slice(0, 60)}...</p>
            </li>
          ))}
        </ul>
      </div>

      <div style={styles.card}>
        <h2>Recent Comments</h2>
        <ul>
          {comments?.map(comment => (
            <li key={comment.id}>
              <strong>{comment.name}</strong>
              <p>{comment.body.slice(0, 60)}...</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;

const styles: Record<string, React.CSSProperties> = {
  dashboard: {
    display: 'flex',
    gap: '2rem',
    padding: '2rem',
    justifyContent: 'center',
    color: '#333',
  },
  card: {
    flex: 1,
    padding: '1rem',
    border: '1px solid #ccc',
    borderRadius: '12px',
    backgroundColor: '#f9f9f9',
    textAlign: 'left',
  },
};
