<template>
  <div
    class="sys_header"
    :class="{
      'left-header': activeModalName === 'left' || activeModalName === 'top-left',
      'top-header': activeModalName === 'top'
    }"
  >
    <div class="ub ub-ac pl-2" v-if="activeModalName === 'top-left'">
      <img width="120" height="30" :src="logoImg" />
    </div>
    <div class="ub ub-f1 ub-ac ub-pe right">
      <!-- 获取源码 -->
      <div v-if="userId === '104'" class="ml-2">
        <DownloadCode />
      </div>
      <!-- 获取源码指南 -->
      <div class="ml-2">
        <CodeDownload />
      </div>
      <!-- 布局切换 -->
      <div class="ml-2">
        <a-dropdown trigger="click" placement="bottom" :overlayStyle="{ zIndex: '9999' }">
          <a class="ant-dropdown-link user-name" @click.prevent>
            <a-tooltip placement="bottom" color="rgba(255,255,255,.7)">
              <template #title>
                <span style="color: #000">{{ $t('theme.modalTip') }}</span>
              </template>
              <LayoutOutlined class="icon" />
            </a-tooltip>
          </a>
          <template #overlay>
            <a-menu>
              <a-menu-item v-for="(modal, index) in modalList" :key="index" :disabled="activeModalName === modal.name">
                <a href="javascript:;" @click="setModal(modal.name)">{{ modal.title }}</a>
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </div>
      <!-- 主题切换 -->
      <div class="ml-2">
        <a-dropdown trigger="click" placement="bottom" :overlayStyle="{ zIndex: '9999' }">
          <a class="ant-dropdown-link user-name" @click.prevent>
            <a-tooltip placement="bottom" color="rgba(255,255,255,.7)">
              <template #title>
                <span style="color: #000">{{ $t('theme.tip') }}</span>
              </template>
              <BulbOutlined class="icon" />
            </a-tooltip>
          </a>
          <template #overlay>
            <a-menu>
              <a-menu-item v-for="(theme, index) in themeList" :key="index" :disabled="activeThemeName === theme.name">
                <a href="javascript:;" @click="setTheme(theme.name)">{{ theme.title }}</a>
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </div>

      <!-- 中英文切换 -->
      <div class="ml-2">
        <I18n />
      </div>
      <!-- 用户信息 -->
      <div class="ml-2">
        <a-dropdown placement="bottom">
          <div class="ub ub-ac">
            <a-avatar :size="24">
              <template #icon><UserOutlined class="icon" /></template>
            </a-avatar>
            <div class="ml-1 user-name heder-text">{{ name }}</div>
          </div>
          <template #overlay>
            <a-menu>
              <a-menu-item>
                <span>{{ deptName }}</span>
              </a-menu-item>
              <a-menu-item>
                <a href="javascript:;" @click="exit">{{ $t('head.exit') }}</a>
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup scoped>
import { useTheme } from '@/hooks/useTheme'
const { themeList, activeThemeName, setTheme, modalList, activeModalName, setModal } = useTheme()
import { $t } from '@/i18n'
import { storeToRefs } from 'pinia'
import logoImg from '@/assets/imgs/logo.png'
import useUserStoreHook from '@/store/modules/user'
const userStore = useUserStoreHook()
const { name, userId, deptName } = storeToRefs(userStore)
import { UserOutlined, BulbOutlined, LayoutOutlined, DownOutlined } from '@ant-design/icons-vue'

const exit = () => {
  userStore.logOut()
}
</script>
<style lang="scss" scoped>
.sys_header {
  height: var(--esg-navigationbar-height);
  background-color: #ffffff;
  display: flex !important;
  width: 100%;
  z-index: 999;
  flex-direction: row;
  box-shadow: 0 2px 6px #00000014;
  :deep(.anticon.icon) * {
    font-size: 18px !important;
  }
}
.ant-dropdown-link {
  color: var(--icon-header-color);
}
.right {
  padding-right: 20px;
}
.user-name {
  font-size: 14px;
  color: var(--icon-header-color);
}
</style>
