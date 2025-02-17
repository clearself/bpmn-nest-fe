export type deleteItemProp = {
  id: string
}

export type saveDataProp = {
  menuId?: string
  parentId: number | undefined
  menuName: string
  menuType: string
  icon: string
  orderNum: number | string
  isFrame?: string
  path?: string
  component?: string
  perms?: string
  query?: string
  isCache?: string
  visible?: string
  status: string
}
