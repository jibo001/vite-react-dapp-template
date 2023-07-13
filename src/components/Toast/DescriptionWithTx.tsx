import { useActiveChain } from '@/hooks/useActiveChain'
import { formatAddress, getBlockExploreLink, getBlockExploreName } from '@/utils'
import { useTranslation } from 'react-i18next'

interface DescriptionWithTxProps {
  description?: string
  txHash?: string
  txChainId?: number
}

const DescriptionWithTx: React.FC<React.PropsWithChildren<DescriptionWithTxProps>> = ({
  txHash,
  txChainId,
  children,
}) => {
  const chainId = useActiveChain()
  const { t } = useTranslation()

  return (
    <>
      {typeof children === 'string' ? <div>{children}</div> : children}
      {txHash && (
        <a target="_blank" href={getBlockExploreLink(txHash, 'transaction', txChainId || chainId)}>
          {t('View on site', { site: getBlockExploreName(txChainId || chainId) })}: {formatAddress(txHash)}
        </a>
      )}
    </>
  )
}

export default DescriptionWithTx
