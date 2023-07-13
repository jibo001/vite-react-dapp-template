import { AppWrapper } from './container/AppWrapper'
import Routes from './router'
import Web3Wrapper from './container/Web3Wrapper'
import ReactQueryWrapper from './container/ReactQueryWrapper'

function App() {
  return (
    <Web3Wrapper>
      <ReactQueryWrapper>
        <AppWrapper>
          <Routes />
        </AppWrapper>
      </ReactQueryWrapper>
    </Web3Wrapper>
  )
}

export default App
