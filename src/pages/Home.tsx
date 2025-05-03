import { Link } from 'react-router-dom';
export default function Home() {
  return (
    <>
      <Link to="/login">Login</Link>
      <Link to="/posts">Posts</Link>
      <Link to="/create-post">Create Post</Link>
      <div>This is home page</div>
    </>
  );
}
