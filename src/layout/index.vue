<script lang="ts" setup>
import { computed } from 'vue'
import { useTheme } from '@/hooks/useTheme'
const { activeModalName } = useTheme()
import LeftMode from './LeftMode.vue'
import TopMode from './TopMode.vue'
import TopLeftMode from './TopLeftMode.vue'
const classes = computed(() => {
  return {
    showGreyMode: false,
    showColorWeakness: false
  }
})
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
</style>
