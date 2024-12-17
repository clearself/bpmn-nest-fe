export type deleteItemProp = {
  id: string
}

export type saveDataProp = {
  deptId?: string
  parentId: number | undefined
  deptName: string
  orderNum: number | string
  leader?: string
  phone?: string
  email?: string
  status: string
}
