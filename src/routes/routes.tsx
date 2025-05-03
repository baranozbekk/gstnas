const routes: RouteConfig[] = [
  {
    name: 'root',
    path: '/',
    element: <RootLayout />,
    children: [
      {
        name: 'home',
        path: '/',
        lazyComponent: () => import('../pages/Home'),
        permissions: ['VIEW_POSTS', 'VIEW_COMMENTS'],
        translations: ['home'],
      },
      {
        name: 'posts',
        path: '/posts',
        lazyComponent: () => import('../pages/Posts'),
        permissions: ['VIEW_POSTS'],
        translations: ['posts'],
      },
      {
        name: 'createPost',
        path: '/posts/create',
        lazyComponent: () => import('../pages/CreatePost'),
        permissions: ['CREATE_POST'],
        translations: ['createPost'],
      },
      {
        name: 'post',
        path: '/posts/:id',
        element: <PostLayout />,
        permissions: ['VIEW_POSTS'],
        translations: ['post'],
        children: [
          {
            name: 'postDetail',
            path: '',
            lazyComponent: () => import('../pages/post/PostDetail'),
            permissions: ['VIEW_POSTS'],
            translations: ['postDetail'],
          },
          {
            name: 'editPost',
            path: 'edit',
            lazyComponent: () => import('../pages/post/EditPost'),
            permissions: ['EDIT_POST'],
            translations: ['editPost'],
          },
          {
            name: 'postComments',
            path: 'comments',
            lazyComponent: () => import('../pages/post/PostComments'),
            permissions: ['VIEW_COMMENTS'],
            translations: ['postComments'],
          },
        ],
      },
      {
        name: 'login',
        path: '/login',
        element: <Login />,
        translations: ['login'],
      },
      {
        name: 'forbidden',
        path: '/403',
        element: <ForbiddenPage />,
        translations: ['forbidden'],
      },
      {
        name: 'notFound',
        path: '*',
        element: <NotFound />,
        translations: ['notFound'],
      },
    ],
  },
];

export default routes;
