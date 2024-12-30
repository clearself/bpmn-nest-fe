import { request } from '@/utils/service'
// 采购已完成列表接口
export const initPurchase = (query: any, type: string) => {
  return request<ApiResponseData>({
    method: 'GET',
    url: type === '1' ? '/pch/purchase/listPage' : `/pch/purchase/queryCompleted`,
    // url: `/pch/purchase/queryCompleted`,
    params: query
  })
}

// 采购退货已完成列表接口
export const initReturn = (query: any) => {
  return request<ApiResponseData>({
    method: 'GET',
    url: `/pch/return/queryCompleted`,
    params: query
  })
}
