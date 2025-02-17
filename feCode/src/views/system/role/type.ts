export type deleteItemProp = {
  id: string
}

export type saveDataProp = {
  roleId?: string
  roleName: string
  roleKey: string
  status: string
  remark?: string
  menuIds?: any[]
  deptIds?: any[]
  menuCheckStrictly?: number | boolean
  deptCheckStrictly?: number | boolean
}
