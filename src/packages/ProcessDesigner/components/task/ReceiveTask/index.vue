<template>
  <div>
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
      <a-form-item label="消息实例">
        <a-select
          show-search
          :filter-option="filterOption"
          allowClear
          :placeholder="$t('selectTips')"
          style="width: 75%"
          v-model:value="formData.bindMessageId"
          @change="updateTaskMessage"
        >
          <a-select-option v-for="id in Object.keys(messageMap)" :value="id" :key="id">{{
            messageMap[id]
          }}</a-select-option>
        </a-select>
        <a-button type="primary" style="margin-left: 8px" @click="openMessageModel">添加</a-button>
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
    <a-modal v-model:open="messageModelVisible" title="创建新消息" width="400px" @ok="handelOk">
      <a-form :model="newMessageForm">
        <a-form-item label="消息ID">
          <a-input v-model:value.trim="newMessageForm.id" clearable />
        </a-form-item>
        <a-form-item label="消息名称">
          <a-input v-model:value.trim="newMessageForm.name" clearable />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch, inject, ref, nextTick } from 'vue'
import ElementMultiInstance from '../ElementMultiInstance.vue'
import ElementListeners from '../../listeners/ElementListeners.vue'
import Properties from '../../properties/index.vue'
import { message } from 'ant-design-vue'
import userFilterOption from '@/hooks/userFilterOption'
import { toRaw } from 'vue'
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
const messageModelVisible = ref<boolean>(false)
const newMessageForm: Record<any, any> = ref({
  id: '',
  name: ''
})
const bpmnMessageRefsMap: Record<any, any> = ref({})
const bpmnRootElements: any = ref([])
const formData: Record<any, any> = reactive({
  id: '',
  name: '',
  bindMessageId: undefined
})
const messageMap: Record<any, any> = ref({})
const resetForm = () => {
  formData.id = ''
  formData.name = ''
  formData.bindMessageId = undefined
  newMessageForm.value.id = ''
  newMessageForm.value.name = ''
  bpmnMessageRefsMap.value = {}
  bpmnRootElements.value = []
  messageMap.value = {}
}
watch(
  () => props.bpmnElementId,
  (newVal) => {
    nextTick(() => {
      resetStage(props.businessObject)
    })
  },
  { deep: true, immediate: true }
)
const resetStage = (businessObject: any) => {
  resetForm()
  formData.id = businessObject.id
  formData.name = businessObject.name
  formData.bindMessageId = businessObject?.messageRef?.id || undefined
  bpmnMessageRefsMap.value = Object.create(null)
  bpmnRootElements.value = bpmnInstances.modeler.getDefinitions().rootElements
  bpmnRootElements.value
    .filter((el: any) => el.$type === 'bpmn:Message')
    .forEach((m: any) => {
      bpmnMessageRefsMap.value[m.id] = m
      messageMap.value[m.id] = m.name
    })
  messageMap.value['-1'] = '无' // 添加一个空对象，保证可以取消原消息绑定
}
const handelOk = () => {
  console.log(messageMap.value, newMessageForm.value, '222222222222')
  if (messageMap.value[newMessageForm.value.id]) {
    message.error('该消息已存在，请修改id后重新保存')
    return
  }
  const newMessage = bpmnInstances.moddle.create('bpmn:Message', newMessageForm.value)
  bpmnRootElements.value.push(newMessage)
  messageMap.value[newMessageForm.value.id] = newMessageForm.value.name
  bpmnMessageRefsMap.value[newMessageForm.value.id] = newMessage
  messageModelVisible.value = false
}

const updateTaskMessage = (messageId: string) => {
  const bpmnElement = _bpmnElement()
  if (messageId === '-1') {
    updateProperties(bpmnElement, {
      messageRef: null
    })
  } else {
    const _bpmnMessageRefsMap = toRaw(bpmnMessageRefsMap.value)
    console.log(bpmnMessageRefsMap, 'bpmnMessageRefsMapbpmnMessageRefsMapbpmnMessageRefsMapbpmnMessageRefsMap')
    updateProperties(bpmnElement, {
      messageRef: _bpmnMessageRefsMap[messageId]
    })
  }
}
const openMessageModel = () => {
  messageModelVisible.value = true
  newMessageForm.value = {}
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
