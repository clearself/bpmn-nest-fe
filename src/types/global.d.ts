declare module 'ali-oss'
declare module 'sortablejs'
declare module 'uuid'
declare module 'json-bigint'
declare module 'vuedraggable'
declare module 'vue-i18n'
declare module 'nprogress'
declare module 'bpmn-js-token-simulation'
declare module 'camunda-bpmn-moddle/resources/camunda'
declare module 'diagram-js-minimap'
declare module 'min-dash'
declare module 'diagram-js-grid-bg'
declare module 'socket.io-client'
declare module 'three'
declare module 'vue-3d-model'
/** 所有 api 接口的响应数据都应该准守该格式 */
interface ApiResponseData<T = any> {
  code: string | number
  data?: T
  total?: number
  msg: string
}

interface Pagination {
  pageNum?: number
  pageSize?: number
  orderByColumn?: string
  isAsc?: string
}
interface orderSearch {
  orderByColumn?: string
  isAsc?: string
}

interface colPro {
  title?: string
  lang: string
  dataIndex: string
  fixed?: string
  width?: number
  ellipsis?: boolean
  checked?: boolean
}

interface DicProp {
  id?: string
  label: string
  value: string | number
}
interface SNlistParamsProp {
  ordersId: string
  skuManagementType: string
}
