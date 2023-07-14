import { Skeleton } from 'antd-mobile'
import React from 'react'
import { RouterProvider } from 'react-router-dom'
import Web3Wrapper from './container/Web3Wrapper'
import ReactQueryWrapper from './container/ReactQueryWrapper'
import router from './router'

function App() {
  return (
    <Web3Wrapper>
      <ReactQueryWrapper>
        <React.Suspense fallback={<Skeleton />}>
          <RouterProvider router={router} />
        </React.Suspense>
      </ReactQueryWrapper>
    </Web3Wrapper>
  )
}

export default App
