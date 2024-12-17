export const DEFAULT_THEME_NAME = 'normal'
import { $t } from '@/i18n'
type DefaultThemeName = typeof DEFAULT_THEME_NAME
/** 注册的主题名称, 其中 DefaultThemeName 是必填的 */
export type ThemeName = DefaultThemeName | 'orange' | 'green'

interface ThemeList {
  title: string | undefined
  name: ThemeName
  color: string
}
export const themeList: ThemeList[] = [
  {
    title: $t('theme.default'),
    name: DEFAULT_THEME_NAME,
    color: 'rgb(22,93,255)'
  },
  {
    title: $t('theme.orange'),
    name: 'orange',
    color: '#FA541C'
  },
  {
    title: $t('theme.green'),
    name: 'green',
    color: '#52C41A'
  }
]
// 布局方式
export const DEFAULT_MODAL_NAME = 'top-left'
type DefaultModalName = typeof DEFAULT_MODAL_NAME
/** 注册的主题名称, 其中 DefaultThemeName 是必填的 */
export type ModalName = DefaultModalName | 'top' | 'left'

interface ModalList {
  title: string | undefined
  name: ModalName
}
export const modalList: ModalList[] = [
  {
    title: $t('theme.topLeft'),
    name: DEFAULT_MODAL_NAME
  },
  {
    title: $t('theme.top'),
    name: 'top'
  },
  {
    title: $t('theme.left'),
    name: 'left'
  }
]
