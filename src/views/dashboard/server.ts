import { request } from '@/utils/service'
export const exportPdfFile = (content: string) => {
  return request({
    method: 'POST',
    url: `/markdown/pdf`,
    headers: {
      isDownLoadImg: true
    },
    responseType: 'blob',
    data: {
      content: content
    }
  })
}
export const reportSuper = (data: { path: string; url: string }) => {
  return request<ApiResponseData>({
    method: 'POST',
    url: `/report/super`,
    data: data
  })
}
