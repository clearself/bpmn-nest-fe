import { request } from '@/utils/service'
import { parseStrEmpty } from '@/utils/ruoyi'
import { deleteItemProp, saveDataProp } from './type'
// 列表接口
export const init = (
  query: Pagination & { userName?: string; deptId?: string; phonenumber?: string; status?: number }
) => {
  return request<ApiResponseData>({
    method: 'GET',
    url: `/system/user/list`,
    params: query
  })
}
// 删除
export const deleteItem = (query: deleteItemProp) => {
  return request<ApiResponseData>({
    method: 'DELETE',
    url: `/system/user/${query.id}`,
    params: query
  })
}
// 添加
export const add = (data: {
  userName: string
  password: string
  nickName: string
  deptId?: string
  phonenumber?: string
  email?: string
  sex?: string
  postIds?: number[]
  roleIds?: number[]
  remark?: string
  status?: string
}) => {
  return request<ApiResponseData>({
    method: 'POST',
    url: `/system/user`,
    data: data
  })
}
// 更新
export const edit = (data: {
  userId?: string
  nickName: string
  deptId?: string
  phonenumber?: string
  email?: string
  sex?: string
  postIds?: number[]
  roleIds?: number[]
  remark?: string
  status?: string
}) => {
  return request<ApiResponseData>({
    method: 'PUT',
    url: `/system/user`,
    data: data
  })
}

// 查询部门下拉树结构
export const deptTreeSelect = () => {
  return request({
    url: '/system/user/deptTree',
    method: 'get'
  })
}
// 查询用户详情
export const getUser = (userId?: string) => {
  return request({
    url: '/system/user/' + parseStrEmpty(userId),
    method: 'get'
  })
}

// 用户密码重置
export const resetUserPwd = (data: { userId: string; password: string }) => {
  return request({
    url: '/system/user/resetPwd',
    method: 'put',
    data: data
  })
}
