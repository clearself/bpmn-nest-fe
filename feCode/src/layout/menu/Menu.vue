<template>
  <div
    style="display: flex"
    class="left-wrapper"
    :class="{
      'left-modal': activeModalName === 'left' || activeModalName === 'top-left',
      'top-model': activeModalName === 'top'
    }"
  >
    <div
      v-if="activeModalName === 'left' || activeModalName === 'top'"
      class="ub ub-ac ub-pc logo-box"
      :class="{ 'mr-5': activeModalName === 'top' }"
    >
      <div class="sys_logo" v-if="activeModalName === 'left'">
        <img v-if="collapsed" :src="imgLogoClose" height="30" />
        <img v-else :src="imgLogo" height="30" />
      </div>
      <div v-else class="sys_logo pl-2">
        <img :src="imgLogo" height="30" />
      </div>
    </div>
    <div
      :class="{
        'left-menu': activeModalName === 'left' || activeModalName === 'top-left',
        'top-menu': activeModalName === 'top',
        collapsed: collapsed
      }"
    >
      <a-menu
        class="menu-box"
        theme="light"
        :inlineIndent="15"
        style="border: 0px"
        :selectedKeys="[currentPath]"
        :open-keys="openKeys"
        :inline-collapsed="collapsed"
        @openChange="onOpenChange"
        :items="menusInfo"
        @click="menuClick"
        :mode="activeModalName === 'left' || activeModalName === 'top-left' ? 'inline' : 'horizontal'"
      />
    </div>

    <div
      v-if="activeModalName === 'left' || activeModalName === 'top-left'"
      class="ub w100 ub-ac ub-pc collapsed-btn"
      style="overflow: hidden"
    >
      <a-button type="link" block @click="toggleCollapsed" style="border-radius: 0px; margin-bottom: 16px">
        <MenuUnfoldOutlined v-if="collapsed" />
        <MenuFoldOutlined v-else />
      </a-button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { $t } from '@/i18n'
import { cloneDeep } from 'lodash-es'
import { isExternal } from '@/utils/validate'
import IconSvg from '@/components/IconSvg/index.vue'
import Bus from '@/bus'
import { useTheme } from '@/hooks/useTheme'
const { activeModalName } = useTheme()
import { h, ref, onMounted, computed } from 'vue'
import imgLogo from '@/assets/imgs/logo.png'
import imgLogoClose from '@/assets/imgs/logo_close.png'
import { useRouter, useRoute } from 'vue-router' //路由
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons-vue'
import usePermissionStore from '@/store/modules/permission'
const store = usePermissionStore()

const onlyOneChild: any = ref({})
function hasOneShowingChild(children = [], parent: any) {
  if (!children) {
    children = []
  }
  const showingChildren = children.filter((item: any) => {
    if (item.hidden) {
      return false
    } else {
      // Temp set(will be used if only has one showing child)
      onlyOneChild.value = item
      return true
    }
  })

  // When there is only one child router, the child router is displayed by default
  if (showingChildren.length === 1) {
    return true
  }

  // Show parent if there are no child router to display
  if (showingChildren.length === 0) {
    onlyOneChild.value = { ...parent, path: '', noShowingChildren: true }
    return true
  }

  return false
}
interface ObjItem {
  key?: any
  icon?: any
  iconName?: string
  redirect?: string
  label?: string
  title?: string
  children?: ObjItem[]
}
// 将路由信息转化成左侧菜单数据
const handelRouteToMenu = (menu: any, basePath: string = '') => {
  if (menu.length === 0) return []
  const arr = []
  const list = cloneDeep(menu)
  for (let i = 0; i < list.length; i++) {
    if (!list[i].hidden) {
      const _hasOneShowingChild = hasOneShowingChild(list[i].children, list[i])
      if (
        _hasOneShowingChild &&
        (!onlyOneChild.value?.children || onlyOneChild.value?.noShowingChildren) &&
        !list[i].alwaysShow
      ) {
        const obj = <ObjItem>{}
        if (list[i].path === '' && list[i].redirect === '/index') {
          obj.iconName = list[i].children[0]?.meta?.icon
          obj.icon = () => h(IconSvg, { name: obj.iconName, width: '12px', height: '12px' })
          if (basePath) {
            obj.key = basePath + '/' + list[i].children[0].path
          } else {
            obj.key = list[i].children[0].path
          }
          obj.label = list[i].children[0]?.meta?.title ? $t(list[i].children[0]?.meta?.title) : ''
        } else {
          obj.iconName = list[i]?.meta?.icon
          obj.icon = () => h(IconSvg, { name: obj.iconName, width: '12px', height: '12px' })
          if (basePath) {
            obj.key = basePath + '/' + list[i].path
          } else {
            obj.key = list[i].path
          }
          obj.label = $t(list[i]?.meta?.title)
        }
        arr.push(obj)
      } else {
        const obj = <ObjItem>{}
        obj.iconName = list[i]?.meta?.icon
        obj.icon = () => h(IconSvg, { name: obj.iconName, width: '12px', height: '12px' })
        if (basePath) {
          obj.key = basePath + '/' + list[i].path
        } else {
          obj.key = list[i].path
        }
        obj.label = list[i]?.meta?.title ? $t(list[i]?.meta?.title) : ''
        if (list[i]?.children?.length > 0) {
          obj.children = handelRouteToMenu(list[i]?.children, obj.key)
        }
        arr.push(obj)
      }
    }
  }
  console.log(arr, 'arr')
  return arr
}

