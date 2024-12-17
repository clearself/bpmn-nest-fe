import { request } from '@/utils/service'
import { deleteItemProp, saveDataProp } from './type'
// 列表接口
export const init = (query: Pagination & { postCode?: string; postName?: string; status?: number }) => {
  return request<ApiResponseData>({
    method: 'GET',
    url: `/system/post/list`,
    params: query
  })
}
// 删除
export const deleteItem = (query: deleteItemProp) => {
  return request<ApiResponseData>({
    method: 'DELETE',
    url: `/system/post/${query.ids}`,
    params: query
  })
}
// 添加
export const add = (data: saveDataProp) => {
  return request<ApiResponseData>({
    method: 'POST',
    url: `/system/post`,
    data: data
  })
}
// 更新
export const edit = (data: saveDataProp) => {
  return request<ApiResponseData>({
    method: 'PUT',
    url: `/system/post`,
    data: data
  })
}