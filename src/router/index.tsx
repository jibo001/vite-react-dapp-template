import Hello from '@/views/Hello/Hello'
import Home from '@/views/Home/Home'
import { Navigate, useRoutes } from 'react-router-dom'

const Routes = () =>
  useRoutes([
    {
      path: '/',
      //重定向
      element: <Navigate to="/home" />,
    },
    {
      path: '/home',
      element: <Home />,
    },
    {
      path: '/hello',
      element: <Hello />,
    },
    {
      path: '/*',
      element: <div>Not Found</div>,
    },
  ])

export default Routes
