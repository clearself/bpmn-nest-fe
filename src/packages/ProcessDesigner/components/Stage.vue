<template>
  <a-form :model="formData" layout="vertical">
    <a-form-item label="ID">
      <a-input
        allowClear
        :placeholder="$t('inputTips')"
        v-model:value.trim="formData.id"
        @change="updateBaseInfo('id')"
      />
    </a-form-item>
    <a-form-item label="名称">
      <a-input
        allowClear
        :placeholder="$t('inputTips')"
        v-model:value.trim="formData.name"
        @change="updateBaseInfo('name')"
      />
    </a-form-item>
    <a-form-item label="扩展属性">
      <Properties
        :bpmnElementId="bpmnElementId"
        :users="users"
        :roles="roles"
        :groups="groups"
        :categorys="categorys"
        :businessObject="businessObject"
        :type="type"
      />
    </a-form-item>
  </a-form>
</template>

<script setup lang="ts">
import { reactive, watch, inject, nextTick } from 'vue'
import Properties from './properties/index.vue'
// 使用inject注入函数
const updateProperties: any = inject('updateProperties')
const _bpmnElement: any = inject('bpmnElement')
const props = defineProps({
  bpmnElementId: {
    type: String
  },
  roles: {
    type: Array,
    required: true
  },
  users: {
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
interface formDataProp {
  id: string
  name: string
}
const formData: formDataProp = reactive({
  id: '',
  name: ''
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
const resetStage = (businessObject: any) => {
  formData.id = businessObject.id
  formData.name = businessObject?.categoryValueRef?.value
}
const updateBaseInfo = (key: string) => {
  const bpmnElement = _bpmnElement()
  const attrObj = Object.create(null)
  attrObj[key] = formData[key]
  if (key === 'id') {
    updateProperties(bpmnElement, {
      id: formData[key]
    })
  } else {
    updateProperties(bpmnElement, attrObj)
  }
}
</script>

<style lang="scss" scoped></style>
