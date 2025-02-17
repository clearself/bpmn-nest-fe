<script lang="ts" setup>
import { ref } from 'vue'
import { $t } from '@/i18n'
import { type RouteLocationMatched, useRoute, useRouter } from 'vue-router'
import { useRouteListener } from '@/hooks/useRouteListener'
import { compile } from 'path-to-regexp'

const route = useRoute()
const router = useRouter()
const { listenerRouteChange } = useRouteListener()

/** 定义响应式数据 breadcrumbs，用于存储面包屑导航信息 */
const breadcrumbs = ref<RouteLocationMatched[]>([])

/** 获取面包屑导航信息 */
const getBreadcrumb = () => {
  breadcrumbs.value = route.matched.filter((item) => item.meta?.title && item.meta?.breadcrumb !== false)
}

/** 编译路由路径 */
const pathCompile = (path: string) => {
  const toPath = compile(path)
  return toPath(route.params)
}

/** 处理面包屑导航点击事件 */
const handleLink = (item: RouteLocationMatched) => {
  const { redirect, path } = item
  if (redirect) {
    router.push(redirect as string)
    return
  }
  router.push(pathCompile(path))
}

/** 监听路由变化，更新面包屑导航信息 */
listenerRouteChange((route) => {
  if (route.path.startsWith('/redirect/')) return
  getBreadcrumb()
}, true)
</script>

<template>
  <a-breadcrumb class="app-breadcrumb">
    <a-breadcrumb-item v-for="(item, index) in breadcrumbs" :key="item.path">
      <span v-if="item.redirect === 'noRedirect' || index === breadcrumbs.length - 1" class="no-redirect">
        {{ $t(item.meta.title) }}
      </span>
      <a v-else @click.prevent="handleLink(item)">
        {{ $t(item.meta.title) }}
      </a>
    </a-breadcrumb-item>
  </a-breadcrumb>
</template>

<style lang="scss" scoped></style>
