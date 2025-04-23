import { defineStore } from 'pinia'
import { ss } from '@/utils/storage'
export interface AppState {
  siderCollapsed: boolean
  token: string | undefined
}
export const useAppStore = defineStore('app-store', {
  state: (): AppState => ({
    siderCollapsed: false,
    token: ss.get('tokenApp')
  }),
  actions: {
    setSiderCollapsed(collapsed: boolean) {
      this.siderCollapsed = collapsed
      ss.set('siderCollapsedApp', this.siderCollapsed)
    },
    setToken(token: string) {
      this.token = token
      ss.set('tokenApp', this.token)
    }
  }
})
