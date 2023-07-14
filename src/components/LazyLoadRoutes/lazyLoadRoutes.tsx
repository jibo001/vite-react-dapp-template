import { Skeleton } from 'antd-mobile'
import React from 'react'
/**
 * @function useResize 使用的类型
 */
export type defRC = {
  default: React.ComponentType<any>
}
/**
 * 类似 React.lazy，实现组件懒加载
 * @param callback 返回 Promise 的函数
 * @returns JSX
 */
export function useLazy(callback: () => Promise<defRC>) {
  const LazyComp = React.lazy(callback)
  return (
    <React.Suspense fallback={<Skeleton />}>
      <LazyComp />
    </React.Suspense>
  )
}
