import DescriptionWithTx from '@/components/Toast/DescriptionWithTx'
import { ReactNode, useMemo } from 'react'
import { ToastOptions, toast } from 'react-toastify'

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
  const toastSuccess = (txHash: string, children: string | ReactNode) =>
    toast(<DescriptionWithTx txHash={txHash}>{children}</DescriptionWithTx>, {
      ...toastConfig,
    })
  const toastError = (txHash: string, children: string | ReactNode) =>
    toast(<DescriptionWithTx txHash={txHash}>{children}</DescriptionWithTx>, {
      ...toastConfig,
      type: 'error',
    })
  return {
    toastSuccess,
    toastError,
  }
}
