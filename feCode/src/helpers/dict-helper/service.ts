import { createService } from '@/utils'
import * as API from './api'

// 获取供应商列表
export const getAllSupplier = async () => {
  return createService(API.ALL_SUPPLIER_API) as any
}

// 获取供应商列表
export const getAllGhg = async () => {
  return createService(API.GHG_API) as any
}

// 获取供应商列表
export const getAllIso = async () => {
  return createService(API.ISO_API) as any
}

// 获取所有的标准单位
// 获取所有的活动数据单位 api 相同
export const getAllStandarUnit = async () => {
  return createService(API.STANDARD_UNIT_API) as any
}

// 获取所有的活动数据单位
// export const getAllactivityDataUnitList = async () => {
//   return createService(API.STANDARD_UNIT_API) as any;
// };

// 获取所有的活动数据类别
export const getAllactivityDataType = async () => {
  return createService(API.ACTIVITY_DATA_TYPE_API) as any
}

// 获取所有的排放因子类别
export const getAllEmissionFactorType = async () => {
  return createService(API.EMISSION_FACTOR_TYPE_API) as any
}

// 获取所有的发布年份
export const getAllPublicYear = async () => {
  return createService(API.PUBLIC_YEAR_API) as any
}

// 获取所有一级分类
export const getAllFirstClassify = async () => {
  return createService(API.FIRST_CLASSIFY_API) as any
}

// 获取所有的源语言
export const getAllOriginLanguage = async () => {
  return createService(API.SOURCE_LANGUAGE_API) as any
}

// 获取所有的来源类别
export const getAllSourceClassify = async () => {
  return createService(API.SOURCE_CLASSIFY_API) as any
}

// 获取所有的来源类别
export const getAllDept = async () => {
  return createService(API.SYS_DEPT_API, {}, 'POST') as any
}
// 获取所有的来源类别
export const getAllRole = async () => {
  return createService(API.SYS_USER_ROLE_API, {}, 'POST') as any
}
// 获取所有的菜单
export const getAllMenu = async () => {
  return createService(API.SYS_ALL_MENU_API, {}, 'POST') as any
}
// 获取所有的单位
export const getAllUnit = async () => {
  return createService(API.ALL_UNIT_API, {}, 'POST') as any
}
// 获取所有的单位类型
export const getAllUnitType = async () => {
  return createService(API.ALL_UNIT_TYPE_API, {}, 'POST') as any
}
// 获取所有的操作模块
export const getAllOpModule = async () => {
  return createService(API.ALL_OP_MODULE_API, {}, 'POST') as any
}
// 获取所有的 assign User
export const getAllAssignUser = async () => {
  return createService(API.ALL_ASSIGN_USER_API, {}, 'POST') as any
}
// 获取所有的 assign User
export const getAllProcessStep = async () => {
  return createService(API.ALL_PROCESS_STEP_API, {}, 'POST') as any
}
