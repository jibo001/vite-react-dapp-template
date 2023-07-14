import { configureChains, createConfig } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import {
  injectedWallet,
  metaMaskWallet,
  walletConnectWallet,
  trustWallet,
} from '@rainbow-me/rainbowkit/wallets';
import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import chainMap from './constants/chainId';
import { env } from '@/config/env';

export const { chains, publicClient, webSocketPublicClient } = configureChains(
  [chainMap[env.chainId]],
  [publicProvider()],
);

const connectors = connectorsForWallets([
  {
    groupName: 'Recommended',
    wallets: [
      injectedWallet({ chains }),
      metaMaskWallet({ chains, projectId: env.projectId }),
      walletConnectWallet({ projectId: env.projectId, chains }),
      trustWallet({ chains, projectId: env.projectId }),
    ],
  },
]);

export const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});
