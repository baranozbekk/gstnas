import axios from 'axios';

const API_URL = 'https://jsonplaceholder.typicode.com';

const api = axios.create({
  baseURL: API_URL,
});

export interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

export interface Comment {
  id: number;
  postId: number;
  name: string;
  email: string;
  body: string;
}

export interface User {
  name: string;
  permissions: string[];
}

export const getPosts = async (): Promise<Post[]> => {
  const response = await api.get('/posts');
  return response.data;
};

export const getPost = async (id: number): Promise<Post> => {
  const response = await api.get(`/posts/${id}`);
  return response.data;
};

export const createPost = async (post: Omit<Post, 'id'>): Promise<Post> => {
  const response = await api.post('/posts', post);
  return response.data;
};

export const updatePost = async (post: Post): Promise<Post> => {
  const response = await api.put(`/posts/${post.id}`, post);
  return response.data;
};

export const deletePost = async (id: number): Promise<void> => {
  await api.delete(`/posts/${id}`);
};

export const getComments = async (postId?: number): Promise<Comment[]> => {
  const url = postId ? `/posts/${postId}/comments` : '/comments';
  const response = await api.get(url);
  return response.data;
};

// Users
export const ADMIN_USER: User = {
  name: 'Admin User',
  permissions: ['VIEW_POSTS', 'VIEW_COMMENTS', 'EDIT_POST', 'CREATE_POST'],
};

export const BASIC_USER: User = {
  name: 'John Doe',
  permissions: ['VIEW_POSTS', 'VIEW_COMMENTS'],
};

export const loginUser = (isAdmin: boolean = true): User => {
  return isAdmin ? ADMIN_USER : BASIC_USER;
};

export default api;
