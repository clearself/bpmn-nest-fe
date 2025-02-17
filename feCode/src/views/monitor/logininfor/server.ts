import { request } from '@/utils/service'
// 列表接口
export const init = (query: Pagination & { postCode?: string; postName?: string; status?: number }) => {
  return request<ApiResponseData>({
    method: 'GET',
    url: `/monitor/logininfor/list`,
    params: query
  })
}

// 删除
export const deleteItem = (ids: string) => {
  return request<ApiResponseData>({
    method: 'DELETE',
    url: `/monitor/logininfor/${ids}`
  })
}

// 清空
export const emptyAll = () => {
  return request<ApiResponseData>({
    method: 'DELETE',
    url: `/monitor/logininfor/clean`
  })
}
