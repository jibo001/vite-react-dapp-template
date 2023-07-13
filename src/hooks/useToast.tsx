import DescriptionWithTx from '@/components/Toast/DescriptionWithTx'
import { useMemo } from 'react'
import { ToastOptions, toast } from 'react-toastify'
import { Address } from 'viem'

export default function useToast() {
  const toastConfig = useMemo<ToastOptions>(
    () => ({
      type: 'success',
      position: 'top-right',
      autoClose: 3000,
      progress: null,
      hideProgressBar: true,
      pauseOnHover: true,
    }),
    [],
  )
  const toastSuccess = (description: string, txHash: Address) =>
    toast(<DescriptionWithTx description={description} txHash={txHash}></DescriptionWithTx>, {
      ...toastConfig,
    })
  const toastError = (description: string, txHash: Address) =>
    toast(<DescriptionWithTx description={description} txHash={txHash}></DescriptionWithTx>, {
      ...toastConfig,
      type: 'error',
    })
  return {
    toastSuccess,
    toastError,
  }
}
