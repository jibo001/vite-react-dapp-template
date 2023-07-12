import { Address, WagmiConfig, useContractRead, useWalletClient } from 'wagmi'
import './App.css'
import '@rainbow-me/rainbowkit/styles.css'
import { useTranslation } from 'react-i18next'
import { getErc20Contract, getIdoStakeContract } from '@/utils/contractHelpers'
import { useQueryUserInfo } from '@/hooks/service/useUserService'
import useTokenApprovalStatus from '@/hooks/useTokenApprovalStatus'
import { useCallWithGasPrice } from '@/hooks/useCallWithGasPrice'
import useSign from '@/hooks/useSign'
import { useActiveChain } from '@/hooks/useActiveChain'
import useCatchTxError from '@/hooks/useCatchTxError'
import { MaxUint256 } from 'ethers'
import BigNumber from 'bignumber.js'
import { Button } from 'antd-mobile'
import { env } from '@/config/env'
import { useLocal } from '@/hooks/useLocal'
import { RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { chains, wagmiConfig } from './config/wagmi'
import { AppWrapper } from './layout/AppWrapper'
import i18n from './locales/config'

function Home() {
  console.log(env)

  const { data: walletClient } = useWalletClient()
  const { t } = useTranslation()
  const { setLang } = useLocal()
  const idoStakeContract = getIdoStakeContract(walletClient!)
  const ido = useContractRead({
    ...idoStakeContract,
    functionName: 'SBTC',
  })

  const useUserInfo = useQueryUserInfo()

  const PoolInfo = () => {
    const { isVaultApproved } = useTokenApprovalStatus(ido.data as Address, idoStakeContract.address)
    const { fetchWithCatchTxError, loading: isApproving } = useCatchTxError()
    const { callWithGasPrice } = useCallWithGasPrice()
    const { signLoading, signAsync } = useSign()
    const activeChain = useActiveChain()
    const sbtcContract = getErc20Contract(ido.data!, walletClient!)

    const handleApprove = async () => {
      const receipt = await fetchWithCatchTxError(() => {
        return callWithGasPrice(sbtcContract!, 'approve', [idoStakeContract.address, MaxUint256])
      })
    }

    const handleDeposit = async () => {
      const receipt = await fetchWithCatchTxError(() => {
        return callWithGasPrice(idoStakeContract!, 'deposit', [1, new BigNumber(1000), false])
      })
      console.log(receipt)
    }

    const toggleI18n = () => {
      setLang(i18n.language === 'zh-CN' ? 'en-US' : 'zh-CN')
    }
    const handleSign = async () => {
      const isSuccess = await signAsync()
      if (isSuccess) await useUserInfo.refetch()
    }

    if (ido.isFetching) {
      return <div>Loading...</div>
    } else if (ido.isSuccess) {
      return (
        <div>
          <Button className="lang custom-btn" id="hover-btn-line" onClick={() => toggleI18n()}>
            {i18n.language === 'zh-CN' ? 'CN' : 'EN'}
          </Button>

          <div>项目chainId:{env.chainId}</div>
          <div>当前chainId:{activeChain}</div>
          <div>address:{ido.data}</div>
          <Button color="primary" fill="solid" loading={isApproving} onClick={handleApprove}>
            授权
            {t('hello')}
          </Button>
          <Button onClick={handleDeposit}>质押</Button>
          <Button onClick={handleSign} loading={signLoading}>
            签名
          </Button>
        </div>
      )
    }
  }

  return (
    <>
      <div>
        <div></div>
        <div className="text-red-500">{PoolInfo()}</div>
      </div>
    </>
  )
}

function App() {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains} initialChain={env.chainId}>
        <AppWrapper>
          <Home />
        </AppWrapper>
      </RainbowKitProvider>
    </WagmiConfig>
  )
}

export default App
