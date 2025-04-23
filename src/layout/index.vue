<script lang="ts" setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router' //路由
import { useTheme } from '@/hooks/useTheme'
const { activeModalName } = useTheme()
const router = useRouter() // 路由
import LeftMode from './LeftMode.vue'
import TopMode from './TopMode.vue'
import TopLeftMode from './TopLeftMode.vue'
const classes = computed(() => {
  return {
    showGreyMode: false,
    showColorWeakness: false
  }
})
const toAi = () => {
  const { href } = router.resolve({
    path: `/chat`
  })
  window.open(href, '_blank')
}
</script>

<template>
  <div :class="classes" class="w100">
    <watermark>
      <!-- 左侧模式 -->
      <LeftMode v-if="activeModalName === 'left'" />
      <!-- 顶部模式 -->
      <TopMode v-else-if="activeModalName === 'top'" />
      <!-- 顶部-左侧模式 -->
      <TopLeftMode v-else-if="activeModalName === 'top-left'" />
      <a-float-button
        :style="{
          right: '24px',
          width: '80px',
          height: '80px'
        }"
        tooltip="AI智能助手"
        @click="toAi"
      >
        <template #icon>
          <img
            width="60"
            height="60"
            src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*s5sNRo5LjfQAAAAAAAAAAAAADgCCAQ/fmt.webp"
            alt="AI助手"
          />
        </template>
      </a-float-button>
    </watermark>
  </div>
</template>

<style lang="scss" scoped>
.showGreyMode {
  filter: grayscale(1);
}

.showColorWeakness {
  filter: invert(0.8);
}
:deep(.ant-float-btn .ant-float-btn-body .ant-float-btn-content .ant-float-btn-icon) {
  width: auto;
}
</style>
