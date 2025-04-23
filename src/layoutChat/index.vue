<script lang="ts" setup>
import { computed } from 'vue'
import LeftMode from './LeftMode.vue'
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
      <LeftMode />
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
