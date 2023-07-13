import { useCallback } from "react"
import { hashMessage } from "viem"
import { useAccount, useWalletClient } from "wagmi"
import useCatchTxError from "./useCatchTxError"
import { useLocalStorageState } from "ahooks";
import { Sign } from "@/types/account";
import useConnectWallet from "./useConnectWallet";

export default function useSign() {
  const defaultSign: Sign = {
    address: '',
    message: '',
    signature: ''
  }
  const rawMessage = Math.random().toString(36).slice(-8)

  const { connectWallet } = useConnectWallet()
  const [sign, setSign] = useLocalStorageState<Sign | undefined>(
    'sign',
    {
      defaultValue: defaultSign,
    },
  );
  const { data: walletClient } = useWalletClient()
  const { address, isConnected } = useAccount()
  const { handleError } = useCatchTxError()

  const removeSign = useCallback(() => {
    setSign(defaultSign)
  }, [])

  const signAsync = useCallback(async () => {
    try {
      if (!isConnected) return await connectWallet()
      const signature = await walletClient.signMessage({
        account: address,
        message: rawMessage
      })
      const message = hashMessage(rawMessage)
      setSign({
        address,
        message,
        signature
      })
    } catch (error) {
      handleError(error)
      return false
    }
    return true
  }, [handleError, isConnected])


  return {
    sign,
    signAsync,
    removeSign
  }
}