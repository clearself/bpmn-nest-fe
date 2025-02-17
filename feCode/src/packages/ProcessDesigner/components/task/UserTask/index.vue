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
    <a-form-item label="审批人设置">
      <a-row>
        <a-radio-group v-model:value="formData.dataType" @change="changeDataType">
          <!-- <a-radio value="USERS">指定用户</a-radio> -->
          <a-radio value="ROLES">角色</a-radio>
          <a-radio value="INITIATOR">发起人</a-radio>
          <!-- <a-radio value="DEPTS">部门</a-radio>
        <a-radio value="INITIATOR">发起人</a-radio>
        <a-radio value="APPROVAL">指定接收人</a-radio>
        <a-radio value="MANAGER">部门经理</a-radio> -->
        </a-radio-group>
      </a-row>
      <a-row>
        <div class="w100 mt-2" v-if="formData.dataType === 'USERS'">
          <a-tag v-for="userText in formData.selectedUser.text" :key="userText" effect="plain">
            {{ userText }}
          </a-tag>
          <div>
            <a-button size="small" type="primary" @click="onSelectUsers()">添加用户</a-button>
          </div>
        </div>
        <div class="w100 mt-2" v-if="formData.dataType === 'ROLES'">
          <a-select
            show-search
            mode="multiple"
            :filter-option="filterOption"
            :options="roles"
            allowClear
            :placeholder="$t('selectTips')"
            style="width: 100%"
            v-model:value="formData.roleIds"
            @change="changeSelectRoles"
          />
        </div>
      </a-row>
    </a-form-item>
    <a-divider v-if="showMultiFlog" />
    <a-form-item v-if="showMultiFlog" label="多实例审批方式">
      <a-row>
        <a-radio-group v-model:value="multiLoopType" name="radioGroup" @change="changeMultiLoopType">
          <a-row><a-radio value="Null">无</a-radio></a-row>
          <a-row><a-radio value="SequentialMultiInstance">会签（需所有审批人同意）</a-radio></a-row>
          <a-row><a-radio value="ParallelMultiInstance">或签（一名审批人同意即可）</a-radio></a-row>
          <a-row><a-radio value="CustomMultiInstance">自定义会签条件</a-radio></a-row>
        </a-radio-group>
      </a-row>
      <a-row class="mt-1" v-if="multiLoopType === 'CustomMultiInstance'">
        <a-input
          v-model:value="CustomCompletionCondition"
          :placeholder="$t('inputTips')"
          allowClear
          @change="changeMultiLoopType"
        />
      </a-row>
      <div class="ub ub-ac mt-1" v-if="multiLoopType !== 'Null'">
        <a-tooltip>
          <template #title>开启后，实例需按顺序轮流审批</template>
          <InfoCircleOutlined :style="{ fontSize: '16px' }" />
        </a-tooltip>
        <span class="custom-label" style="margin-left: 5px">顺序审批：</span>
        <a-switch v-model:checked="isSequential" @change="changeMultiLoopType" />
      </div>
    </a-form-item>
    <a-divider />
    <a-form-item label="任务监听器">
      <UserTaskListeners
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
import { reactive, watch, inject, nextTick, ref } from 'vue'
import { InfoCircleOutlined } from '@ant-design/icons-vue'
// import AsyncContinue from '../AsyncContinue.vue'
import UserTaskListeners from '../../listeners/UserTaskListeners.vue'
import ElementListeners from '../../listeners/ElementListeners.vue'
import Properties from '../../properties/index.vue'
import { commonParse } from '../../../parseElement'
import userFilterOption from '@/hooks/userFilterOption'
const { filterOption } = userFilterOption()
// 使用inject注入函数
const updateProperties: any = inject('updateProperties')
const _bpmnInstances: any = inject('bpmnInstances')
const bpmnInstances: any = _bpmnInstances()
const _bpmnElement: any = inject('bpmnElement')
const userTaskForm: Record<string, any> = {
  dataType: '',
  assignee: '',
  candidateUsers: '',
  candidateGroups: '',
  text: ''
  // dueDate: '',
  // followUpDate: '',
  // priority: ''
}
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

