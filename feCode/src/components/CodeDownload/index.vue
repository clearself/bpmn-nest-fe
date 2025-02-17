<template>
  <a-dropdown placement="bottom">
    <a class="ant-dropdown-link user-name" @click.prevent="formShow = true">
      <span class="heder-text">{{ $t('head.getFeCode') }}</span>
      <DownOutlined class="icon" />
    </a>
  </a-dropdown>
  <Tour v-model:show="formShow" title="获取前端源码指南" />
</template>
<script setup lang="ts">
//国际化切换语言
import { ref } from 'vue'
import { DownOutlined } from '@ant-design/icons-vue'
import { $t } from '@/i18n'
import Tour from './tour.vue'
const language = ref<string>('')
const formShow = ref<boolean>(false)
language.value = localStorage.getItem('language') || 'zh'
</script>
<style lang="scss" scoped>
.ant-dropdown-link {
  color: var(--icon-header-color);
}
.user-name {
  font-size: 14px;
  color: var(--icon-header-color);
}
.heder-text {
  margin-right: 5px;
}
.heder-text,
.icon {
  font-size: 14px;
  vertical-align: middle;
}
.overlay-content {
  width: 150px;
  background-color: #fff;
  min-height: 50px;
  padding: 10px;
  border-radius: 10px;
}
</style>
