import { createI18n } from 'vue-i18n'
import Chinese from './lan/zh'
import English from './lan/en'

const i18n = createI18n({
  locale: localStorage.getItem('language') || 'zh', // 从localStorage中获取 默认中文
  legacy: false,
  globalInjection: true, // 全局生效$t
  messages: {
    zh: Chinese, // 中文语言包
    en: English // 英文语言包
  }
})
// 切换语言
export function changeLanguage(language: string) {
  i18n.locale = language
  localStorage.setItem('language', language)
}
//翻译
export function $t(text: string) {
  if (!text) return
  return i18n.global.t(text)
}
export default i18n