const formData: Record<any, any> = reactive({
  id: '',
  name: '',
  dataType: '',
  selectedUser: {
    ids: [],
    text: []
  },
  roleIds: []
})
const userOpen = ref(false)
const showMultiFlog = ref(false)
const isSequential = ref(false)
const multiLoopType = ref('Null')
const multiLoopInstance = ref()
const CustomCompletionCondition = ref('${nrOfCompletedInstances/nrOfInstances>=1}')

watch(
  () => props.bpmnElementId,
  (newVal) => {
    console.log(newVal, 'newVal')
    nextTick(() => {
      resetData()
    })
  },
  { deep: true, immediate: true }
)
const resetForm = () => {
  userOpen.value = false
  showMultiFlog.value = false
  isSequential.value = false
  multiLoopType.value = 'Null'
  multiLoopInstance.value = null
  CustomCompletionCondition.value = '${nrOfCompletedInstances/nrOfInstances>=1}'
}
const resetData = () => {
  resetForm()
  // const bpmnInstances: any = _bpmnInstances()
  // const bpmnElement: any = _bpmnElement()
  // console.log(bpmnElement, 'bpmnElementbpmnElement')
  // const aaa = bpmnElement.di
  // console.log(aaa, 'aaaaaaaaaaaa')
  // bpmnInstances.modeler.get('modeling').setColor(bpmnElement, {
  //   stroke: 'green',
  //   fill: 'yellow'
  // })
  const businessObject = commonParse(props.businessObject)
  formData.id = businessObject.id
  formData.name = businessObject.name
  clearOptionsData()
  console.log(businessObject, 'businessObject00000000000000000')
  formData.dataType = businessObject?.dataType ?? (businessObject.$attrs?.dataType || '')
  userTaskForm.dataType = formData.dataType
  console.log(formData.dataType, 'formData.dataType00000000000000000')
  if (formData.dataType === 'USERS') {
    const userIdData = businessObject['candidateUsers'] || businessObject['assignee']
    const userText = businessObject['text'] || []
    if (userIdData && userIdData.toString().length > 0 && userText && userText.length > 0) {
      formData.selectedUser.ids = userIdData?.toString().split(',')
      formData.selectedUser.text = userText?.split(',')
    }
    if (formData.selectedUser.ids.length > 1) {
      showMultiFlog.value = true
    }
  } else if (formData.dataType === 'ROLES') {
    const roleIdData = businessObject['candidateGroups'] || []
    if (roleIdData && roleIdData.length > 0) {
      formData.roleIds = roleIdData.split(',')
    }
    showMultiFlog.value = true
  }
  getElementLoop(businessObject)
}
const getElementLoop = (businessObject: any) => {
  if (!businessObject.loopCharacteristics) {
    multiLoopType.value = 'Null'
    return
  }
  isSequential.value = businessObject.loopCharacteristics.isSequential
  if (businessObject.loopCharacteristics.completionCondition) {
    if (businessObject.loopCharacteristics.completionCondition.body === '${nrOfCompletedInstances >= nrOfInstances}') {
      multiLoopType.value = 'SequentialMultiInstance'
    } else if (businessObject.loopCharacteristics.completionCondition.body === '${nrOfCompletedInstances > 0}') {
      multiLoopType.value = 'ParallelMultiInstance'
    } else {
      multiLoopType.value = 'CustomMultiInstance'
    }
  }
}
const clearOptionsData = () => {
  formData.selectedUser.ids = []
  formData.selectedUser.text = []
  formData.roleIds = []
  Object.keys(userTaskForm).forEach((key: any) => (userTaskForm[key] = ''))
}
const onSelectUsers = () => {
  // this.selectedUserDate = []
  // this.$refs.multipleTable?.clearSelection();
  // this.getDeptOptions();
  userOpen.value = true
}
const changeDataType = (event: any) => {
  const val = event.target.value
  console.log(val, 'val111111111')
  if (val === 'ROLES') {
    showMultiFlog.value = true
  } else {
    showMultiFlog.value = false
  }
  multiLoopType.value = 'Null'
  changeMultiLoopType()
  // 清空 userTaskForm 所有属性值
  Object.keys(userTaskForm).forEach((key: any) => (userTaskForm[key] = ''))
  userTaskForm.dataType = val
  if (val === 'USERS') {
    if (formData.selectedUser && formData.selectedUser.ids && formData.selectedUser.ids.length > 0) {
      if (formData.selectedUser.ids.length === 1) {
        userTaskForm.assignee = formData.selectedUser.ids[0]
      } else {
        userTaskForm.candidateUsers = formData.selectedUser.ids.join()
      }
      userTaskForm.text = formData.selectedUser.text?.join() || ''
    }
  } else if (val === 'ROLES') {
    if (formData.roleIds && formData.roleIds.length > 0) {
      userTaskForm.candidateGroups = formData.roleIds.join() || ''
      const textArr = props.roles.filter((k: any) => formData.roleIds.indexOf(`ROLE${k.roleId}`) >= 0)
      userTaskForm.text = textArr?.map((k: any) => k.roleName).join() || ''
    }
  } else if (val === 'MANAGER') {
    // userTaskForm.assignee = "${DepManagerHandler.getUser(execution)}";
    // userTaskForm.text = "部门经理";
  } else if (val === 'INITIATOR') {
    console.log()
    userTaskForm.assignee = '${initiator}'
    userTaskForm.text = '流程发起人'
  }
  updateElementTask()
}
const changeSelectRoles = (val?: any[]) => {
  console.log(val, 'valvalvalval')
  let groups = ''
  let text = ''
  if (val && val.length > 0) {
    userTaskForm.dataType = 'ROLES'
    groups = val.join() || ''
    const textArr = props.roles.filter((k: any) => val.indexOf(`ROLE${k.value}`) >= 0)
    text = textArr?.map((k: any) => k.label).join() || ''
  } else {
    userTaskForm.dataType = ''
    multiLoopType.value = 'Null'
  }
  userTaskForm.candidateGroups = groups
  userTaskForm.text = text
  updateElementTask()
  changeMultiLoopType()
}
const updateElementTask = () => {
  const bpmnElement = _bpmnElement()
  console.log(userTaskForm, 'userTaskForm111111111')
  const taskAttr = Object.create(null)
  for (const key in userTaskForm) {
    taskAttr[key] = userTaskForm[key]
  }
  console.log(bpmnElement, 'bpmnElementbpmnElementbpmnElementbpmnElement33333333333')
  updateProperties(bpmnElement, taskAttr)
}

