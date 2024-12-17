import { type ThemeName } from '@/config/theme'
import { type ModalName } from '@/config/theme'
export const getActiveThemeName = () => {
  return localStorage.getItem('theme') as ThemeName | null
}
export const setActiveThemeName = (themeName: string) => {
  localStorage.setItem('theme', themeName)
}
export const getActiveModalName = () => {
  return localStorage.getItem('modal') as ModalName | null
}
export const setActiveModalName = (themeName: string) => {
  localStorage.setItem('modal', themeName)
}
