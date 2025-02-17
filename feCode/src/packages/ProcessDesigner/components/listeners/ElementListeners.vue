<template>
  <div class="w100">
    <a-table
      class="ant-table-striped"
      :row-class-name="(_record: any, index: number) => (index % 2 === 1 ? 'table-striped' : null)"
      bordered
      size="small"
      :columns="columnsList"
      :row-key="(record: any) => record.id"
      :data-source="elementListenersList"
      :pagination="false"
      :scroll="{ y: 500 }"
    >
      <template #bodyCell="{ column, record, index }">
        <template v-if="column.dataIndex === 'index'">
          <a> {{ parseInt(index) + 1 }} </a>
        </template>
        <template v-if="column.dataIndex === 'listenerType'">
          <span>{{ listenerTypeObject[record.listenerType] }}</span>
        </template>
        <template v-if="column.dataIndex === 'operation'">
          <a-button type="link" size="small" @click="openListenerForm(record, index)">{{ $t('opts.edit') }}</a-button>
          <a-button type="link" size="small" @click="removeListener(record, index)">{{ $t('opts.delete') }}</a-button>
        </template>
      </template>
    </a-table>
    <div class="w100 mt-1">
      <a-button block type="primary" @click="openListenerForm(null)">添加监听器</a-button>
    </div>
  </div>
  <a-drawer v-model:open="listenerFormModelVisible" title="执行监听器" width="500px" placement="right" destroyOnClose>
    <a-form :model="listenerForm" layout="vertical" ref="listenerFormRef">
      <a-form-item label="事件类型" name="event" :rules="{ required: true, trigger: ['blur', 'change'] }">
        <a-select
          show-search
          :filter-option="filterOption"
          allowClear
          :placeholder="$t('selectTips')"
          style="width: 100%"
          v-model:value="listenerForm.event"
        >
          <a-select-option value="start">start</a-select-option>
          <a-select-option value="end">end</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="监听器类型" name="listenerType" :rules="{ required: true, trigger: ['blur', 'change'] }">
        <a-select
          show-search
          :filter-option="filterOption"
          allowClear
          :placeholder="$t('selectTips')"
          style="width: 100%"
          v-model:value="listenerForm.listenerType"
        >
          <a-select-option v-for="i in Object.keys(listenerTypeObject)" :key="i" :value="i">{{
            listenerTypeObject[i]
          }}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item
        v-if="listenerForm.listenerType === 'classListener'"
        label="Java类"
        name="class"
        :rules="{ required: true, trigger: ['blur', 'change'] }"
      >
        <a-input allowClear :placeholder="$t('inputTips')" v-model:value.trim="listenerForm.class" />
      </a-form-item>
      <a-form-item
        v-if="listenerForm.listenerType === 'expressionListener'"
        label="表达式"
        name="expression"
        :rules="{ required: true, trigger: ['blur', 'change'] }"
      >
        <a-input v-model:value.trim="listenerForm.expression" :placeholder="$t('inputTips')" allowClear />
      </a-form-item>
      <a-form-item
        v-if="listenerForm.listenerType === 'delegateExpressionListener'"
        label="代理表达式"
        name="delegateExpression"
        :rules="{ required: true, trigger: ['blur', 'change'] }"
      >
        <a-input v-model:value.trim="listenerForm.delegateExpression" :placeholder="$t('inputTips')" allowClear />
      </a-form-item>
      <template v-if="listenerForm.listenerType === 'scriptListener'">
        <a-form-item
          label="脚本格式"
          name="scriptFormat"
          :rules="{ required: true, trigger: ['blur', 'change'], message: '请填写脚本格式' }"
        >
          <a-input v-model:value.trim="listenerForm.scriptFormat" :placeholder="$t('inputTips')" allowClear />
        </a-form-item>
        <a-form-item
          label="脚本类型"
          name="scriptType"
          :rules="{ required: true, trigger: ['blur', 'change'], message: '请选择脚本类型' }"
        >
          <a-select
            v-model:value="listenerForm.scriptType"
            show-search
            :filter-option="filterOption"
            allowClear
            :placeholder="$t('selectTips')"
            style="width: 100%"
          >
            <a-select-option value="inlineScript">内联脚本</a-select-option>
            <a-select-option value="externalScript">外部脚本</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          v-if="listenerForm.scriptType === 'inlineScript'"
          label="脚本内容"
          name="value"
          :rules="{ required: true, trigger: ['blur', 'change'], message: '请填写脚本内容' }"
        >
          <a-input v-model:value.trim="listenerForm.value" :placeholder="$t('inputTips')" allowClear />
        </a-form-item>
        <a-form-item
          v-if="listenerForm.scriptType === 'externalScript'"
          label="资源地址"
          name="resource"
          :rules="{ required: true, trigger: ['blur', 'change'], message: '请填写资源地址' }"
        >
          <a-input v-model:value.trim="listenerForm.resource" :placeholder="$t('inputTips')" allowClear />
        </a-form-item>
      </template>
    </a-form>
    <a-divider />
    <p class="listener-filed__title">
      <span><i class="a-icon-menu" />注入字段：</span>
      <a-button size="small" type="primary" @click="openListenerFieldForm(null)">添加字段</a-button>
    </p>
    <a-table
      class="ant-table-striped"
      :row-class-name="(_record: any, index: number) => (index % 2 === 1 ? 'table-striped' : null)"
      bordered
      size="small"
      :columns="columnsFieldList"
      :row-key="(record: any) => record.id"
      :data-source="fieldsListOfListener"
      :pagination="false"
      :scroll="{ y: 500 }"
    >
      <template #bodyCell="{ column, record, index }">
        <template v-if="column.dataIndex === 'index'">
          <a> {{ parseInt(index) + 1 }} </a>
        </template>
        <template v-if="column.dataIndex === 'fieldType'">
          <span>{{ fieldTypeObject[record.fieldType] }}</span>
        </template>

        <template v-if="column.dataIndex === 'expression'">
          <span>{{ record.string || record.expression }}</span>
        </template>
        <template v-if="column.dataIndex === 'operation'">
          <a-button type="link" size="small" @click="openListenerFieldForm(record, index)">{{
            $t('opts.edit')
          }}</a-button>
          <a-button type="link" size="small" @click="removeListenerField(record, index)">{{
            $t('opts.delete')
          }}</a-button>
        </template>
      </template>
    </a-table>
    <div class="w100 ub ub-ac ub-pc mt-2">
      <a-button @click="listenerFormModelVisible = false">取 消</a-button>
      <a-button class="ml-2" type="primary" @click="saveListenerConfig">保 存</a-button>
    </div>
  </a-drawer>
  <a-modal
    v-model:open="listenerFieldFormModelVisible"
    title="字段配置"
    width="500px"
    :cancelText="$t('opts.cancel')"
    :okText="$t('opts.sure')"
    destroyOnClose
  >
    <template #footer>
      <a-button key="back" @click="listenerFieldFormModelVisible = false">{{ $t('opts.cancel') }}</a-button>
      <a-button key="submit" type="primary" @click="saveListenerFiled">{{ $t('opts.sure') }}</a-button>
    </template>
    <a-form :model="listenerFieldForm" layout="vertical" ref="listenerFieldFormRef">
      <a-form-item label="字段名称" name="name" :rules="{ required: true, trigger: ['blur', 'change'] }">
        <a-input allowClear :placeholder="$t('inputTips')" v-model:value.trim="listenerFieldForm.name" />
      </a-form-item>
      <a-form-item label="字段类型" name="fieldType" :rules="{ required: true, trigger: ['blur', 'change'] }">
        <a-select
          show-search
          :filter-option="filterOption"
          allowClear
          :placeholder="$t('selectTips')"
          style="width: 100%"
          v-model:value="listenerFieldForm.fieldType"
        >
          <a-select-option v-for="i in Object.keys(fieldTypeObject)" :key="i" :value="i">{{
            fieldTypeObject[i]
          }}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item
        v-if="listenerFieldForm.fieldType === 'string'"
        label="字段值："
        name="string"
        :rules="{ required: true, trigger: ['blur', 'change'] }"
      >
        <a-input v-model:value.trim="listenerFieldForm.string" :placeholder="$t('inputTips')" allowClear />
      </a-form-item>
      <a-form-item
        v-if="listenerFieldForm.fieldType === 'expression'"
        label="表达式："
        name="expression"
        :rules="{ required: true, trigger: ['blur', 'change'] }"
      >
        <a-input v-model:value.trim="listenerFieldForm.expression" :placeholder="$t('inputTips')" allowClear />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, inject, nextTick, watch } from 'vue'
