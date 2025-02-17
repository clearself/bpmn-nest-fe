import { request } from '@/utils/service'
// 登录方法
export const login = (username: string, password: string, code: string, uuid: string) => {
  const data = {
    username,
    password,
    code,
    uuid
  }
  return request<ApiResponseData>({
    url: '/login',
    headers: {
      isToken: false
    },
    method: 'post',
    data: data
  })
}

// 注册方法
export const register = (data: any) => {
  return request<ApiResponseData>({
    url: '/register',
    headers: {
      isToken: false
    },
    method: 'post',
    data: data
  })
}

// 获取用户详细信息
export const getInfo = () => {
  return request<ApiResponseData>({
    url: '/getInfo',
    method: 'get'
  })
}

// 退出方法
export const logout = () => {
  return request<ApiResponseData>({
    url: '/logout',
    method: 'post'
  })
}
export const getCaptcha = () => {
  return request<ApiResponseData>({
    method: 'GET',
    url: `/captchaImage`
  })
}
