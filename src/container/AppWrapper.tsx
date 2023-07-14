import { ToastContainer } from 'react-toastify'
import { Outlet, useMatches } from 'react-router-dom'
import { useEffect } from 'react'
import CustomConnectButton from '@/components/CustomConnectButton/CustomConnectButton'
import useLocal from '@/hooks/useLocal'

export const AppWrapper: React.FC<React.PropsWithChildren> = () => {
  // 双语
  useLocal()

  const matches = useMatches()

  useEffect(() => {
    console.log('matches', matches[1]) // vue router meta
  }, [matches])

  return (
    <div>
      <CustomConnectButton />
      <ToastContainer />
      <Outlet />
    </div>
  )
}