import { Modal } from 'ant-design-vue'
import userFilterOption from '@/hooks/userFilterOption'
const { filterOption } = userFilterOption()
import { createListenerObject, updateElementExtensions } from '../../utils'
import { initListenerType, initListenerForm, listenerType, fieldType } from './utilSelf'
// 使用inject注入函数
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
const columnsList = ref([
  {
    title: '序号',
    dataIndex: 'index',
    fixed: 'left',
    width: 50
  },
  {
    title: '事件类型',
    dataIndex: 'event',
    ellipsis: true
  },
  {
    title: '监听器类型',
    dataIndex: 'listenerType',
    ellipsis: true
  },
  {
    title: '操作',
    dataIndex: 'operation',
    width: 100
  }
])
const columnsFieldList = ref([
  {
    title: '序号',
    dataIndex: 'index',
    fixed: 'left',
    width: 50
  },
  {
    title: '字段名称',
    dataIndex: 'name',
    ellipsis: true
  },
  {
    title: '字段类型',
    dataIndex: 'fieldType',
    ellipsis: true
  },
  {
    title: '字段值/表达式',
    dataIndex: 'expression',
    ellipsis: true
  },
  {
    title: '操作',
    dataIndex: 'operation'
  }
])
const elementListenersList: any = ref([])
const listenerForm: any = ref({}) // 监听器详情表单
const listenerFormModelVisible: any = ref(false) // 监听器 编辑 侧边栏显示状态
const fieldsListOfListener: any = ref([])

