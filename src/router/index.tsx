import { Navigate, createBrowserRouter } from 'react-router-dom'
import lazyLoadRoutes from '@/components/LazyLoadRoutes/lazyLoadRoutes'

const router = createBrowserRouter([
  {
    path: '/',
    // 重定向
    element: <Navigate to="/home" />,
  },
  {
    path: '/home',
    element: lazyLoadRoutes(() => import('@/views/home/Home')),
  },
  {
    path: '/hello',
    element: lazyLoadRoutes(() => import('@/views/hello/Hello')),
  },
  {
    path: '/*',
    element: <div>Not Found</div>,
  },
])

export default router
