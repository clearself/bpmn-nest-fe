import { ref, watchEffect } from 'vue'
import { themeList, DEFAULT_THEME_NAME, ThemeName, modalList, DEFAULT_MODAL_NAME, ModalName } from '@/config/theme'
import { getActiveThemeName, setActiveThemeName, getActiveModalName, setActiveModalName } from '@/utils/theme'
import { useAppStoreHook } from '@/store/modules/theme.js'
const app = useAppStoreHook()

/** 正在应用的主题名称 */
const activeThemeName = ref<ThemeName>(getActiveThemeName() || DEFAULT_THEME_NAME)

/** 设置主题 */
const setTheme = (value: ThemeName) => {
  activeThemeName.value = value
}

/** 在 html 根元素上挂载 class */
const setHtmlRootClassName = (value: ThemeName) => {
  document.documentElement.className = value
}
/** 在 html 根元素上挂载 class */
const setAntDesignTheme = (value: ThemeName) => {
  app.themeName = value
}
/** 初始化 */
const initTheme = () => {
  // watchEffect 来收集副作用
  watchEffect(() => {
    const value = activeThemeName.value
    setAntDesignTheme(value)
    setHtmlRootClassName(value)
    setActiveThemeName(value)
  })
}

/** 正在应用的布局名称 */
const activeModalName = ref<ModalName>(getActiveModalName() || DEFAULT_MODAL_NAME)
/** 设置主题 */
const setModal = (value: ModalName) => {
  activeModalName.value = value
}
/** 初始化 */
const initModal = () => {
  // watchEffect 来收集副作用
  watchEffect(() => {
    const value = activeModalName.value
    setActiveModalName(value)
  })
}
/** 主题 hook */
export function useTheme() {
  return { themeList, activeThemeName, initTheme, setTheme, modalList, activeModalName, initModal, setModal }
}
