import DescriptionWithTx from '@/components/Toast/DescriptionWithTx'
import { ReactNode, useMemo } from 'react'
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
  const toastSuccess = (txHash: Address, children: string | ReactNode) =>
    toast(<DescriptionWithTx txHash={txHash}>{children}</DescriptionWithTx>, {
      ...toastConfig,
    })
  const toastError = (txHash: Address, children: string | ReactNode) =>
    toast(<DescriptionWithTx txHash={txHash}>{children}</DescriptionWithTx>, {
      ...toastConfig,
      type: 'error',
    })
  return {
    toastSuccess,
    toastError,
  }
}
