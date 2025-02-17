import { request } from '@/utils/service'
import { deleteItemProp, saveDataProp } from './type'
// 列表接口
export const init = (
  query: Pagination & {
    logisticsCompany?: string
    logisticsMethod?: string
    logisticsNumber?: string
    trackingNo?: string
    contacts?: string
    contactPhone?: string
    licensePlate_number?: string
  }
) => {
  return request<ApiResponseData>({
    method: 'GET',
    url: `/logistics/get`,
    params: query
  })
}
// 删除
export const deleteItem = (query: deleteItemProp) => {
  return request<ApiResponseData>({
    method: 'DELETE',
    url: `/logistics/delete`,
    params: query
  })
}
// 添加
export const add = (data: saveDataProp) => {
  return request<ApiResponseData>({
    method: 'POST',
    url: `/logistics/add`,
    data: data
  })
}
