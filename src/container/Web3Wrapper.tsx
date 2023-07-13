import { env } from '@/config/env'
import { chains, wagmiConfig } from '@/config/wagmi'
import { RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { ReactNode } from 'react'
import { WagmiConfig } from 'wagmi'

const Web3Wrapper = ({ children }: { children: ReactNode }) => {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains} initialChain={env.chainId}>
        {children}
      </RainbowKitProvider>
    </WagmiConfig>
  )
}

export default Web3Wrapper
