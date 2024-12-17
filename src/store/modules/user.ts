import { login, logout, getInfo } from '@/views/login/server'
import { getToken, setToken, removeToken } from '@/utils/auth'
import defAva from '@/assets/imgs/profile.jpg'
import { defineStore } from 'pinia'
import store from '@/store'
import router from '@/routers'
const useUserStore = defineStore('user', {
  state: () => ({
    token: getToken(),
    name: '',
    deptName: '',
    avatar: '',
    roles: [],
    permissions: []
  }),
  actions: {
    // 登录
    login(userInfo: any) {
      const username = userInfo.username.trim()
      const password = userInfo.password
      const code = userInfo.code
      const uuid = userInfo.uuid
      return new Promise((resolve, reject) => {
        login(username, password, code, uuid)
          .then((res) => {
            setToken(res.data.token)
            this.token = res.data.token
            resolve(res)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    // 获取用户信息
    getInfo() {
      return new Promise((resolve, reject) => {
        getInfo()
          .then((res) => {
            console.log(res, '3333333333333333')
            const user = res.user

            const avatar =
              user.avatar == '' || user.avatar == null ? defAva : import.meta.env.VITE_API_URL + user.avatar

            if (res.roles && res.roles.length > 0) {
              // 验证返回的roles是否是一个非空数组
              this.roles = res.roles
              this.permissions = res.permissions
            } else {
              this.roles = ['ROLE_DEFAULT']
            }
            this.name = user.userName
            this.avatar = avatar
            this.deptName = user.deptName
            resolve(res)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    // 退出系统
    logOut() {
      return new Promise<void>((resolve, reject) => {
        logout(this.token)
          .then(() => {
            this.token = ''
            this.roles = []
            this.permissions = []
            removeToken()
            router.replace({
              path: '/login'
            })
            resolve()
          })
          .catch((error) => {
            reject(error)
          })
      })
    }
  }
})

/** 在 setup 外使用 */
export default function useUserStoreHook() {
  return useUserStore(store)
}
