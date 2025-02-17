<template>
  <a-dropdown placement="bottom">
    <a class="ant-dropdown-link user-name" @click="handleDownLoadByUrl('https://www.flypa.cn/feCode/feCode.zip')">
      <span class="heder-text">{{ $t('head.downFeCode') }}</span>
      <CloudDownloadOutlined class="icon" />
    </a>
  </a-dropdown>
</template>
<script setup lang="ts">
//国际化切换语言
import { ref } from 'vue'
import { handleDownLoadByUrl } from '@/utils/tools'
import { CloudDownloadOutlined } from '@ant-design/icons-vue'
import { $t } from '@/i18n'
const language = ref<string>('')
language.value = localStorage.getItem('language') || 'zh'
</script>
<style lang="scss" scoped>
.ant-dropdown-link {
  color: var(--icon-header-color);
}
.user-name {
  cursor: pointer;
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
</style>
