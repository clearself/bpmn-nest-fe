<template>
  <div class="container-message" id="messageCompBox">
    <template v-if="message.length">
      <div class="box-item" v-for="(item, index) in message" :key="`message_${index}`">
        <div class="message-item-assistant" v-if="item.role == 'assistant'">
          <a-avatar class="icon" :src="aiPng" />
          <div class="texts left">
            <div class="text-left">
              <Markdown :source="item.content" />
            </div>
          </div>
          <div />
        </div>
        <div class="message-item-custom" v-else>
          <div />
          <div class="texts right">
            <div class="text-right">
              <Markdown :source="item.content" />
            </div>
          </div>
          <a-avatar class="icon" :src="userPng" />
        </div>
      </div>
    </template>
    <template v-else>
      <div class="empty-box">
        <a-empty />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { nextTick } from 'vue'
import userPng from '@/assets/imgs/user.png'
import aiPng from '@/assets/imgs/ai.png'
import Markdown from 'vue3-markdown-it'
defineProps({
  message: {
    type: Array,
    default: () => []
  }
})
const scrollBottom = () => {
  nextTick(() => {
    const div = document.getElementById('messageCompBox')
    div.scrollTop = div.scrollHeight - div.clientHeight
  })
}
defineExpose({
  scrollBottom
})
</script>

<style scoped lang="scss">
.container-message {
  ::v-deep(p) {
    margin-top: 1em;
    margin-bottom: 1em;
  }
}

.container-message {
  width: 100%;
  height: 100%;
  overflow: auto;
  .empty-box {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    .el-empty {
    }
  }

  .box-item {
    margin-bottom: 18px;
    // user
    .message-item-custom {
      display: grid;
      grid-template-columns: 18% auto 40px;
      justify-content: end;
      column-gap: 12px;
      .icon {
        width: 40px;
        height: 40px;
        background-color: #fff;
        border: 2px solid #1296db;
        padding: 6px;
      }
      .texts {
        .text-right {
          padding: 0 16px;
          color: #fff;
          position: relative;
        }
      }
    }
    // assistant
    .message-item-assistant {
      display: grid;
      grid-template-columns: 40px auto 18%;
      justify-content: start;
      column-gap: 12px;
      .icon {
        width: 40px;
        height: 40px;
        background-color: #fff;
        border: 2px solid #1296db;
        padding: 4px;
      }
      .texts {
        .text-left {
          padding: 0 16px;
          color: #fff;
          position: relative;
        }
      }
    }
  }
}

.left,
.right {
  background-color: #07c160;
  position: relative;
  border-radius: 8px;
}
.left::before {
  content: '';
  width: 0;
  height: 0;
  position: absolute;
  border: 5px solid transparent;
  border-right-color: #07c160;
  left: -9px;
  top: 15px;
}
.right::before {
  content: '';
  width: 0;
  height: 0;
  position: absolute;
  border: 5px solid transparent;
  border-left-color: #07c160;
  right: -9px;
  top: 15px;
}
</style>
