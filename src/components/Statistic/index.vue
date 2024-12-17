<script setup lang="ts">
import { computed } from 'vue'
import type { CSSProperties } from 'vue'
import { formatNumber } from './tools'
interface Props {
  value?: string | number // 数值的内容 string | number
  valueStyle?: CSSProperties // 设置数值的样式
  precision?: number //	数值精度
  separator?: string // 设置千分位标识符
  formatter?: Function // 自定义数值展示
}
const props = withDefaults(defineProps<Props>(), {
  value: '',
  valueStyle: () => ({}),
  separator: ',',
  formatter: (value: string) => value
})
const showValue = computed(() => {
  return props.formatter(formatNumber(props.value, props.precision, props.separator))
})
</script>
<template>
  <span class="statictic-box" :style="valueStyle">
    {{ showValue }}
  </span>
</template>
<style lang="scss" scoped></style>
