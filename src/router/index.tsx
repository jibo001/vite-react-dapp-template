import { useLazy } from '@/hooks/useLazy'
import { Navigate, createBrowserRouter } from 'react-router-dom'

const router = createBrowserRouter([
  {
    path: '/',
    //重定向
    element: <Navigate to="/home" />,
  },
  {
    path: '/home',
    element: useLazy(() => import('@/views/home/Home')),
  },
  {
    path: '/hello',
    element: useLazy(() => import('@/views/hello/Hello')),
  },
  {
    path: '/*',
    element: <div>Not Found</div>,
  },
])

export default router