const menusInfo: any = computed(() => {
  return handelRouteToMenu(store.sidebarRouters)
})
const router = useRouter() // 路由
const route = useRoute() // 获取当前路由对象
const openKeys: any = ref([])
const collapsed = ref(false)
const onOpenChange = (keys: any) => {
  openKeys.value = keys
  sessionStorage.setItem('openKeys', JSON.stringify(keys))
}

const menuClick = (item: any) => {
  console.log(item, 'item')
  if (isExternal(item.key)) {
    window.open(item.key, '_blank')
    return
  }
  router.push(item.key)
  //判断是否是一级菜单，一级菜单item.keyPath长度为1，二级菜单item.keyPath长度为2，清空二级菜单展开数组openKeys
  if (item.keyPath.length == 1) {
    sessionStorage.removeItem('openKeys')
    openKeys.value = []
  } else {
    const pathPr = item.key.split('/')
    openKeys.value = item.keyPath.filter((item: any) => item.indexOf(pathPr[1]) > -1)
    sessionStorage.setItem('openKeys', JSON.stringify(openKeys.value))
  }
}

const currentPath = computed(() => {
  const { meta, path } = route
  // if set path, the sidebar will highlight the path you set
  if (meta.activeMenu) {
    return meta.activeMenu
  }
  return path
})
onMounted(() => {
  if (activeModalName.value !== 'top') {
    const openKey = sessionStorage.getItem('openKeys') as string
    if (!JSON.parse(openKey)?.length) {
      openKeys.value = menusInfo.value.length ? [menusInfo.value[0]?.path] : ['']
    } else {
      openKeys.value = JSON.parse(openKey)
    }
  }
})
// 切换折叠左侧菜单
const toggleCollapsed = () => {
  collapsed.value = !collapsed.value
  let val
  const _openKey = sessionStorage.getItem('openKeys') as string
  if (!JSON.parse(_openKey)?.length) {
    val = [menusInfo.value[0]?.path]
  } else {
    val = JSON.parse(_openKey)
  }
  openKeys.value = collapsed.value ? [] : val
  Bus.emit('collapsed', collapsed.value)
}
</script>
<style lang="scss" scoped>
.left-wrapper {
  box-shadow: 0 2px 5px #00000014;
  &.left-modal {
    flex-direction: column;
    height: 100%;
  }
  &.top-model {
    flex: 1;
    padding-top: 2px;
    height: var(--esg-navigationbar-height);
    box-sizing: border-box;
  }
  .ant-menu-horizontal {
    line-height: 47px;
  }
}
.left-menu {
  width: 170px;
  height: calc(100vh - 100px);
  overflow-y: auto;
  max-width: 240px;
  transition: width 0.3s cubic-bezier(0.2, 0, 0, 1) 0s;
  &::-webkit-scrollbar {
    width: 0px;
  }
  &.collapsed {
    width: 80px;
  }
}
.top-menu {
  flex: 1;
}
.logo-box {
  height: var(--esg-navigationbar-height);
}
</style>
