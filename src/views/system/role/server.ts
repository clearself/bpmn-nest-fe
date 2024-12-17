import { request } from '@/utils/service'
import { deleteItemProp, saveDataProp } from './type'
// 列表接口
export const init = (query: Pagination & { roleName?: string; roleKey?: string; status?: number }) => {
  return request<ApiResponseData>({
    method: 'GET',
    url: `/system/role/list`,
    params: query
  })
}
// 删除
export const deleteItem = (query: deleteItemProp) => {
  return request<ApiResponseData>({
    method: 'DELETE',
    url: `/system/role/${query.id}`,
    params: query
  })
}
// 添加
export const add = (data: saveDataProp) => {
  return request<ApiResponseData>({
    method: 'POST',
    url: `/system/role`,
    data: data
  })
}
// 更新
export const edit = (data: saveDataProp) => {
  return request<ApiResponseData>({
    method: 'PUT',
    url: `/system/role`,
    data: data
  })
}
// 查询角色详细
export const getRole = (roleId: string) => {
  return request({
    url: '/system/role/' + roleId,
    method: 'get'
  })
}
// 角色数据权限
export const dataScope = (data: any) => {
  return request({
    url: '/system/role/dataScope',
    method: 'put',
    data: data
  })
}
// 根据角色ID查询部门树结构
export const deptTreeSelect = (roleId: string) => {
  return request({
    url: '/system/role/deptTree/' + roleId,
    method: 'get'
  })
}
