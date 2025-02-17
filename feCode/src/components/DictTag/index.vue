<template>
  <div>
    <template v-for="(item, index) in options" :key="index">
      <template v-if="values.includes(item.value)">
        <a-tag :class="item.elTagClass" :color="item.elTagType ? item.elTagType : 'default'">{{ item.label }}</a-tag>
      </template>
    </template>
    <template v-if="unmatch && showValue">
      {{ unmatchArray | handleArray }}
    </template>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
// // 记录未匹配的项
const unmatchArray = ref([])

const props = defineProps({
  // 数据
  options: {
    type: Array,
    default: null
  },
  // 当前的值
  value: [Number, String, Array],
  // 当未找到匹配的数据时，显示value
  showValue: {
    type: Boolean,
    default: true
  }
})

const values = computed(() => {
  if (props.value !== null && typeof props.value !== 'undefined') {
    return Array.isArray(props.value) ? props.value : [String(props.value)]
  } else {
    return []
  }
})

const unmatch = computed(() => {
  unmatchArray.value = []
  if (props.value !== null && typeof props.value !== 'undefined') {
    // 传入值为非数组
    if (!Array.isArray(props.value)) {
      if (props.options.some((v) => v.value == props.value)) return false
      unmatchArray.value.push(props.value)
      return true
    }
    // 传入值为Array
    props.value.forEach((item) => {
      if (!props.options.some((v) => v.value == item)) unmatchArray.value.push(item)
    })
    return true
  }
  // 没有value不显示
  return false
})
const handleArray = (array) => {
  if (array.length === 0) return ''
  return array.reduce((pre, cur) => {
    return pre + ' ' + cur
  })
}
</script>

<style scoped>
.a-tag + .a-tag {
  margin-left: 10px;
}
</style>
