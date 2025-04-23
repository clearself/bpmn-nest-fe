<template>
  <div class="w100 messge-item">
    <Bubble
      v-if="inversion"
      class="message user mb-2"
      placement="end"
      :content="text"
      :avatar="{ icon: h(UserOutlined), style: barAvatar }"
    />

    <Bubble v-else class="message assistant mb-2" placement="start" :avatar="{}">
      <template #avatar>
        <a-avatar
          src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*s5sNRo5LjfQAAAAAAAAAAAAADgCCAQ/fmt.webp"
        />
      </template>
      <template #message>
        <div class="message-assistant">
          <TextComponent
            ref="textRef"
            :inversion="inversion"
            :error="error"
            :text="text"
            :reasoning="reasoning"
            :loading="loading"
            :as-raw-text="asRawText"
          />
        </div>
      </template>
      <template #footer>
        <!-- <div class="message-loading pl-2" v-if="loading">
          <Spin />
        </div> -->
        <a-space v-if="!loading" class="pl-2">
          <a-tooltip>
            <template #title><span style="font-size: 13px">重新回答</span></template>
            <a-button type="text" size="small" :icon="h(SyncOutlined)" @click="toReanswer" />
          </a-tooltip>
          <!-- <a-tooltip>
            <template #title><span style="font-size: 13px">复制</span></template>
            <a-button type="text" size="small" :icon="h(CopyOutlined)" />
          </a-tooltip>
          <a-tooltip>
            <template #title><span style="font-size: 13px">有用</span></template>
            <a-button type="text" size="small" :icon="h(LikeOutlined)" />
          </a-tooltip> -->
        </a-space>
      </template>
    </Bubble>
  </div>
</template>

<script setup lang="ts">
import type { CSSProperties } from 'vue'
import { h, ref } from 'vue'
import { Bubble } from 'ant-design-x-vue'
import { Spin } from 'ant-design-vue'
import { UserOutlined, SyncOutlined, CopyOutlined, LikeOutlined } from '@ant-design/icons-vue'
import TextComponent from './Text.vue'
const emit = defineEmits(['reanswer'])
const props = defineProps<{
  dateTime?: string
  text?: string
  question?: string
  reasoning?: string
  inversion?: boolean
  error?: boolean
  loading?: boolean
}>()
const asRawText = ref(props.inversion)

const fooAvatar: CSSProperties = {
  color: '#f56a00',
  backgroundColor: '#fde3cf'
}

const barAvatar: CSSProperties = {
  color: '#fff',
  backgroundColor: '#87d068'
}
const toReanswer = () => {
  console.log(props, 'toReanswer')
  emit('reanswer', props.question)
}
</script>

<style lang="scss" scoped>
.message :deep(.ant-bubble-content-filled) {
  // background-color: transparent !important;
}
:deep(.message-assistant) {
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-weight: 600;
  }
  * {
    font-size: 15px;
    line-height: 1.75;
  }
}
:deep(.code-block) {
  background-color: rgba(9, 9, 11, 1);
  .code-header {
    padding: 5px 10px;
    background-color: rgba(31, 41, 55, 1);
    .lang-name {
      color: #999999;
    }
    .code-block-header__copy {
      color: #999999;
      cursor: pointer;
      &:hover {
        opacity: 0.7;
      }
    }
  }
  pre.hljs {
    padding: 10px;
  }
}
</style>
