/**
 * 仅仅是 api
 */

export const ALL_SUPPLIER_API = '/rbac/orgList'
export const GHG_API = '/ecmCalculateDict/ecmDictGHG'
export const ISO_API = '/ecmCalculateDict/ecmDictISO'
// 活动数据单位
export const STANDARD_UNIT_API = '/ecmCalculateDict/ecmDictUnit'
// 活动数据单位
// export const ACTIVITY_DATA_UNIT_API = "/ecmCalculateDict/ecmDictUnit";
// 活动数据类别
export const ACTIVITY_DATA_TYPE_API = '/ecmCalculateDict/activityDataDict'
// 排放因子类别
export const EMISSION_FACTOR_TYPE_API = '/ecmCalculateDict/emissionFactorTypeDict'
// publishYear 发布年份
export const PUBLIC_YEAR_API = '/ecmCalculateDict/recentYear'
// 一级分类
export const FIRST_CLASSIFY_API = 'ecmCalculateDict/emissionFactorClassifyDict'
// 源语言
export const SOURCE_LANGUAGE_API = '/ecmCalculateDict/queryListDict?dictType=factor_source_language'
// 来源类别
export const SOURCE_CLASSIFY_API = '/ecmCalculateDict/emissionFactorClassifyDict'
// 不分页查询SysDept
export const SYS_DEPT_API = '/sysDept/findSysDeptListPage'
// 不分页查询SysUserRole
export const SYS_USER_ROLE_API = '/sysRole/findSysRoleList'
// 不分页查询SysUserRole
export const SYS_ALL_MENU_API = '/sysMenu/queryAllMenudtos'
// 不分页查询 单位
export const ALL_UNIT_API = '/ecmDictUnitTransfer/ecmDictUnitTransfer'
// 不分页查询 单位类型
export const ALL_UNIT_TYPE_API = '/ecmDictUnitTransfer/ecmDictUnitTransferType'
// 不分页查询 操作模块 TODO: wait for be api
export const ALL_OP_MODULE_API = '/sysMenu/queryAllMenudtos'
// 不分页查询  assign User api
export const ALL_ASSIGN_USER_API = '/ecmSysAssignConfig/ecmSysAssignUserList'
export const ALL_PROCESS_STEP_API = '/ecmSysAssignConfig/queryProcessStep'
