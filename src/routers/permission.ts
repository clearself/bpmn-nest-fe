import { nextTick } from 'vue'
import router from '@/routers/index'
import { report } from '@/api'
import { useRoute } from 'vue-router'
const route = useRoute()
import { message } from 'ant-design-vue'
import NProgress from 'nprogress' // 进度条
import 'nprogress/nprogress.css'

import { useTitle } from '@/hooks/useTitle'
import { $t } from '@/i18n'
const { setTitle } = useTitle()
import { getToken } from '@/utils/auth'
import { isHttp } from '@/utils/validate'
// import { isRelogin } from '@/utils/request'
import useUserStore from '@/store/modules/user'
import usePermissionStore from '@/store/modules/permission'
NProgress.configure({ showSpinner: false })
//进度条样式
const whiteList = ['/login', '/403', '/404', '/print', '/bpmn', '/deepseek']
router.beforeEach((to, from, next) => {
  NProgress.start()
  if (getToken()) {
    to.meta.title && setTitle($t(to.meta.title))
    /* has token*/
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done()
    } else {
      if (useUserStore().roles.length === 0) {
        // isRelogin.show = true
        // 判断当前用户是否已拉取完user_info信息
        useUserStore()
          .getInfo()
          .then(() => {
            // isRelogin.show = false
            usePermissionStore()
              .generateRoutes()
              .then((accessRoutes: any) => {
                // 根据roles权限生成可访问的路由表
                accessRoutes.forEach((route: any) => {
                  if (!isHttp(route.path)) {
                    router.addRoute(route) // 动态添加可访问路由表
                  }
                })
                next({ ...to, replace: true }) // hack方法 确保addRoutes已完成
              })
          })
          .catch((err) => {
            useUserStore()
              .logOut()
              .then(() => {
                message.error(err)
                next({ path: '/' })
              })
          })
      } else {
        next()
      }
    }
  } else {
    // 没有token
    if (whiteList.indexOf(to.path) !== -1) {
      // 在免登录白名单，直接进入
      next()
    } else {
      next(`/login?redirect=${to.fullPath}`) // 否则全部重定向到登录页
      NProgress.done()
    }
  }
})
const debounce = (func: any, wait: any) => {
  let timeout: any
  return function (...args: any) {
    clearTimeout(timeout)
    timeout = setTimeout(() => func.apply(this, args), wait)
  }
}
const toReport = (path: string) => {
  report({
    path: encodeURI(path),
    url: encodeURI(window.location.href),
    remark: '基础管理系统-' + document.title
  })
}
const debReport = debounce(toReport, 500)
router.afterEach(async (to) => {
  if (import.meta.env.VITE_MODE === 'production') {
    // 生产环境逻辑
    debReport(to.path)
  }
  NProgress.done()
})
