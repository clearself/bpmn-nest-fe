import { cloneDeep } from 'lodash-es'
import dayjs from 'dayjs'
import useUserStoreHook from '@/store/modules/user'
// const Layout = () => import('@/layout/index.vue')
// const modules = import.meta.glob('@/views/**/**.vue')
export const handelNull = (val: any) => {
  return val === null ? '' : val
}
export const handelNulStr = (val: any) => {
  return val ? val : ''
}
export const isNull = (val: any): boolean => {
  if (val) {
    return false
  } else {
    return true
  }
}
export const handelResult = (val: any): any[] => {
  if (val === null) return []
  if (val.indexOf(',') > -1) {
    return val.split(',')
  } else {
    return []
  }
}

// export function setToken(token: string) {
//   return localStorage.setItem('token', token)
// }

// export function getToken() {
//   return localStorage.getItem('token')
// }

// export function removeToken() {
//   if (getToken()) {
//     return localStorage.removeItem('token')
//   }
//   return null
// }
export function clearLocalSrorage() {
  localStorage.clear()
}
export const logout = () => {
  useUserStoreHook().logOut()
}
// export const getUserInfo = () => {
//   useUserStoreHook().setUser()
// }
// export const hasPer = (str: string) => {
//   return useUserStoreHook().isPer(str)
// }

export function getLang() {
  return localStorage.getItem('language') || 'zh'
}
export const getDeptIds = (depts: any) => {
  if (depts.length === 0) return []
  const arr = []
  const list = cloneDeep(depts)
  for (let i = 0; i < list.length; i++) {
    if (list[i]?.subSysDeptEntityDTOList?.length) {
      arr.push(list[i].id)
      getDeptIds(list[i].subSysDeptEntityDTOList)
    }
  }
  return arr
}

export const downloadFile = async (id: string, fileName: string) => {
  const link = document.createElement('a')
  const body = document.body
  link.href = '/api/sysAttach/downLoadFileStream?fileId=' + id
  link.download = fileName
  link.style.display = 'none'
  body.appendChild(link)

  link.click()
  body.removeChild(link)
  window.URL.revokeObjectURL(link.href)
}
export const downloadpdf = (res: any, name: any, ext: string) => {
  const blob = new Blob([res], { type: 'application/pdf' }) // 创建blob对象，解析数据流
  const tempLink = document.createElement('a') // 创建一个临时的 HTML 元素，用于生成 Excel 文件
  const URL = window.URL || window.webkitURL // 兼容webkix浏览器，处理webkit浏览器中href自动添加blob前缀，默认在浏览器
  const herf = URL.createObjectURL(blob) // 根据解析后的blob对象创建URL 对象
  tempLink.href = herf // 下载链接
  tempLink.download = `${name}.${ext}` // 下载文件名,如果后端没有返回，
  document.body.appendChild(tempLink)
  tempLink.click() //下载后自动打开
  document.body.removeChild(tempLink) // 清理临时资源
  window.URL.revokeObjectURL(herf) //在内存中移除URL 对象
}
//防抖函数
type CallbackFn = (item?: any) => void

let timer: any = null
export const debounce = (Callback: CallbackFn, delay = 1000) => {
  timer != null ? clearTimeout(timer) : null
  timer = setTimeout(() => {
    Callback && Callback() //当有值才会执行
  }, delay)
}
export const getQueryString = (name: string) => {
  const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
  const search = window.location.search.split('?')[1] || ''
  const r = search.match(reg) || []
  return r[2]
}

/**
 * 获取第一个表格的可视化高度
 * @param {*} extraHeight 额外的高度(表格底部的内容高度 Number类型,默认为74)
 * @param {*} id 当前页面中有多个table时需要制定table的id
 */
export const getTableScroll = (extraHeight?: number, id?: any) => {
  // if (typeof extraHeight == 'undefined') {
  //   //  默认底部分页64 + 边距10
  //   extraHeight = 74
  // }
  extraHeight = extraHeight || 45
  let tHeader = null
  if (id) {
    const tableDom = document.getElementById(id)
    tHeader = tableDom ? tableDom.getElementsByClassName('ant-table-thead')[0] : null
  } else {
    tHeader = document.getElementsByClassName('ant-table-thead')[0]
  }
  //表格内容距离顶部的距离
  let tHeaderTop = 0
  let tHeaderBottom = 0
  if (tHeader) {
    tHeaderBottom = tHeader.getBoundingClientRect().bottom
    tHeaderTop = tHeader.getBoundingClientRect().top
  }
  // 窗口可视区高度
  const wH = window.innerHeight
  const offsetBottom = wH - tHeaderTop
  //窗体高度-表格内容顶部的高度-表格内容底部的高度
  const height = `calc(100vh - ${tHeaderBottom + extraHeight}px)`
  return {
    height: height,
    offsetBottom: offsetBottom
  }
}
//javascript精度除法处理
//除法函数，用来得到精确的除法结果
//说明：javascript的除法结果会有误差，在两个浮点数相除的时候会比较明显。这个函数返回较为精确的除法结果。
//调用：accDiv(arg1,arg2)
//返回值：arg1除以arg2的精确结果
export const accDiv = (arg1: number, arg2: number) => {
  let t1 = 0,
    t2 = 0,
    r1,
    r2
  try {
    t1 = arg1.toString().split('.')[1].length
  } catch (e) {
    console.log(e)
  }
  try {
    t2 = arg2.toString().split('.')[1].length
  } catch (e) {
    console.log(e)
  }
  // eslint-disable-next-line prefer-const
  r1 = Number(arg1.toString().replace('.', ''))
  // eslint-disable-next-line prefer-const
  r2 = Number(arg2.toString().replace('.', ''))
  return (r1 / r2) * Math.pow(10, t2 - t1)
}
/*
      javascript精度乘法处理
    乘法函数，用来得到精确的乘法结果
    说明：javascript的乘法结果会有误差，在两个浮点数相乘的时候会比较明显。这个函数返回较为精确的乘法结果。
    调用：accMul(arg1,arg2)
    返回值：arg1乘以arg2的精确结果
 */

