import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useAccount } from 'wagmi'
import { Toast } from 'antd-mobile'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import useSign from '@/hooks/useSign'
// Create a client

const ReactQueryWrapper: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { address } = useAccount()
  const { sign } = useSign()

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        // enabled: !!address && !!sign,
        // retry: false,
        onError: (error: any) => {
          Toast.show(error.message)
        },
      },
    },
  })

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools />
      {children}
    </QueryClientProvider>
  )
}

export default ReactQueryWrapper