const changeMultiLoopType = () => {
  const bpmnElement = _bpmnElement()
  // 取消多实例配置
  if (multiLoopType.value === 'Null') {
    updateProperties(bpmnElement, { loopCharacteristics: null, assignee: null })
    return
  }
  multiLoopInstance.value = bpmnInstances.moddle.create('bpmn:MultiInstanceLoopCharacteristics', {
    isSequential: isSequential.value
  })
  // 更新多实例配置
  updateProperties(bpmnElement, {
    loopCharacteristics: multiLoopInstance.value,
    assignee: '${assignee}'
  })
  // 完成条件
  let completionCondition = null
  // 会签
  if (multiLoopType.value === 'SequentialMultiInstance') {
    completionCondition = bpmnInstances.moddle.create('bpmn:FormalExpression', {
      body: '${nrOfCompletedInstances >= nrOfInstances}'
    })
  }
  // 或签
  if (multiLoopType.value === 'ParallelMultiInstance') {
    completionCondition = bpmnInstances.moddle.create('bpmn:FormalExpression', {
      body: '${nrOfCompletedInstances > 0}'
    })
  }
  // 自定义会签
  if (multiLoopType.value === 'CustomMultiInstance') {
    completionCondition = bpmnInstances.moddle.create('bpmn:FormalExpression', {
      body: CustomCompletionCondition.value
    })
  }
  // 更新模块属性信息
  bpmnInstances.modeling.updateModdleProperties(bpmnElement, multiLoopInstance.value, {
    collection: '${multiInstanceHandler.getUserNames(execution)}',
    elementVariable: 'assignee',
    completionCondition
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
