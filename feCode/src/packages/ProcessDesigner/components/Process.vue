<template>
  <a-form ref="formRef" :model="formData" layout="vertical">
    <a-form-item
      label="流程标识"
      name="id"
      :rules="[
        {
          required: true
        }
      ]"
    >
      <a-input disabled allowClear :placeholder="$t('inputTips')" v-model:value.trim="formData.id" />
    </a-form-item>
    <a-form-item
      label="流程名称"
      name="name"
      :rules="[
        {
          required: true
        }
      ]"
    >
      <a-input allowClear :placeholder="$t('inputTips')" v-model:value.trim="formData.name" />
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
import { reactive, watch, ref, watchEffect, inject, onBeforeUnmount } from 'vue'
import { message } from 'ant-design-vue'
import Properties from './properties/index.vue'
// 使用inject注入函数
const updateProperties = inject('updateProperties')
const _bpmnElement = inject('bpmnElement')
const bpmnElement = _bpmnElement()
const formRef = ref()
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
const formData = reactive({
  id: '',
  name: ''
})
watchEffect(() => {
  formData.id = props.businessObject.id
  formData.name = props.businessObject.name
})
watch(
  () => formData.name,
  (val) => {
    updateProperties(bpmnElement, { name: val })
  }
)
onBeforeUnmount(() => {
  formRef.value
    .validate()
    .then(async () => {
      console.log('验证成功')
    })
    .catch((error: any) => {
      message.error('有必选或者必填字段没有选择或填写！')
      console.log('error', error)
    })
})
</script>

<style lang="scss" scoped></style>
