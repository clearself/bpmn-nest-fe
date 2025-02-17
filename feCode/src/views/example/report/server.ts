import { request } from '@/utils/service'
import { deleteItemProp, saveDataProp } from './type'
// 列表接口
export const init = (query: Pagination & { remark?: string }) => {
  return request<ApiResponseData>({
    method: 'GET',
    url: `/report/super/list`,
    params: query
  })
}
// 删除
export const deleteItem = (query: deleteItemProp) => {
  return request<ApiResponseData>({
    method: 'DELETE',
    url: `/system/notice/${query.id}`
  })
}
// 添加
export const add = (data: saveDataProp) => {
  return request<ApiResponseData>({
    method: 'POST',
    url: `/system/notice`,
    data: data
  })
}
// 更新
export const edit = (data: saveDataProp) => {
  return request<ApiResponseData>({
    method: 'PUT',
    url: `/system/notice`,
    data: data
  })
}
