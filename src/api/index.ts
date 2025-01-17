import { request } from '@/utils/service'
// 获取路由
export const getRouters = () => {
  return request({
    url: '/getRouters',
    method: 'get'
  })
}

// 上报
export const report = (data: any) => {
  return request({
    url: '/report/super',
    method: 'post',
    data: data
  })
}
