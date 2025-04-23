<template>
  <el-scrollbar class="list-wrapper">
    <div class="ub ub-ver" style="gap: 0.5rem">
      <template v-if="!dataSources.length">
        <div class="ub ub-ver ub-ac" style="margin-top: 4px; text-align: center">
          <a-empty />
        </div>
      </template>
      <template v-else>
        <div v-for="(item, index) of dataSources" :key="index">
          <div class="ub w100 history-item" :class="isActive(item.uuid) && ['theme-color']" @click="handleSelect(item)">
            <div class="history-title">
              {{ item.title }}
            </div>
            <div style="margin-left: 5px">
              <a-dropdown>
                <a class="ant-dropdown-link" @click.prevent>
                  <EditOutlined class="theme-color" />
                </a>
                <template #overlay>
                  <a-menu>
                    <a-menu-item>
                      <a href="javascript:;" style="font-size: 13px" @click="handleDelete(item)">删除</a>
                    </a-menu-item>
                  </a-menu>
                </template>
              </a-dropdown>
            </div>
          </div>
        </div>
      </template>
    </div>
  </el-scrollbar>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useChatStore } from '@/store/modules/chat'
import { EditOutlined } from '@ant-design/icons-vue'
const chatStore = useChatStore()
const dataSources = computed(() => chatStore.history)

function isActive(uuid: number) {
  return chatStore.active === uuid
}
async function handleSelect({ uuid }: Chat.History) {
  if (isActive(uuid)) return

  if (chatStore.active) chatStore.updateHistory(chatStore.active, { isEdit: false })
  await chatStore.setActive(uuid)
}
function handleDelete(item: any) {
  if (item?.uuid) {
    chatStore.deleteHistory(item.uuid)
  }
}
</script>

<style scoped lang="scss">
.list-wrapper {
  padding-left: 1rem;
  padding-right: 1rem;
}
.history-item {
  font-size: 14px;
  padding-left: 10px;
  padding-right: 10px;
  border-radius: 12px;
  word-break: break-all;
  align-items: center;
  cursor: pointer;
  display: flex;
  height: 38px;
  position: relative;
  &:hover {
    color: rgba(0, 0, 0, 0.7);
  }
  .history-title {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    flex: 1;
  }
}
</style>
