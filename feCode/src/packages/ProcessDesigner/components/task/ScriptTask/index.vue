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
    <a-form-item>
      <AsyncContinue
        :bpmnElementId="bpmnElementId"
        :users="users"
        :roles="roles"
        :groups="groups"
        :categorys="categorys"
        :businessObject="businessObject"
        :type="type"
      />
    </a-form-item>
    <a-form-item label="脚本格式">
      <a-input
        v-model:value.trim="formData.scriptFormat"
        clearable
        :placeholder="$t('inputTips')"
        @input="updateElementTask()"
        @change="updateElementTask()"
      />
    </a-form-item>
    <a-form-item label="脚本类型">
      <a-select
        show-search
        :filter-option="filterOption"
        :options="scriptTypeList"
        allowClear
        :placeholder="$t('selectTips')"
        style="width: 100%"
        v-model:value="formData.scriptType"
      />
    </a-form-item>
    <a-form-item label="脚本" v-if="formData.scriptType === 'inline'">
      <a-textarea
        v-model:value.trim="formData.script"
        :rows="4"
        clearable
        :placeholder="$t('inputTips')"
        @input="updateElementTask()"
        @change="updateElementTask()"
      />
    </a-form-item>
    <a-form-item label="资源地址" v-if="formData.scriptType === 'external'">
      <a-input
        v-model:value.trim="formData.resource"
        clearable
        :placeholder="$t('inputTips')"
        @input="updateElementTask()"
        @change="updateElementTask()"
      />
    </a-form-item>
    <a-form-item label="结果变量">
      <a-input
        v-model:value.trim="formData.resultVariable"
        clearable
        :placeholder="$t('inputTips')"
        @input="updateElementTask()"
        @change="updateElementTask()"
      />
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
import AsyncContinue from '../AsyncContinue.vue'
import ElementMultiInstance from '../ElementMultiInstance.vue'
import ElementListeners from '../../listeners/ElementListeners.vue'
import Properties from '../../properties/index.vue'
import userFilterOption from '@/hooks/userFilterOption'
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
const scriptTypeList = ref([
  {
    label: '内联脚本',
    value: 'inline'
  },
  {
    label: '外部资源',
    value: 'external'
  }
])
const formData: Record<any, any> = reactive({
  id: '',
  name: '',
  scriptFormat: '',
  scriptType: undefined,
  script: '',
  resource: '',
  resultVariable: ''
})
const resetForm = () => {
  formData.id = ''
  formData.name = ''
  formData.scriptType = undefined
  formData.script = ''
  formData.resource = ''
  formData.resultVariable = ''
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
  for (const key in formData) {
    if (!['id', 'name', 'scriptType'].includes(key)) {
      const value = businessObject[key]
      console.log(value, 'valuevaluevalue')
      formData[key] = value
    }
  }
  formData.scriptType = formData.script ? 'inline' : 'external'
}
const updateElementTask = () => {
  const bpmnElement = _bpmnElement()
  const taskAttr = Object.create(null)
  taskAttr.scriptFormat = formData.scriptFormat || null
  taskAttr.resultVariable = formData.resultVariable || null
  if (formData.scriptType === 'inline') {
    taskAttr.script = formData.script || null
    taskAttr.resource = null
  } else {
    taskAttr.resource = formData.resource || null
    taskAttr.script = null
  }
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
