<template>
  <div>
    <a-checkbox v-model:checked="taskConfigForm.asyncBefore" @change="changeTaskAsync">异步前</a-checkbox>
    <a-checkbox v-model:checked="taskConfigForm.asyncAfter" @change="changeTaskAsync">异步后</a-checkbox>
    <a-checkbox
      v-model:checked="taskConfigForm.exclusive"
      v-if="taskConfigForm.asyncAfter || taskConfigForm.asyncBefore"
      @change="changeTaskAsync"
      >排除</a-checkbox
    >
  </div>
</template>

<script setup lang="ts">
import { reactive, watch, inject, toRaw, nextTick } from 'vue'
// 使用inject注入函数
const updateProperties: any = inject('updateProperties')
const _bpmnElement: any = inject('bpmnElement')
const props = defineProps({
  bpmnElementId: {
    type: String
  },
  users: {
    type: Array,
    required: true
  },
  roles: {
    type: Array,
    required: true
  },
  groups: {
    type: Array,
    required: true
  },
  categorys: {
    type: Array,
    required: true
  },
  businessObject: Object,
  type: {
    type: String,
    default: ''
  }
})
const taskConfigForm = reactive({
  asyncAfter: false,
  asyncBefore: false,
  exclusive: false
})
watch(
  () => props.businessObject,
  (newVal) => {
    nextTick(() => {
      resetStage(newVal)
    })
  },
  { deep: true, immediate: true }
)
watch(
  () => props.businessObject,
  (newVal) => {
    nextTick(() => {
      resetStage(newVal)
    })
  },
  { deep: true, immediate: true }
)
const resetData = () => {
  taskConfigForm.asyncBefore = false
  taskConfigForm.asyncAfter = false
  taskConfigForm.exclusive = false
}
const resetStage = (businessObject: any) => {
  resetData()
  taskConfigForm.asyncBefore = businessObject?.asyncBefore
  taskConfigForm.asyncAfter = businessObject?.asyncAfter
  taskConfigForm.exclusive = businessObject?.exclusive
}
const changeTaskAsync = () => {
  const bpmnElement = _bpmnElement()
  if (!taskConfigForm.asyncBefore && !taskConfigForm.asyncAfter) {
    taskConfigForm.exclusive = false
  }
  updateProperties(bpmnElement, {
    ...toRaw(taskConfigForm)
  })
}
</script>

<style lang="scss" scoped></style>