export const accMul = (arg1: any, arg2: any) => {
  let m = 0
  const s1 = arg1.toString()
  const s2 = arg2.toString()
  try {
    m += s1.split('.')[1].length
  } catch (e) {
    console.log(e)
  }
  try {
    m += s2.split('.')[1].length
  } catch (e) {
    console.log(e)
  }
  return (Number(s1.replace('.', '')) * Number(s2.replace('.', ''))) / Math.pow(10, m)
}
//javascript精度加法处理
//加法函数，用来得到精确的加法结果
//说明：javascript的加法结果会有误差，在两个浮点数相加的时候会比较明显。这个函数返回较为精确的加法结果。
//调用：accAdd(arg1,arg2)
//返回值：arg1加上arg2的精确结果
export const accAdd = (arg1: any, arg2: any) => {
  let r1, r2, m
  try {
    r1 = arg1.toString().split('.')[1].length
  } catch (e) {
    r1 = 0
  }
  try {
    r2 = arg2.toString().split('.')[1].length
  } catch (e) {
    r2 = 0
  }
  // eslint-disable-next-line prefer-const
  m = Math.pow(10, Math.max(r1, r2))
  return (arg1 * m + arg2 * m) / m
}
// 根据url下载文件
export const handleDownLoadByUrl = (url: string) => {
  try {
    const elementIftrame = document.createElement('iframe')
    elementIftrame.src = url
    elementIftrame.style.display = 'none'
    document.body.appendChild(elementIftrame)
  } catch (error) {
    console.log(error)
  }
}

export const removeEmptyParams = (obj: any) => {
  for (const key in obj) {
    if (obj[key] === undefined || obj[key] === null || obj[key] === '') {
      delete obj[key]
    } else if (typeof obj[key] === 'object') {
      removeEmptyParams(obj[key])
      if (Object.keys(obj[key]).length === 0) {
        delete obj[key]
      }
    }
  }
  return obj
}
export const removeUndefinedParams = (obj: any) => {
  for (const key in obj) {
    if (obj[key] === undefined) {
      delete obj[key]
    } else if (typeof obj[key] === 'object') {
      removeEmptyParams(obj[key])
      if (Object.keys(obj[key]).length === 0) {
        delete obj[key]
      }
    }
  }
  return obj
}
// 根据数据过滤想要code对应的id
export const getfilterId = (code: string | number | undefined, list: any[]) => {
  const _list = list?.length ? cloneDeep(list) : []
  const cur = _list.filter((item) => item.value === code)
  if (cur?.length) {
    return cur[0].id
  } else {
    return ''
  }
}
// 根据数据过滤想要code对应的label
export const getfilterLabel = (code: string | number | undefined, list: any[]) => {
  const _list = list?.length ? cloneDeep(list) : []
  const cur = _list.filter((item) => item.value === code)
  if (cur?.length) {
    return cur[0].label
  } else {
    return '-'
  }
}

// 根据时间戳显示时间
export const timeFormat = (timestamp: number, format: string = 'YYYY-MM-DD HH:mm:ss') => {
  if (!timestamp) {
    return '-'
  }
  return dayjs(timestamp).format(format)
}

// 搜索条件中的时间处理
export const searchTimeFormat = (timestamp: number | undefined, isEnd = false, format: string = 'YYYY-MM-DD') => {
  if (!timestamp) {
    return undefined
  }
  const time = isEnd ? dayjs(timestamp).format(format) + ' 23:59:59' : dayjs(timestamp).format(format) + ' 00:00:00'
  return +dayjs(time)
}

/**
 * @param {Array} arr  要扁平化的数组
 * @param {String} childName   判断有无子集的属性，默认children
 */
export const flatten: (arr: any[], childName?: string) => any = (arr: any[], childName = 'children') => {
  if (arr.length === 0) {
    return []
  }
  const oldArr = JSON.parse(JSON.stringify(arr)) // 对源数据深度克隆
  const newArr = []
  for (let i = 0; i < oldArr.length; i++) {
    if (oldArr[i][childName]) {
      // childName存在
      newArr.push(...flatten(oldArr[i][childName]))
      delete oldArr[i][childName]
    }
    newArr.push({ ...oldArr[i] })
  }
  return newArr
}

/**
 * @param {Array} arr  要树形化的源数据
 * @param {String} childName 自定义子集的属性名称，默认children
 */
export const treeData = (arr: any[], childName = 'children') => {
  if (arr.length === 0) {
    return []
  }
  const cloneData = JSON.parse(JSON.stringify(arr)) // 对源数据深度克隆
  const tree = cloneData.filter((father) => {
    // 循环所有项
    const branchArr = cloneData.filter((child) => {
      return father.id == child.parentId // 返回每一项的子级数组
    })
    if (branchArr.length > 0) {
      father[childName] = branchArr // 如果存在子级，则给父级添加一个children属性，并赋值
    }
    return father.parentId == '' // 返回第一层
  })
  return tree // 返回树形数据
}

export const getTreeDataHasChildrenIds = (treeData: any) => {
  if (treeData.length === 0) return []
  const arr = []
  const list = cloneDeep(treeData)
  for (let i = 0; i < list.length; i++) {
    if (list[i]?.children?.length) {
      arr.push(list[i].id)
      getTreeDataHasChildrenIds(list[i].children)
    }
  }
  return arr
}
