import { Toast } from 'antd-mobile';
import { useCallback, useState } from 'react';
import { Address, Hash } from 'viem';
import { SendTransactionResult, WaitForTransactionResult, waitForTransaction } from 'wagmi/actions';
import { useTranslation } from 'react-i18next';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import useToast from './useToast';

/**
 * @description 捕获交易错误 可拿到hash
 */
export type CatchTxErrorReturn = {
  fetchWithCatchTxError: (fn: () => Promise<SendTransactionResult | Hash>) => Promise<WaitForTransactionResult>
  fetchTxResponse: (fn: () => Promise<SendTransactionResult | Hash>) => Promise<SendTransactionResult>
  handleError: (error: any) => void
  loading: boolean
  txResponseLoading: boolean
};

export default function useCatchTxError(): CatchTxErrorReturn {
  const { toastSuccess, toastError } = useToast();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [txResponseLoading, setTxResponseLoading] = useState(false);
  const { openConnectModal } = useConnectModal();

  const parseError = (error: any) => JSON.parse(JSON.stringify(error));

  const handleError = useCallback((error: any) => {
    if (!localStorage.getItem('wagmi.connected')) {
      toastError('', t('Please connect wallet'));
      openConnectModal();
    } else {
      let err = null
      try {
        err = parseError(error);
      } finally {
        Toast.show(err.cause.reason || err.shortMessage);
      }
    }
  }, [openConnectModal, t, toastError]);

  const handleTxError = useCallback((error: any, hash: Address) => {
    const err = parseError(error);
    toastError(hash, `${t('Failed')} : ${err.cause.reason || err.shortMessage}`);
  }, [t, toastError]);

  const fetchTxResponse = useCallback(
    async (callTx: () => Promise<SendTransactionResult | Hash>): Promise<SendTransactionResult> => {
      let tx: SendTransactionResult | Hash = null;

      try {
        setTxResponseLoading(true);
        tx = await callTx();
        const hash = typeof tx === 'string' ? tx : tx.hash;
        toastSuccess(hash, t('Transaction Submit'));
        return { hash };
      } catch (error: any) {
        handleError(error);
      } finally {
        setTxResponseLoading(false);
      }

      return null;
    },
    [handleError, t, toastSuccess],
  );

  const fetchWithCatchTxError = useCallback(
    async (callTx: () => Promise<SendTransactionResult | Hash>): Promise<WaitForTransactionResult | null> => {
      let tx: SendTransactionResult | Hash = null;
      try {
        setLoading(true);
        /**
         * https://github.com/vercel/swr/pull/1450
         *
         * wait for useSWRMutation finished, so we could apply SWR in case manually trigger tx call
         */
        tx = await callTx();
        const hash = typeof tx === 'string' ? tx : tx.hash;
        // Toast.show('Transaction Submitted')
        const receipt = await waitForTransaction({
          hash,
        });
        toastSuccess(hash, t('Transaction Success'));
        return receipt;
      } catch (error: any) {
        if (!tx) {
          handleError(error);
        } else {
          handleTxError(error, typeof tx === 'string' ? tx : tx.hash);
        }
      } finally {
        setLoading(false);
      }

      return null;
    },
    [handleError, handleTxError, t, toastSuccess],
  );

  return {
    fetchWithCatchTxError,
    fetchTxResponse,
    handleError,
    loading,
    txResponseLoading,
  };
}
