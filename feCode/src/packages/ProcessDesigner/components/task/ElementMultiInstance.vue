<template>
  <div>
    <a-form layout="vertical">
      <a-form-item label="回路特性">
        <a-select
          show-search
          :filter-option="filterOption"
          allowClear
          :placeholder="$t('selectTips')"
          style="width: 100%"
          v-model:value="loopCharacteristics"
          @change="changeLoopCharacteristicsType"
        >
          <a-select-option value="ParallelMultiInstance">并行多重事件</a-select-option>
          <a-select-option value="SequentialMultiInstance">时序多重事件</a-select-option>
          <a-select-option value="StandardLoop">循环事件</a-select-option>
          <a-select-option value="Null">无</a-select-option>
        </a-select>
      </a-form-item>
      <template
        v-if="loopCharacteristics === 'ParallelMultiInstance' || loopCharacteristics === 'SequentialMultiInstance'"
      >
        <a-form-item label="循环基数">
          <a-input
            v-model:value="loopInstanceForm.loopCardinality"
            :placeholder="$t('inputTips')"
            allowClear
            @change="updateLoopCardinality"
          />
        </a-form-item>
        <a-form-item label="集合">
          <a-input
            v-model:value="loopInstanceForm.collection"
            :placeholder="$t('inputTips')"
            allowClear
            @change="updateLoopBase"
          />
        </a-form-item>
        <a-form-item label="元素变量">
          <a-input
            v-model:value="loopInstanceForm.elementVariable"
            :placeholder="$t('inputTips')"
            allowClear
            @change="updateLoopBase"
          />
        </a-form-item>
        <a-form-item label="完成条件">
          <a-input
            v-model:value="loopInstanceForm.completionCondition"
            :placeholder="$t('inputTips')"
            allowClear
            @change="updateLoopCondition"
          />
        </a-form-item>
        <a-form-item label="异步状态">
          <a-checkbox v-model:checked="loopInstanceForm.asyncBefore" @change="updateLoopAsync('asyncBefore')"
            >异步前</a-checkbox
          >
          <a-checkbox v-model:checked="loopInstanceForm.asyncAfter" @change="updateLoopAsync('asyncAfter')"
            >异步后</a-checkbox
          >
          <a-checkbox
            v-model:checked="loopInstanceForm.exclusive"
            v-if="loopInstanceForm.asyncAfter || loopInstanceForm.asyncBefore"
            @change="updateLoopAsync('exclusive')"
            >排除</a-checkbox
          >
        </a-form-item>
        <a-form-item
          label="重试周期"
          name="timeCycle"
          v-if="loopInstanceForm.asyncAfter || loopInstanceForm.asyncBefore"
        >
          <a-input
            v-model:value="loopInstanceForm.timeCycle"
            :placeholder="$t('inputTips')"
            allowClear
            @change="updateLoopTimeCycle"
          />
        </a-form-item>
      </template>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { watch, inject, ref, nextTick } from 'vue'
import userFilterOption from '@/hooks/userFilterOption'
import { toRaw } from 'vue'
const { filterOption } = userFilterOption()
// 使用inject注入函数
const updateProperties: any = inject('updateProperties')
const _bpmnInstances: any = inject('bpmnInstances')
const _bpmnElement: any = inject('bpmnElement')
const prefix: any = inject('prefix')
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
const multiLoopInstance = ref()
const loopCharacteristics: any = ref('')
//默认配置，用来覆盖原始不存在的选项，避免报错
const defaultLoopInstanceForm: any = ref({
  completionCondition: '',
  loopCardinality: '',
  extensionElements: [],
  asyncAfter: false,
  asyncBefore: false,
  exclusive: false
})
const loopInstanceForm: any = ref({})
watch(
  () => props.bpmnElementId,
  () => {
    nextTick(() => {
      resetData(props.businessObject)
    })
  },
  { deep: true, immediate: true }
)
const resetForm = () => {
  multiLoopInstance.value = null
  loopCharacteristics.value = ''
  loopInstanceForm.value = {}
  defaultLoopInstanceForm.value.completionCondition = ''
  defaultLoopInstanceForm.value.loopCardinality = ''
  defaultLoopInstanceForm.value.extensionElements = []
  defaultLoopInstanceForm.value.asyncAfter = false
  defaultLoopInstanceForm.value.asyncBefore = false
  defaultLoopInstanceForm.value.exclusive = false
}
const resetData = (businessObject: any) => {
  resetForm()
  if (!businessObject.loopCharacteristics) {
    loopCharacteristics.value = 'Null'
    loopInstanceForm.value = {}
    return
  }
  if (businessObject.loopCharacteristics.$type === 'bpmn:StandardLoopCharacteristics') {
    loopCharacteristics.value = 'StandardLoop'
    loopInstanceForm.value = {}
    return
  }
  if (businessObject.loopCharacteristics.isSequential) {
    loopCharacteristics.value = 'SequentialMultiInstance'
  } else {
    loopCharacteristics.value = 'ParallelMultiInstance'
  }
  // 合并配置
  loopInstanceForm.value = {
    ...defaultLoopInstanceForm.value,
    ...businessObject.loopCharacteristics,
    completionCondition: businessObject.loopCharacteristics?.completionCondition?.body ?? '',
    loopCardinality: businessObject.loopCharacteristics?.loopCardinality?.body ?? ''
  }
  // 保留当前元素 businessObject 上的 loopCharacteristics 实例
  multiLoopInstance.value = businessObject.loopCharacteristics
  // 更新表单
  if (
    businessObject.loopCharacteristics.extensionElements &&
    businessObject.loopCharacteristics.extensionElements.values &&
    businessObject.loopCharacteristics.extensionElements.values.length
  ) {
    loopInstanceForm.value.timeCycle = businessObject.loopCharacteristics.extensionElements.values[0].body
  }
}

