import { request } from '@/utils/service'
import { deleteItemProp, saveDataProp } from './type'
// 列表接口
export const init = (query: { menuName?: string; status?: string | number }) => {
  return request<ApiResponseData>({
    method: 'GET',
    url: `/system/menu/list`,
    params: query
  })
}
// 删除
export const deleteItem = (query: deleteItemProp) => {
  return request<ApiResponseData>({
    method: 'DELETE',
    url: `/system/menu/${query.id}`,
    params: query
  })
}
// 添加
export const add = (data: saveDataProp) => {
  return request<ApiResponseData>({
    method: 'POST',
    url: `/system/menu`,
    data: data
  })
}
// 更新
export const edit = (data: saveDataProp) => {
  return request<ApiResponseData>({
    method: 'PUT',
    url: `/system/menu`,
    data: data
  })
}
// 查询菜单列表
export const listMenu = () => {
  return request({
    url: '/system/menu/list',
    method: 'get'
  })
}

// 查询菜单下拉树结构
export const treeselect = () => {
  return request({
    url: '/system/menu/treeselect',
    method: 'get'
  })
}

// 根据角色ID查询菜单下拉树结构
export const roleMenuTreeselect = (roleId: string) => {
  return request({
    url: '/system/menu/roleMenuTreeselect/' + roleId,
    method: 'get'
  })
}
