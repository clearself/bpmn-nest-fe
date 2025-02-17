import { request } from '@/utils/service'
import { deleteItemProp, saveDataProp } from './type'
// 列表接口
export const init = (query: { deptName?: string; status?: string | number }) => {
  return request<ApiResponseData>({
    method: 'GET',
    url: `/system/dept/list`,
    params: query
  })
}
// 删除
export const deleteItem = (query: deleteItemProp) => {
  return request<ApiResponseData>({
    method: 'DELETE',
    url: `/system/dept/${query.id}`,
    params: query
  })
}
// 添加
export const add = (data: saveDataProp) => {
  return request<ApiResponseData>({
    method: 'POST',
    url: `/system/dept`,
    data: data
  })
}
// 更新
export const edit = (data: saveDataProp) => {
  return request<ApiResponseData>({
    method: 'PUT',
    url: `/system/dept`,
    data: data
  })
}
// 查询部门列表
export const listDept = () => {
  return request({
    url: '/system/dept/list',
    method: 'get'
  })
}

// 查询部门列表（排除节点）
export const listDeptExcludeChild = (deptId: string) => {
  return request({
    url: '/system/dept/list/exclude/' + deptId,
    method: 'get'
  })
}
