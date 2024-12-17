import { type Directive } from 'vue'
// import { useUserStoreHook } from '@/store/modules/user'

/** 权限指令，和权限判断函数 checkPermission 功能类似 */
export const permission: Directive = {
  mounted(el, binding) {
    const { value: permissionBtns } = binding
    // const { btns } = useUserStoreHook()
    const btns: any[] = []
    if (Array.isArray(permissionBtns) && permissionBtns.length > 0) {
      const hasPermission = btns.some((btn: string) => permissionBtns.includes(btn))
      // hasPermission || (el.style.display = "none") // 隐藏
      hasPermission || el.parentNode?.removeChild(el) // 销毁
    } else {
      throw new Error(`need roles! Like v-permission="['admin','editor']"`)
    }
  }
}
