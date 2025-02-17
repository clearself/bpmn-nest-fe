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
    <template v-if="conditionFormVisible">
      <a-form-item label="流转类型">
        <a-select
          show-search
          :filter-option="filterOption"
          :options="typeList"
          allowClear
          :placeholder="$t('selectTips')"
          style="width: 100%"
          v-model:value="formData.type"
          @change="updateFlowType"
        />
      </a-form-item>
      <a-form-item label="条件格式" v-if="formData.type === 'condition'">
        <a-select
          show-search
          :filter-option="filterOption"
          :options="conditionList"
          allowClear
          :placeholder="$t('selectTips')"
          style="width: 100%"
          v-model:value="formData.conditionType"
          @change="updateFlowType"
        />
      </a-form-item>
      <a-form-item label="表达式" v-if="formData.conditionType && formData.conditionType === 'expression'">
        <a-input
          allowClear
          :placeholder="$t('inputTips')"
          v-model:value.trim="formData.body"
          @change="updateFlowCondition"
        />
      </a-form-item>
      <template v-if="formData.conditionType && formData.conditionType === 'script'">
        <a-form-item label="脚本语言">
          <a-input v-model:value.trim="formData.language" clearable @change="updateFlowCondition" />
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
        <a-form-item label="脚本" v-if="formData.scriptType === 'inlineScript'">
          <a-textarea v-model:value.trim="formData.body" clearable @change="updateFlowCondition" />
        </a-form-item>
        <a-form-item label="资源地址" v-if="formData.scriptType === 'externalScript'">
          <a-input v-model:value.trim="formData.resource" clearable @change="updateFlowCondition" />
        </a-form-item>
      </template>
    </template>

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
import { reactive, watch, ref, inject, nextTick } from 'vue'
import Properties from '../properties/index.vue'
import userFilterOption from '@/hooks/userFilterOption'
const { filterOption } = userFilterOption()
// 使用inject注入函数
const updateProperties: any = inject('updateProperties')
const _bpmnInstances: any = inject('bpmnInstances')
const bpmnInstances: any = _bpmnInstances()
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

const typeList = ref([
  {
    label: '普通流转路径',
    value: 'normal'
  },
  {
    label: '默认流转路径',
    value: 'default'
  },
  {
    label: '条件流转路径',
    value: 'condition'
  }
])
const conditionList = ref([
  {
    label: '表达式',
    value: 'expression'
  },
  {
    label: '脚本',
    value: 'script'
  }
])
const scriptTypeList = ref([
  {
    label: '内联脚本',
    value: 'inlineScript'
  },
  {
    label: '外部脚本',
    value: 'externalScript'
  }
])

interface formDataProp {
  id: string
  name: string
  type: string | undefined
  conditionType?: string | undefined
  scriptType?: string | undefined
  body?: string
  resource?: string
  language?: string
}
const formData: formDataProp = reactive({
  id: '',
  name: '',
  type: undefined,
  conditionType: undefined,
  scriptType: undefined,
  body: '',
  resource: '',
  language: ''
})
const resetFormData = () => {
  formData.id = ''
  formData.id = ''
  formData.type = undefined
  formData.conditionType = undefined
  formData.scriptType = undefined
  formData.body = ''
  formData.resource = ''
  formData.language = ''
}
const conditionFormVisible = ref(false)
watch(
  () => props.businessObject,
  (newVal) => {
    nextTick(() => {
      resetFlowCondition(newVal)
    })
  },
  { deep: true, immediate: true }
)
// 初始化条件信息
const resetFlowCondition = (businessObject: any) => {
  resetFormData()
  const bpmnElement = _bpmnElement()
  const bpmnElementSourceRef = businessObject.sourceRef
  formData.id = businessObject.id
  formData.name = businessObject.name
  conditionFormVisible.value = !(
    props.type === 'bpmn:SequenceFlow' &&
    bpmnElementSourceRef &&
    bpmnElementSourceRef.$type.indexOf('StartEvent') > -1
  )
  // 排除与开始节点的条件节点
  if (!conditionFormVisible.value) return
  if (bpmnElementSourceRef && bpmnElementSourceRef?.default && bpmnElementSourceRef?.default?.id === bpmnElement?.id) {
    // 默认
    formData.type = 'default'
  } else if (!bpmnElement.businessObject.conditionExpression) {
    // 普通
    formData.type = 'normal'
  } else {
    // 带条件
    const conditionExpression = businessObject.conditionExpression
    formData.body = conditionExpression.body
    formData.language = conditionExpression.language
    formData.type = 'condition'
    // resource 可直接标识 是否是外部资源脚本
    if (formData.resource) {
      formData.conditionType = 'script'
      formData.scriptType = 'externalScript'
      return
    }
    if (conditionExpression.language) {
      formData.conditionType = 'script'
      formData.scriptType = 'inlineScript'
      return
    }
    formData.conditionType = 'expression'
  }
}
// 更新条件信息
const updateFlowCondition = () => {
  const bpmnElement = _bpmnElement()
  const { conditionType, scriptType, body, resource, language } = formData
  let condition
  if (conditionType === 'expression') {
    condition = bpmnInstances.moddle.create('bpmn:FormalExpression', { body })
  } else {
    if (scriptType === 'inlineScript') {
      condition = bpmnInstances.moddle.create('bpmn:FormalExpression', { body, language })
      formData.resource = ''
    } else {
      formData.body = ''
      condition = bpmnInstances.moddle.create('bpmn:FormalExpression', { resource, language })
    }
  }
  updateProperties(bpmnElement, { conditionExpression: condition })
}
const updateFlowType = (flowType: string) => {
  const bpmnElement = _bpmnElement()
  const bpmnElementSource = bpmnElement.source
  const bpmnElementSourceRef = props.businessObject.sourceRef
  console.log(flowType, 'flowType')
  // 正常条件类
  if (flowType === 'condition') {
    const flowConditionRef = bpmnInstances.moddle.create('bpmn:FormalExpression')
    updateProperties(bpmnElement, {
      conditionExpression: flowConditionRef
    })
    return
  }
  // 默认路径
  if (flowType === 'default') {
    updateProperties(bpmnElement, {
      conditionExpression: null
    })
    updateProperties(bpmnElementSource, {
      default: bpmnElement
    })
    return
  }

  // 正常路径，如果来源节点的默认路径是当前连线时，清除父元素的默认路径配置
  if (bpmnElementSourceRef?.default && bpmnElementSourceRef?.default?.id === bpmnElement?.id) {
    updateProperties(bpmnElementSource, {
      default: null
    })
  }
  updateProperties(bpmnElement, {
    conditionExpression: null
  })
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
