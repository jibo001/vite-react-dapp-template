import { useCallback } from "react";
import { useConnect } from "wagmi";

export default function useConnectWallet() {
  const { connectAsync, connectors } = useConnect()

  const connectWallet = useCallback(async () => {
    await connectAsync({ connector: connectors[0] })
  }, [])

  return {
    connectWallet
  }
}