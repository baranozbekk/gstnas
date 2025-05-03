import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Posts from './pages/Posts';
import CreatePost from './pages/CreatePost';
import Dashboard from './pages/Dashboard';
import { PrivateRoute } from './PrivateRoute';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/posts" element={<Posts />} />
        <Route path="/create-post" element={<CreatePost />} />
        <Route
          path="/dashboard"
          element={<PrivateRoute redirectTo="/login" component={<Dashboard />} />}
        />
        <Route path="*" element={<Login />} />
      </Routes>
    </>
  );
}

export default App;
