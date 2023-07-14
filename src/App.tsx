import { AppWrapper } from './container/AppWrapper'
import Web3Wrapper from './container/Web3Wrapper'
import ReactQueryWrapper from './container/ReactQueryWrapper'
import { RouterProvider } from 'react-router-dom'
import router from './router'

function App() {
  return (
    <Web3Wrapper>
      <ReactQueryWrapper>
        <AppWrapper>
          <RouterProvider router={router} />
        </AppWrapper>
      </ReactQueryWrapper>
    </Web3Wrapper>
  )
}

export default App
