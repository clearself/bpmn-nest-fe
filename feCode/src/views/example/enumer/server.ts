import { request } from '@/utils/service'
export const init = (data: any) => {
  return request<ApiResponseData>({
    method: 'POST',
    url: `/admin/ecm/login`,
    data: data
  })
}
export const getUserInfo = () => {
  return request<ApiResponseData>({
    method: 'GET',
    url: `/auth/userInfo`
  })
}
