import { createRouter, createWebHistory } from 'vue-router'
import { $t } from '@/i18n'
import { setRouteChange } from '@/hooks/useRouteListener'
const Layout = () => import('@/layout/index.vue')
export const constantRoutes: any[] = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index.vue')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index.vue'),
    hidden: true
  },
  {
    path: '',
    component: Layout,
    redirect: '/index',
    children: [
      {
        path: '/index',
        component: () => import('@/views/dashboard/index.vue'),
        name: 'Index',
        meta: { title: $t('fly.menu.home'), icon: 'dashboard', affix: true }
      }
    ]
  },
  {
    path: '/404',
    component: () => import('@/views/error/404.vue'),
    name: '404',
    meta: {
      title: '404'
    },
    hidden: true
  },
  {
    path: '/bpmn',
    component: () => import('@/views/bpmn/index.vue'),
    name: 'bpmn',
    meta: {
      title: 'bpmn'
    },
    hidden: true
  },
  {
    path: '/403',
    component: () => import('@/views/error/403.vue'),
    name: '403',
    meta: {
      title: '403'
    },
    hidden: true
  }
]
export const dynamicRoutes = []
// // 动态路由，基于用户权限动态去加载
// export const dynamicRoutes = [
//   {
//     path: '/system/user-auth',
//     component: Layout,
//     hidden: true,
//     permissions: ['system:user:edit'],
//     children: [
//       {
//         path: 'role/:userId(\\d+)',
//         component: () => import('@/views/system/user/authRole'),
//         name: 'AuthRole',
//         meta: { title: '分配角色', activeMenu: '/system/user' }
//       }
//     ]
//   },
//   {
//     path: '/system/role-auth',
//     component: Layout,
//     hidden: true,
//     permissions: ['system:role:edit'],
//     children: [
//       {
//         path: 'user/:roleId(\\d+)',
//         component: () => import('@/views/system/role/authUser'),
//         name: 'AuthUser',
//         meta: { title: '分配用户', activeMenu: '/system/role' }
//       }
//     ]
//   },
//   {
//     path: '/system/dict-data',
//     component: Layout,
//     hidden: true,
//     permissions: ['system:dict:list'],
//     children: [
//       {
//         path: 'index/:dictId(\\d+)',
//         component: () => import('@/views/system/dict/data'),
//         name: 'Data',
//         meta: { title: '字典数据', activeMenu: '/system/dict' }
//       }
//     ]
//   }
// ]

const router = createRouter({
  // 创建一个 hash 历史记录。
  history: createWebHistory(),
  // 应该添加到路由的初始路由列表。
  routes: constantRoutes
})
router.afterEach((to) => {
  setRouteChange(to)
})
export default router
