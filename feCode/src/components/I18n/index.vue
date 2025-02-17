<template>
  <a-dropdown placement="bottom">
    <a class="ant-dropdown-link user-name" @click.prevent>
      <span class="heder-text">{{ language === 'zh' ? $t('lang.zh') : $t('lang.en') }}</span>
      <DownOutlined class="icon" />
    </a>
    <template #overlay>
      <a-menu>
        <a-menu-item>
          <a href="javascript:;" @click="change('zh')">{{ $t('lang.zh') }}</a>
        </a-menu-item>
        <a-menu-item>
          <a href="javascript:;" @click="change('en')">{{ $t('lang.en') }}</a>
        </a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
</template>
<script setup lang="ts">
//国际化切换语言
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { DownOutlined } from '@ant-design/icons-vue'
import { changeLanguage, $t } from '@/i18n'
const router = useRouter()
const change = (language: string) => {
  changeLanguage(language)
  router.go(0)
}
const language = ref<string>('')
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
</style>
