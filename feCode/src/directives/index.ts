import { type App } from 'vue'
import { permission } from './permission'
import { trim } from './trim'

/** 挂载自定义指令 */
export function loadDirectives(app: App) {
  app.directive('permission', permission)
  app.directive('trim', trim)
}
