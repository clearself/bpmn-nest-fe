import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import store from '@/store'
import { theme } from 'ant-design-vue'
import { themeList } from '@/config/theme'

/**
 * app 配置 开启持久化
 */
export const useAppStore = defineStore(
  'theme',
  () => {
    const themeName = ref('normal') // 主题名称
    const darkMode = ref('light') // 颜色模式
    // const darkModeComp = computed(() => {
    //   document.documentElement.setAttribute('data-dark', darkMode.value)
    //   return darkMode.value
    // })
    const themeConfig = computed(() => {
      //   document.documentElement.setAttribute('data-theme', themeName.value)
      const color: string = themeList.filter((item) => item.name === themeName.value)[0].color
      // 主题配置
      return {
        token: {
          colorPrimary: color,
          colorSuccess: '#1dc779',
          colorWarning: '#ffb302',
          colorError: '#cf4444',
          colorInfo: color,
          wireframe: true
        },
        algorithm: darkMode.value === 'light' ? theme.defaultAlgorithm : theme.darkAlgorithm
      }
    })
    const setThemeName = (value: string) => {
      themeName.value = value
    }
    const toggleDarkMode = () => {
      darkMode.value = darkMode.value === 'light' ? 'dark' : 'light'
    }
    return { themeName, themeConfig, darkMode, setThemeName, toggleDarkMode }
  },
  {
    persist: true // 开启持久化
  }
)
/** 在 setup 外使用 */
export function useAppStoreHook() {
  return useAppStore(store)
}
