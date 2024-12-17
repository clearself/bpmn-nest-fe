import { request } from '@/utils/service'
import { deleteItemProp, saveDataProp } from './type'
// 列表接口
export const init = (query: Pagination & { dictName?: string; dictType?: string; status?: number }) => {
  return request<ApiResponseData>({
    method: 'GET',
    url: `/system/dict/data/list`,
    params: query
  })
}
// 删除
export const deleteItem = (query: deleteItemProp) => {
  return request<ApiResponseData>({
    method: 'DELETE',
    url: `/system/dict/data/${query.id}`,
    params: query
  })
}
// 添加
export const add = (data: saveDataProp) => {
  return request<ApiResponseData>({
    method: 'POST',
    url: `/system/dict/data`,
    data: data
  })
}
// 更新
export const edit = (data: saveDataProp) => {
  return request<ApiResponseData>({
    method: 'PUT',
    url: `/system/dict/data`,
    data: data
  })
}
