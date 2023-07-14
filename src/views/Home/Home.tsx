import { useContractRead, useWalletClient } from 'wagmi'
import { useTranslation } from 'react-i18next'
import { memo } from 'react'
import { MaxUint256 } from 'ethers'
import { Link } from 'react-router-dom'
import { Button } from 'antd-mobile'
import { useQueryUserInfo } from '@/hooks/service/useUserService'
import { getErc20Contract, getIdoStakeContract } from '@/utils/contractHelpers'
import useCallWithGasPrice from '@/hooks/useCallWithGasPrice'
import useSign from '@/hooks/useSign'
import useActiveChain from '@/hooks/useActiveChain'
import useCatchTxError from '@/hooks/useCatchTxError'
import { env } from '@/config/env'
import useLocal from '@/hooks/useLocal'
import i18n from '@/locales/config'
import { toWei } from '@/utils/formatBalance'

const Home = memo(() => {
  const { data: walletClient } = useWalletClient()
  const { t } = useTranslation()
  const { setLang } = useLocal()
  const idoStakeContract = getIdoStakeContract(walletClient!)
  const ido = useContractRead({
    ...idoStakeContract,
    functionName: 'BTD',
  })

  const queryUserInfo = useQueryUserInfo()

  const PoolInfo = () => {
    const { fetchWithCatchTxError } = useCatchTxError()
    const { callWithGasPrice } = useCallWithGasPrice()
    const { signAsync } = useSign()
    const activeChain = useActiveChain()
    const sbtcContract = getErc20Contract(ido.data!, walletClient!)

    const handleApprove = async () => {
      await fetchWithCatchTxError(() =>
        callWithGasPrice(sbtcContract!, 'approve', [idoStakeContract.address, MaxUint256]),
      )
    }

    const handleDeposit = async () => {
      await fetchWithCatchTxError(() => callWithGasPrice(idoStakeContract!, 'deposit', [1, toWei('2', 18), false]))
    }

    const toggleI18n = () => {
      setLang(i18n.language === 'zh-CN' ? 'en-US' : 'zh-CN')
    }
    const handleSign = async () => {
      const isSuccess = await signAsync()
      if (isSuccess) await queryUserInfo.refetch()
    }

    if (ido.isFetching) {
      return <div>Loading...</div>
    }
    if (ido.isSuccess) {
      return (
        <div>
          <Button className="lang custom-btn" id="hover-btn-line" onClick={() => toggleI18n()}>
            {i18n.language === 'zh-CN' ? 'CN' : 'EN'}
          </Button>

          <div>
            项目chainId:
            {env.chainId}
          </div>
          <div>
            当前chainId:
            {activeChain}
          </div>
          <div>
            address:
            {ido.data}
          </div>
          <div>
            Level:
            {queryUserInfo.isLoading ? 'loading' : queryUserInfo.data.data?.isActivate || -1}
          </div>
          <Button color="primary" fill="solid" onClick={handleApprove}>
            授权
            {t('hello')}
          </Button>
          <Button onClick={handleDeposit}>质押</Button>
          <Button onClick={handleSign}>签名</Button>
        </div>
      )
    }
    if (ido.isError) {
      return <div>Error</div>
    }
    return null
  }

  return (
    <>
      <div>
        <div>
          <Link to="/hello">
            <Button color="primary" fill="solid">
              hello
            </Button>
          </Link>
        </div>
        <div className="text-red-500">{PoolInfo()}</div>
      </div>
    </>
  )
})

export default Home
