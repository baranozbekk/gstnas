import { lazy, ReactNode } from 'react';

// Pages
const Login = lazy(() => import('./pages/Login'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Posts = lazy(() => import('./pages/Posts'));
const Post = lazy(() => import('./pages/Post'));
const PostEdit = lazy(() => import('./pages/PostEdit'));
const PostComments = lazy(() => import('./pages/PostComments'));
const CreatePost = lazy(() => import('./pages/CreatePost'));
const Forbidden = lazy(() => import('./pages/Forbidden'));
const NotFound = lazy(() => import('./pages/NotFound'));

export type RouteConfig = {
  name: string;
  path: string;
  element: ReactNode;
  permissions?: string[];
  translations?: string[];
  children?: RouteConfig[];
};

const routes: RouteConfig[] = [
  {
    name: 'login',
    path: '/login',
    element: <Login />,
    translations: ['login'],
  },
  {
    name: 'dashboard',
    path: '/',
    element: <Dashboard />,
    permissions: ['VIEW_POSTS', 'VIEW_COMMENTS'],
    translations: ['dashboard'],
  },
  {
    name: 'posts',
    path: '/posts',
    element: <Posts />,
    permissions: ['VIEW_POSTS'],
    translations: ['posts'],
  },
  {
    name: 'createPost',
    path: '/posts/create',
    element: <CreatePost />,
    permissions: ['CREATE_POST'],
    translations: ['post'],
  },
  {
    name: 'post',
    path: '/posts/:id',
    element: <Post />,
    permissions: ['VIEW_POSTS'],
    translations: ['post'],
    children: [
      {
        name: 'postEdit',
        path: 'edit',
        element: <PostEdit />,
        permissions: ['EDIT_POST'],
        translations: ['post'],
      },
      {
        name: 'postComments',
        path: 'comments',
        element: <PostComments />,
        permissions: ['VIEW_COMMENTS'],
        translations: ['post'],
      },
    ],
  },
  {
    name: 'forbidden',
    path: '/403',
    element: <Forbidden />,
    translations: ['forbidden'],
  },
  {
    name: 'notFound',
    path: '/404',
    element: <NotFound />,
    translations: ['notFound'],
  },
];

export default routes;
