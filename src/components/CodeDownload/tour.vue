<template>
  <div class="modal-wrapper">
    <a-modal :title="title" v-model:open="showValue" width="750px" :footer="null">
      <div class="mt-1 w100">
        <div class="mb-1">注意：前端源码下载后本站免费提供后端接口服务7天时间，下载相关依赖后可直接启动项目。</div>
        <a-steps direction="vertical" :current="-1">
          <a-step status="finish">
            <template #icon>
              <CheckCircleFilled />
            </template>
            <template #title>
              <span>第一步：打开闲鱼主页搜索用户 “前端小牛”'</span>
            </template>
            <template #description>
              <img class="mt-1" style="max-width: 70%" src="@/assets/imgs/xianyu1.png" alt="" />
            </template>
          </a-step>
          <a-step status="finish">
            <template #icon>
              <CheckCircleFilled />
            </template>
            <template #title>
              <span>第二步：点击用户 “前端小牛”，进入主页，红色框内点击任意一个拍下并联系商家获取源码资源即可'</span>
            </template>
            <template #description>
              <img class="mt-1" style="max-width: 70%" src="@/assets/imgs/xianyu2.jpg" alt="" />
            </template>
          </a-step>
        </a-steps>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import { CheckCircleFilled } from '@ant-design/icons-vue'
// import { $t } from '@/i18n'
const emit = defineEmits(['update:show', 'success'])

const props = withDefaults(
  defineProps<{
    title?: string
    show: boolean
  }>(),
  {
    title: '',
    show: false
  }
)
const showValue = computed({
  get() {
    return props.show
  },
  set(value: boolean) {
    emit('update:show', value)
  }
})
</script>

<style lang="scss" scoped></style>
