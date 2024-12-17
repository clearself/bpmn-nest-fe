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
    <template
      v-if="
        businessObject?.eventDefinitions &&
        businessObject.eventDefinitions[0].$type.indexOf('TimerEventDefinition') !== -1
      "
    >
      <a-form-item label="事件类型">
        <a-select
          show-search
          :filter-option="filterOption"
          :options="eventList"
          allowClear
          :placeholder="$t('selectTips')"
          style="width: 100%"
          v-model:value="formData.timeDefinitionType"
          @change="changeTimerType"
        />
      </a-form-item>

      <a-form-item label="时间设置" v-if="formData.timeDefinitionType !== ''">
        <a-tooltip>
          <template #title>
            事件类型配置说明<br />
            1.指定时间(timeDate):触发事件的时间,如:2022-12-16T11:12:16 <br />
            2.持续时间(timeDuration):指定时器之前需等待多长时间,使用ISO 8601规定的格式<br />
            (由BPMN 2.0规定),如PT5M(等待5分钟),也支持表达式${duration},<br />
            这样你就可以通过流程变量来影响定时器定义<br />
            3.周期执行(timeCycle):指定重复执行的间隔,可以用来定期启动流程实例,<br />
            或为超时时间发送多个提醒。timeCycle元素可以使用两种格式。<br />
            第一种是 ISO 8601 标准的格式。示例值(R3/PT5M)(重复3次,<br />
            每次间隔5分钟),或也可以用cron表达式指定timeCycle,如从整点开始,<br />
            每10分钟执行一次(0 0/10 * * * ?)<br />
          </template>
          <a-input
            v-model:value.trim="formData.FormalExpression"
            :placeholder="$t('inputTips')"
            clearable
            @change="updateTimeValue"
          />
        </a-tooltip>
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
    </template>
  </a-form>
</template>

<script setup lang="ts">
import { reactive, watch, ref, inject, nextTick } from 'vue'
import ElementListeners from '../listeners/ElementListeners.vue'
import userFilterOption from '@/hooks/userFilterOption'
import Properties from '../properties/index.vue'
const { filterOption } = userFilterOption()
// 使用inject注入函数
const updateProperties: any = inject('updateProperties')
const _bpmnInstances: any = inject('bpmnInstances')
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
const eventList = ref([
  {
    label: '指定时间',
    value: 'timeDate'
  },
  {
    label: '持续时间',
    value: 'timeDuration'
  },
  {
    label: '周期执行',
    value: 'timeCycle'
  }
])

const formData: Record<any, any> = reactive({
  id: '',
  name: '',
  timeDefinitionType: undefined,
  FormalExpression: ''
})
watch(
  () => props.businessObject,
  (newVal) => {
    nextTick(() => {
      resetData(newVal)
    })
  },
  { deep: true, immediate: true }
)
const resetForm = () => {
  formData.id = ''
  formData.name = ''
  formData.timeDefinitionType = undefined
  formData.FormalExpression = ''
}
// 初始化条件信息
const resetData = (businessObject: any) => {
  resetForm()
  formData.id = businessObject.id
  formData.name = businessObject.name
  // eslint-disable-next-line no-prototype-builtins
  if (businessObject.hasOwnProperty('eventDefinitions') && businessObject.eventDefinitions.length > 0) {
    if (businessObject.eventDefinitions[0].$type == 'bpmn:TimerEventDefinition') {
      // eslint-disable-next-line no-prototype-builtins
      if (businessObject.eventDefinitions[0]?.timeDuration?.body) {
        formData.timeDefinitionType = 'timeDuration'
        formData.FormalExpression = businessObject.eventDefinitions[0].timeDuration?.body
        // eslint-disable-next-line no-prototype-builtins
      } else if (businessObject.eventDefinitions[0]?.timeDate?.body) {
        formData.timeDefinitionType = 'timeDate'
        formData.FormalExpression = businessObject.eventDefinitions[0].timeDate?.body
        // eslint-disable-next-line no-prototype-builtins
      } else if (businessObject.eventDefinitions[0]?.timeCycle?.body) {
        formData.timeDefinitionType = 'timeCycle'
        formData.FormalExpression = businessObject.eventDefinitions[0].timeCycle?.body
      }
    }
  }
}
// 更新条件信息
const updateTimeValue = (e: any) => {
  updateTime(formData.timeDefinitionType, e.target.value)
}
//时间事件定义类型修改
const updateTime = (type: string, value: any) => {
  const bpmnInstances: any = _bpmnInstances()
  const bpmnElement: any = _bpmnElement()
  //获取节点的子节点 timerEventDefinition
  console.log(bpmnElement, 'bpmnElement')
  const timerEventDef = bpmnElement.businessObject.eventDefinitions[0]
  console.log(timerEventDef, 'timerEventDef')
  const timeCycle = bpmnInstances.moddle.create('bpmn:FormalExpression', { body: value })
  const timeDate = bpmnInstances.moddle.create('bpmn:FormalExpression', { body: value })
  const timeDuration = bpmnInstances.moddle.create('bpmn:FormalExpression', { body: value })
  if (type == 'timeCycle') {
    bpmnInstances.modeling.updateModdleProperties(bpmnElement, timerEventDef, { timeDate: null })
    bpmnInstances.modeling.updateModdleProperties(bpmnElement, timerEventDef, { timeDuration: null })
    bpmnInstances.modeling.updateModdleProperties(bpmnElement, timerEventDef, { timeCycle })
  } else if (type == 'timeDate') {
    bpmnInstances.modeling.updateModdleProperties(bpmnElement, timerEventDef, { timeCycle: null })
    bpmnInstances.modeling.updateModdleProperties(bpmnElement, timerEventDef, { timeDuration: null })
    bpmnInstances.modeling.updateModdleProperties(bpmnElement, timerEventDef, { timeDate })
  } else if (type == 'timeDuration') {
    bpmnInstances.modeling.updateModdleProperties(bpmnElement, timerEventDef, { timeDate: null })
    bpmnInstances.modeling.updateModdleProperties(bpmnElement, timerEventDef, { timeCycle: null })
    bpmnInstances.modeling.updateModdleProperties(bpmnElement, timerEventDef, { timeDuration })
  }
}
const changeTimerType = (timeDefinitionType: string) => {
  formData.FormalExpression = ''
  formData.timeDefinitionType = timeDefinitionType
  updateTime(formData.timeDefinitionType, formData.FormalExpression)
}
const updateBaseInfo = (key: string) => {
  const bpmnElement: any = _bpmnElement()
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
