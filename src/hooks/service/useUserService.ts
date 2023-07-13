import { useQuery } from "@tanstack/react-query";
import request from "@/utils/request";

export const useQueryUserInfo = (params?: any) => {
  return useQuery(['userInfo'], async () => {
    return await request<{ level: number, isActivate: number }>('GET', '/users/getUserInfo', params)
  }, {
    enabled: true,
  })
}

