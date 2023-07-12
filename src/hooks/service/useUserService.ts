import { useQuery } from "@tanstack/react-query";
import request from "@/utils/request";

export const useQueryUserInfo = (params?: any) => {
  return useQuery(['userInfo'], () => {
    return request('GET', '/v1/getAgentLevel', params)
  }, {
    enabled: true,
  })
}

