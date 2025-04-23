<template>
  <div class="side-box" :class="{ 'w-68px': collapsed, 'w-260px': !collapsed }">
    <Transition name="slide-fade">
      <div class="ub ub-ver side-box-content" v-show="!collapsed">
        <main class="ub ub-ver ub-f1 min-h-0">
          <div class="ub ub-pj ub-ac p-4">
            <span class="text-24px font-bold">AI小助手</span>
            <MenuFoldOutlined class="theme-color" @click="changeCollapsed" />
          </div>
          <div class="p-4">
            <a-button block type="primary" @click="handleAdd"> 新建会话 </a-button>
          </div>
          <div class="ub-f1 min-h-0 overflow-hidden" style="padding-bottom: 1rem">
            <List />
          </div>
        </main>
      </div>
    </Transition>
    <Transition name="slide2-fade">
      <div class="ub ub-ver ub-ac side-box-content-collapsed" v-show="collapsed">
        <main class="ub ub-ver ub-f1 min-h-0">
          <div class="ub ub-pj ub-ac p-4">
            <MenuUnfoldOutlined class="theme-color" @click="changeCollapsed" />
          </div>
          <div class="p-4">
            <a-tooltip>
              <template #title><span style="font-size: 13px">新建会话</span></template>
              <PlusOutlined class="theme-color" @click="handleAdd" />
            </a-tooltip>
          </div>
          <div class="p-4">
            <a-tooltip>
              <template #title><span style="font-size: 13px">查看历史</span></template>
              <HistoryOutlined class="theme-color" @click="changeCollapsed" />
            </a-tooltip>
          </div>
        </main>
      </div>
    </Transition>
  </div>
</template>
<script setup lang="ts">
import { MenuFoldOutlined, MenuUnfoldOutlined, HistoryOutlined, PlusOutlined } from '@ant-design/icons-vue'
import { useChatStore } from '@/store/modules/chat'
import { computed } from 'vue'
import List from './List.vue'
import { useAppStore } from '@/store/modules/app'
const appStore = useAppStore()
const chatStore = useChatStore()
const collapsed = computed(() => appStore.siderCollapsed)
function handleAdd() {
  chatStore.createNewChat()
}
function changeCollapsed() {
  appStore.setSiderCollapsed(!collapsed.value)
}
</script>
<style lang="scss" scoped>
.text-24px {
  font-size: 24px;
}
.side-box {
  height: 100%;
  position: relative;
  transition: all 0.3s ease;
  &.w-68px {
    width: 68px;
  }
  &.w-260px {
    width: 260px;
  }
  .side-box-content {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 10;
    // background-color: #212327;
    width: 260px;
    height: 100%;
    overflow: hidden;
  }
  .side-box-content-collapsed {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 9;
    // background-color: #212327;
    width: 68px;
    height: 100%;
    overflow: hidden;
  }
}
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(-192px);
  opacity: 0;
}
.slide2-fade-enter-active,
.slide2-fade-leave-active {
  transition: all 0.3s ease;
}

.slide2-fade-leave-to,
.slide2-fade-enter-from {
  opacity: 0;
}
</style>