const changeLoopCharacteristicsType = (type: any) => {
  const bpmnInstances: any = _bpmnInstances()
  const bpmnElement: any = _bpmnElement()
  // this.loopInstanceForm = { ...this.defaultLoopInstanceForm }; // 切换类型取消原表单配置
  // 取消多实例配置
  if (type === 'Null') {
    updateProperties(bpmnElement, { loopCharacteristics: null })
    return
  }
  // 配置循环
  if (type === 'StandardLoop') {
    const loopCharacteristicsObject = bpmnInstances.moddle.create('bpmn:StandardLoopCharacteristics')
    updateProperties(bpmnElement, {
      loopCharacteristics: loopCharacteristicsObject
    })
    multiLoopInstance.value = null
    return
  }
  // 时序
  if (type === 'SequentialMultiInstance') {
    multiLoopInstance.value = bpmnInstances.moddle.create('bpmn:MultiInstanceLoopCharacteristics', {
      isSequential: true
    })
  } else {
    multiLoopInstance.value = bpmnInstances.moddle.create('bpmn:MultiInstanceLoopCharacteristics')
  }
  updateProperties(bpmnElement, {
    loopCharacteristics: toRaw(multiLoopInstance.value)
  })
}

// 循环基数
const updateLoopCardinality = (e: any) => {
  const bpmnInstances: any = _bpmnInstances()
  const bpmnElement: any = _bpmnElement()
  const cardinality = e.target.value
  let loopCardinality = null
  if (cardinality && cardinality.length) {
    loopCardinality = bpmnInstances.moddle.create('bpmn:FormalExpression', { body: cardinality })
  }
  bpmnInstances.modeling.updateModdleProperties(bpmnElement, toRaw(multiLoopInstance.value), { loopCardinality })
}
// 完成条件
const updateLoopCondition = (e: any) => {
  const bpmnInstances: any = _bpmnInstances()
  const bpmnElement: any = _bpmnElement()
  const condition = e.target.value
  let completionCondition = null
  if (condition && condition.length) {
    completionCondition = bpmnInstances.moddle.create('bpmn:FormalExpression', { body: condition })
  }
  bpmnInstances.modeling.updateModdleProperties(bpmnElement, toRaw(multiLoopInstance.value), {
    completionCondition
  })
}
// 重试周期
const updateLoopTimeCycle = (e: any) => {
  const bpmnInstances: any = _bpmnInstances()
  const bpmnElement: any = _bpmnElement()
  const timeCycle = e.target.value
  const extensionElements = bpmnInstances.moddle.create('bpmn:ExtensionElements', {
    values: [
      bpmnInstances.moddle.create(`${prefix}:FailedJobRetryTimeCycle`, {
        body: timeCycle
      })
    ]
  })
  bpmnInstances.modeling.updateModdleProperties(bpmnElement, toRaw(multiLoopInstance.value), { extensionElements })
}
// 直接更新的基础信息
const updateLoopBase = () => {
  const bpmnInstances: any = _bpmnInstances()
  const bpmnElement: any = _bpmnElement()
  bpmnInstances.modeling.updateModdleProperties(bpmnElement, toRaw(multiLoopInstance.value), {
    collection: loopInstanceForm.value.collection || null,
    elementVariable: loopInstanceForm.value.elementVariable || null
  })
}
// 各异步状态
const updateLoopAsync = (key: any) => {
  const bpmnInstances: any = _bpmnInstances()
  const bpmnElement: any = _bpmnElement()
  const { asyncBefore, asyncAfter } = loopInstanceForm.value
  let asyncAttr = Object.create(null)
  if (!asyncBefore && !asyncAfter) {
    loopInstanceForm.value.exclusive = false
    asyncAttr = { asyncBefore: false, asyncAfter: false, exclusive: false, extensionElements: null }
  } else {
    asyncAttr[key] = loopInstanceForm.value[key]
  }
  bpmnInstances.modeling.updateModdleProperties(bpmnElement, toRaw(multiLoopInstance.value), asyncAttr)
}
</script>

<style lang="scss" scoped></style>
