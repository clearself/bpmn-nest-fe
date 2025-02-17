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
    <a-divider />
    <a-form-item label="执行类型">
      <a-select
        show-search
        :filter-option="filterOption"
        :options="executeTypeList"
        allowClear
        :placeholder="$t('selectTips')"
        style="width: 100%"
        v-model:value="formData.executeType"
      />
    </a-form-item>
    <a-form-item v-if="formData.executeType === 'class'" label="Java类">
      <a-input v-model:value.trim="formData.class" clearable @change="updateElementTask" />
    </a-form-item>
    <a-form-item v-if="formData.executeType === 'expression'" label="表达式">
      <a-input v-model:value.trim="formData.expression" clearable @change="updateElementTask" />
    </a-form-item>
    <!-- <a-form-item v-if="formData.executeType === 'expression'" label="结果变量">
      <a-input v-model:value.trim="formData.resultVariable" clearable @change="updateElementTask" />
    </a-form-item> -->
    <a-form-item v-if="formData.executeType === 'delegateExpression'" label="代理表达式">
      <a-input v-model:value.trim="formData.delegateExpression" clearable @change="updateElementTask" />
    </a-form-item>
    <a-divider />
    <a-form-item label="多实例">
      <ElementMultiInstance
        :bpmnElementId="bpmnElementId"
        :users="users"
        :roles="roles"
        :groups="groups"
        :categorys="categorys"
        :businessObject="businessObject"
        :type="type"
      />
    </a-form-item>
    <a-divider />
    <a-form-item label="执行监听器">
      <ElementListeners
        :bpmnElementId="bpmnElementId"
        :users="users"
        :roles="roles"
        :groups="groups"
        :categorys="categorys"
        :businessObject="businessObject"
        :type="type"
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
import { reactive, watch, inject, ref, nextTick } from 'vue'
import ElementMultiInstance from '../ElementMultiInstance.vue'
import ElementListeners from '../../listeners/ElementListeners.vue'
import userFilterOption from '@/hooks/userFilterOption'
import Properties from '../../properties/index.vue'
const { filterOption } = userFilterOption()
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
const executeTypeList = ref([
  {
    label: 'Java类',
    value: 'class'
  },
  {
    label: '表达式',
    value: 'expression'
  },
  {
    label: '代理表达式',
    value: 'delegateExpression'
  }
])
const formData: Record<any, any> = reactive({
  id: '',
  name: '',
  executeType: undefined,
  class: '',
  expression: '',
  resultVariable: '',
  delegateExpression: ''
})
const resetForm = () => {
  formData.id = ''
  formData.name = ''
  formData.executeType = undefined
  formData.class = ''
  formData.expression = ''
  formData.resultVariable = ''
  formData.delegateExpression = ''
}
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
  resetForm()
  formData.id = businessObject.id
  formData.name = businessObject.name

  console.log(businessObject, 'businessObjectbusinessObjectbusinessObject')
  for (const key in formData) {
    if (!['id', 'name'].includes(key)) {
      const value = businessObject[key]
      console.log(value, 'valuevaluevalue')
      if (value) formData.executeType = key
      formData[key] = value
    }
  }
}
const updateElementTask = () => {
  const bpmnElement = _bpmnElement()
  const taskAttr = Object.create(null)
  const type = formData.executeType
  for (const key in formData) {
    if (!['id', 'name'].includes(key)) {
      if (key !== 'executeType' && key !== type) taskAttr[key] = null
    }
  }
  taskAttr[type] = formData[type] || ''
  updateProperties(bpmnElement, taskAttr)
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
