import { Toast } from "antd-mobile"
import { useCallback, useState } from "react"
import { Address, BaseError, Hash, UnknownRpcError } from "viem"
import { SendTransactionResult, WaitForTransactionResult, waitForTransaction } from "wagmi/actions"
import useToast from "./useToast"
import { useTranslation } from "react-i18next"

/**
 * @description 捕获交易错误 可拿到hash
 */
export type CatchTxErrorReturn = {
  fetchWithCatchTxError: (fn: () => Promise<SendTransactionResult | Hash>) => Promise<WaitForTransactionResult>
  fetchTxResponse: (fn: () => Promise<SendTransactionResult | Hash>) => Promise<SendTransactionResult>
  handleError: (error: any) => void
  loading: boolean
  txResponseLoading: boolean
}

/// only show corrected parsed viem error
export function parseError<TError>(err: TError): BaseError | null {
  if (err instanceof BaseError) {
    return err
  }
  if (typeof err === 'string') {
    return new UnknownRpcError(new Error(err))
  }
  if (err instanceof Error) {
    return new UnknownRpcError(err)
  }
  return null
}
export default function useCatchTxError(): CatchTxErrorReturn {
  const { toastSuccess, toastError } = useToast()
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)
  const [txResponseLoading, setTxResponseLoading] = useState(false)


  const parseError = (error: any) => {
    return JSON.parse(JSON.stringify(error))
  }

  const handleError = (error: any) => {
    if (!localStorage.getItem('wagmi.connected')) return Toast.show('Please connect wallet first')
    error = parseError(error)
    Toast.show(error.cause.reason || error.shortMessage)
  }

  const handleTxError = useCallback((error: any, hash: Address) => {
    const err = parseError(error)
    console.log(error);

    toastError(hash, `${t('Failed')} : ${err.cause.reason || err.shortMessage}`)
  }, [])




  const fetchTxResponse = useCallback(
    async (callTx: () => Promise<SendTransactionResult | Hash>): Promise<SendTransactionResult> => {
      let tx: SendTransactionResult | Hash = null

      try {
        setTxResponseLoading(true)
        tx = await callTx()
        const hash = typeof tx === 'string' ? tx : tx.hash
        Toast.show('Transaction Submitted')
        toastSuccess
        return { hash }
      } catch (error: any) {
        handleError(error)
      } finally {
        setTxResponseLoading(false)
      }

      return null
    },
    [],
  )


  const fetchWithCatchTxError = useCallback(
    async (callTx: () => Promise<SendTransactionResult | Hash>): Promise<WaitForTransactionResult | null> => {
      let tx: SendTransactionResult | Hash = null
      try {
        setLoading(true)
        /**
         * https://github.com/vercel/swr/pull/1450
         *
         * wait for useSWRMutation finished, so we could apply SWR in case manually trigger tx call
         */
        tx = await callTx()
        const hash = typeof tx === 'string' ? tx : tx.hash
        // Toast.show('Transaction Submitted')
        const receipt = await waitForTransaction({
          hash,
        })
        toastSuccess(hash, t('Transaction Success'))
        return receipt
      } catch (error: any) {
        if (!tx) {
          handleError(error)
        } else {
          handleTxError(error, typeof tx === 'string' ? tx : tx.hash)
        }

      } finally {
        setLoading(false)
      }

      return null
    },
    [],
  )

  return {
    fetchWithCatchTxError,
    fetchTxResponse,
    handleError,
    loading,
    txResponseLoading,
  }
}