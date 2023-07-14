import { createBrowserRouter } from 'react-router-dom'
import lazyLoadRoutes from '@/components/LazyLoadRoutes/lazyLoadRoutes'
import { AppWrapper } from '@/container/AppWrapper'

const router = createBrowserRouter([
  {
    path: '/',
    // 重定向
    element: <AppWrapper />,
    children: [
      {
        path: '',
        element: lazyLoadRoutes(() => import('@/views/home/Home')),
        // vue router meta
        handle: {
          name: 'home',
          isHeaader: false,
        },
      },
      {
        path: 'hello',
        element: lazyLoadRoutes(() => import('@/views/hello/Hello')),
      },
      {
        path: '*',
        element: <div>Not Found</div>,
      },
    ],
  },
])

export default router
