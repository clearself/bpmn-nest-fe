import { request } from '@/utils/service'
// 列表接口
export const init = (
  query: Pagination & {
    logisticsCompany?: string
  }
) => {
  return request<ApiResponseData>({
    method: 'GET',
    url: `/logistics/get`,
    params: query
  })
}
