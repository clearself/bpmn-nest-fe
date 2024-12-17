<template>
  <div class="w100">
    <a-table
      class="ant-table-striped"
      :row-class-name="(_record: any, index: number) => (index % 2 === 1 ? 'table-striped' : null)"
      bordered
      size="small"
      :columns="columnsList"
      :row-key="(record: any) => record.id"
      :data-source="elementPropertyList"
      :pagination="false"
      :scroll="{ y: 500 }"
    >
      <template #bodyCell="{ column, record, index }">
        <template v-if="column.dataIndex === 'index'">
          <a> {{ parseInt(index) + 1 }} </a>
        </template>
        <template v-if="column.dataIndex === 'operation'">
          <a-button type="link" size="small" @click="openAttributesForm(record, index)">{{ $t('opts.edit') }}</a-button>
          <a-button type="link" size="small" @click="removeAttributes(record, index)">{{ $t('opts.delete') }}</a-button>
        </template>
      </template>
    </a-table>
    <div class="w100 mt-1">
      <a-button block type="primary" @click="openAttributesForm(null, -1)">添加属性</a-button>
    </div>
  </div>
  <a-modal
    v-model:open="propertyFormModelVisible"
    title="属性配置"
    width="600px"
    :cancelText="$t('opts.cancel')"
    :okText="$t('opts.sure')"
    destroyOnClose
  >
    <template #footer>
      <a-button key="back" @click="propertyFormModelVisible = false">{{ $t('opts.cancel') }}</a-button>
      <a-button key="submit" type="primary" @click="saveAttribute">{{ $t('opts.sure') }}</a-button>
    </template>
    <a-form :model="propertyForm" layout="vertical" ref="attributeFormRef">
      <a-form-item label="属性名" name="name" :rules="{ required: true, trigger: ['blur', 'change'] }">
        <a-input allowClear :placeholder="$t('inputTips')" v-model:value.trim="propertyForm.name" />
      </a-form-item>
      <a-form-item label="属性值：" name="value" :rules="{ required: true, trigger: ['blur', 'change'] }">
        <a-input v-model:value.trim="propertyForm.value" :placeholder="$t('inputTips')" allowClear />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, inject, nextTick, watch, createVNode, toRaw } from 'vue'
import { Modal } from 'ant-design-vue'
import { ExclamationCircleOutlined } from '@ant-design/icons-vue'
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
    title: '属性名',
    dataIndex: 'name',
    ellipsis: true
  },
  {
    title: '属性值',
    dataIndex: 'value',
    ellipsis: true
  },
  {
    title: '操作',
    dataIndex: 'operation',
    width: 120
  }
])

const elementPropertyList = ref<any[]>([])
const propertyForm = ref<any>({})
const editingPropertyIndex = ref(-1)
const propertyFormModelVisible = ref(false)
const otherExtensionList = ref()
const bpmnElementProperties = ref()
const bpmnElementPropertyList = ref()
const attributeFormRef = ref()

watch(
  () => props.businessObject,
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
  bpmnElementProperties.value =
    props.businessObject?.extensionElements?.values?.filter((ex: any) => {
      if (ex.$type !== `${prefix}:Properties`) {
        otherExtensionList.value.push(ex)
      }
      return ex.$type === `${prefix}:Properties`
    }) ?? []

  // 保存所有的 扩展属性字段
  bpmnElementPropertyList.value = bpmnElementProperties.value.reduce(
    (pre: any, current: any) => pre.concat(current.values),
    []
  )
  // 复制 显示
  elementPropertyList.value = JSON.parse(JSON.stringify(bpmnElementPropertyList.value ?? []))
}

const openAttributesForm = (attr: any, index: number) => {
  editingPropertyIndex.value = index
  propertyForm.value = index === -1 ? {} : JSON.parse(JSON.stringify(attr))
  propertyFormModelVisible.value = true
  nextTick(() => {
    if (attributeFormRef.value) attributeFormRef.value.clearValidate()
  })
}

const updateElementExtensionsCopy = (properties: any) => {
  const bpmnInstances: any = _bpmnInstances()
  const bpmnElement: any = _bpmnElement()
  const extensions = bpmnInstances.moddle.create('bpmn:ExtensionElements', {
    values: otherExtensionList.value.concat([properties])
  })
  bpmnInstances.modeling.updateProperties(bpmnElement, {
    extensionElements: extensions
  })
}
const removeAttributes = (attr: any, index: number) => {
  console.log(attr, 'attr')
  const bpmnInstances: any = _bpmnInstances()
  Modal.confirm({
    title: () => '提示',
    icon: () => createVNode(ExclamationCircleOutlined),
    content: () => '确认移除该属性吗？',
    onOk() {
      elementPropertyList.value.splice(index, 1)
      bpmnElementPropertyList.value.splice(index, 1)
      // 新建一个属性字段的保存列表
      const propertiesObject = bpmnInstances.moddle.create(`${prefix}:Properties`, {
        values: bpmnElementPropertyList.value
      })
      updateElementExtensionsCopy(propertiesObject)
      resetData()
    },
    onCancel() {
      console.info('操作取消')
    }
  })
}

const saveAttribute = () => {
  const bpmnInstances: any = _bpmnInstances()
  const bpmnElement: any = _bpmnElement()
  const { name, value } = propertyForm.value
  if (editingPropertyIndex.value !== -1) {
    bpmnInstances.modeling.updateModdleProperties(
      bpmnElement,
      toRaw(bpmnElementPropertyList.value)[toRaw(editingPropertyIndex.value)],
      {
        name,
        value
      }
    )
  } else {
    // 新建属性字段
    const newPropertyObject = bpmnInstances.moddle.create(`${prefix}:Property`, {
      name,
      value
    })
    // 新建一个属性字段的保存列表
    const propertiesObject = bpmnInstances.moddle.create(`${prefix}:Properties`, {
      values: bpmnElementPropertyList.value.concat([newPropertyObject])
    })
    updateElementExtensionsCopy(propertiesObject)
  }
  propertyFormModelVisible.value = false
  resetData()
}
</script>

<style lang="scss" scoped></style>