const listenerFieldForm: any = ref({}) // 监听器 注入字段 详情表单
const listenerFieldFormModelVisible: any = ref(false) // 监听器 注入字段表单弹窗 显示状态
const editingListenerIndex: any = ref(-1) // 字段所在下标，-1 为新增
const editingListenerFieldIndex: any = ref(-1) // 字段所在下标，-1 为新增

const listenerTypeObject: any = ref(listenerType)
const fieldTypeObject: any = ref(fieldType)

const listenerFormRef: any = ref()
const listenerFieldFormRef: any = ref()

const otherExtensionList: any = ref([])

const bpmnElementListeners: any = ref([])

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
const resetData = () => {
  otherExtensionList.value = []
  bpmnElementListeners.value =
    props.businessObject?.extensionElements?.values?.filter((ex: any) => ex.$type === `${prefix}:ExecutionListener`) ??
    []
  elementListenersList.value = bpmnElementListeners.value.map((listener: any) => initListenerType(listener))
}
const saveListenerConfig = async () => {
  const bpmnInstances: any = _bpmnInstances()
  const bpmnElement = _bpmnElement()
  const validateStatus = await listenerFormRef.value.validate()
  if (!validateStatus) return // 验证不通过直接返回
  const listenerObject = createListenerObject(bpmnInstances, listenerForm.value, false, prefix)
  if (editingListenerIndex.value === -1) {
    bpmnElementListeners.value.push(listenerObject)
    elementListenersList.value.push(listenerForm.value)
  } else {
    bpmnElementListeners.value.splice(editingListenerIndex.value, 1, listenerObject)
    elementListenersList.value.splice(editingListenerIndex.value, 1, listenerForm.value)
  }
  // 保存其他配置
  otherExtensionList.value =
    props.businessObject?.extensionElements?.values?.filter((ex: any) => ex.$type !== `${prefix}:ExecutionListener`) ??
    []

  updateElementExtensions(bpmnInstances, bpmnElement, otherExtensionList.value.concat(bpmnElementListeners.value))
  // 4. 隐藏侧边栏
  listenerFormModelVisible.value = false
  listenerForm.value = {}
}
// 打开 监听器详情 侧边栏
const openListenerForm = (listener: any, index?: number) => {
  if (listener) {
    listenerForm.value = initListenerForm(listener)
    editingListenerIndex.value = index
  } else {
    listenerForm.value = {}
    editingListenerIndex.value = -1 // 标记为新增
  }
  if (listener && listener.fields) {
    fieldsListOfListener.value = listener.fields.map((field: any) => ({
      ...field,
      fieldType: field.string ? 'string' : 'expression'
    }))
  } else {
    fieldsListOfListener.value = []
    listenerForm.value.fields = []
  }
  // 打开侧边栏并清楚验证状态
  listenerFormModelVisible.value = true
  nextTick(() => {
    if (listenerFormRef?.value) listenerFormRef?.value?.clearValidate()
  })
}
// 打开监听器字段编辑弹窗
const openListenerFieldForm = (field?: string, index?: number) => {
  listenerFieldForm.value = field ? JSON.parse(JSON.stringify(field)) : {}
  editingListenerFieldIndex.value = field ? index : -1
  listenerFieldFormModelVisible.value = true
  nextTick(() => {
    if (listenerFieldFormRef?.value) listenerFieldFormRef?.value?.clearValidate()
  })
}
// 保存监听器注入字段
const saveListenerFiled = async () => {
  const validateStatus = await listenerFieldFormRef.value.validate()
  if (!validateStatus) return // 验证不通过直接返回
  if (editingListenerFieldIndex.value === -1) {
    fieldsListOfListener.value.push(listenerFieldForm.value)
    listenerForm.value.fields.push(listenerFieldForm.value)
  } else {
    fieldsListOfListener.value.splice(editingListenerFieldIndex.value, 1, listenerFieldForm.value)
    listenerForm.value.fields.splice(editingListenerFieldIndex.value, 1, listenerFieldForm.value)
  }
  listenerFieldFormModelVisible.value = false
  nextTick(() => (listenerFieldForm.value = {}))
}

// 移除监听器字段
const removeListenerField = (field: any, index: number) => {
  Modal.confirm({
    title: '提示',
    content: '确认移除该字段吗？',
    okText: '确 认',
    cancelText: '取 消',
    onOk() {
      fieldsListOfListener.value.splice(index, 1)
      listenerForm.value.fields.splice(index, 1)
    },
    onCancel() {
      console.info('操作取消')
      Modal.destroyAll()
    }
  })
}
// 移除监听器
const removeListener = (listener: any, index: number) => {
  const bpmnInstances: any = _bpmnInstances()
  const bpmnElement = _bpmnElement()
  Modal.confirm({
    title: '提示',
    content: '确认移除该监听器吗？',
    okText: '确 认',
    cancelText: '取 消',
    onOk() {
      bpmnElementListeners.value.splice(index, 1)
      elementListenersList.value.splice(index, 1)
      updateElementExtensions(bpmnInstances, bpmnElement, otherExtensionList.value.concat(bpmnElementListeners.value))
    },
    onCancel() {
      console.info('操作取消')
      Modal.destroyAll()
    }
  })
}
</script>

<style lang="scss" scoped></style>
