<template>
  <a-config-provider :locale="locale" :theme="app.themeConfig">
    <router-view />
    <!-- <context-holder /> -->
  </a-config-provider>
</template>

<script setup lang="ts">
import { onMounted, inject, onUnmounted } from 'vue'
const socket = inject('socket') as any
import { useTheme } from '@/hooks/useTheme'
const { initTheme, initModal } = useTheme()
/** 初始化主题 */
initTheme()
/** 初始化布局模式*/
initModal()
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import enGB from 'ant-design-vue/es/locale/en_GB'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import 'dayjs/locale/en-gb'
import { useAppStore } from '@/store/modules/theme.js'
const app = useAppStore()
import { computed } from 'vue'
// import { contextHolder } from "./helpers/msg-helper";
const locale = computed(() => {
  const lang = localStorage.getItem('language') || 'zh'
  if (lang === 'en') {
    dayjs.locale('en-gb')
    return enGB
  } else {
    dayjs.locale('zh-cn')
    return zhCN
  }
})

socket.emit('socketTest', { test: '测试数据' }, (data: any) => {
  console.log(data, 'socketTest') // { msg1: '测试1', msg2: '测试2' }
})
onMounted(() => {
  socket.connect() //连接socket服务器
})

onUnmounted(() => {
  socket.close() //连接socket服务器
})
</script>

<style>
.ant-table-tbody > tr > .ant-table-row-cell-break-word:empty::after {
  position: inherit;
  content: '-';
}
.ant-table-tbody > tr > td:empty::after {
  position: inherit;
  content: '-';
}
.ant-descriptions-item-content span:empty::after {
  position: inherit;
  content: '-';
}
.no-empty.ant-descriptions-item-content span:empty::after {
  content: '';
}
</style>
