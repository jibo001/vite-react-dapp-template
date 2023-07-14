import { useEffect, useState } from 'react';
import { fromHex } from 'viem';

/**
 * @return 获取当前链的 chainId
 */
const useActiveChain = () => {
  const [chainId, setChainId] = useState<number>();
  useEffect(() => {
    setChainId(fromHex(window?.ethereum ? window.ethereum.chainId : '0x0', 'number'));
    if (window?.ethereum) {
      window.ethereum.on('chainChanged', (currentChainId: `0x${string}`) => {
        setChainId(fromHex(currentChainId, 'number'));
      });
    }
  }, []);
  return chainId;
};

export default useActiveChain
