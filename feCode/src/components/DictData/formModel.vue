<template>
  <a-modal
    destroyOnClose
    v-model:open="showValue"
    :title="status === 'add' ? $t('opts.add') : $t('opts.edit')"
    width="500px"
    :cancelText="$t('opts.cancel')"
    :okText="$t('opts.sure')"
    :afterClose="afterClose"
    @ok="handleOk"
  >
    <a-form class="w100" ref="formRef" :model="formData" labelWrap :labelCol="{ style: { width: '110px' } }">
      <a-form-item :label="$t('dict.columnsData.dictType')">
        <a-input disabled allowClear :placeholder="$t('inputTips')" v-model:value.trim="_dictType" />
      </a-form-item>
      <a-form-item :label="$t('dict.columnsData.dictTag')" name="dictLabel" :rules="rulesRef.dictLabel">
        <a-input allowClear :placeholder="$t('inputTips')" v-model:value.trim="formData.dictLabel" />
      </a-form-item>
      <a-form-item :label="$t('dict.columnsData.dictKey')" name="dictValue" :rules="rulesRef.dictValue">
        <a-input allowClear :placeholder="$t('inputTips')" v-model:value.trim="formData.dictValue" />
      </a-form-item>
      <a-form-item :label="$t('dict.columnsData.cssClass')">
        <a-input allowClear :placeholder="$t('inputTips')" v-model:value.trim="formData.cssClass" />
      </a-form-item>
      <a-form-item :label="$t('dict.columnsData.sort')" name="dictSort" :rules="rulesRef.dictSort">
        <a-input-number v-model:value="formData.dictSort" :min="0" />
      </a-form-item>
      <a-form-item :label="$t('dict.columnsData.listClass')">
        <a-select v-model:value="formData.listClass" allowClear :placeholder="$t('selectTips')">
          <a-select-option v-for="item in listClassOptions" :key="item.value" :value="item.value"
            ><a-tag :color="item.value">{{ item.label + '(' + item.value + ')' }}</a-tag></a-select-option
          >
        </a-select>
      </a-form-item>
      <a-form-item :label="$t('dict.columnsData.state')">
        <a-radio-group v-model:value="formData.status" name="dictState">
          <a-radio v-for="dict in sysNormalDisable" :key="dict.value" :value="dict.value">{{ dict.label }}</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item :label="$t('dict.columnsData.remark')">
        <a-textarea allowClear :placeholder="$t('inputTips')" v-model:value.trim="formData.remark" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, computed, reactive, watchEffect } from 'vue'
import { message } from 'ant-design-vue'
import { $t } from '@/i18n'
import { saveDataProp } from './type'
import { add, edit } from './server'
const emit = defineEmits(['update:show', 'success'])

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    default: 'add'
  },
  curData: {
    type: Object,
    default: () => {}
  },
  sysNormalDisable: {
    type: Array,
    default: () => []
  },
  dictType: {
    type: String,
    default: ''
  }
})
const _dictType = computed(() => {
  return props.dictType
})
// 数据标签回显样式
const listClassOptions = ref([
  { value: 'default', label: '默认' },
  { value: 'processing', label: '主题' },
  { value: 'success', label: '成功' },
  { value: 'warning', label: '警告' },
  { value: 'error', label: '错误' },
  { value: 'magenta', label: '洋红' },
  { value: 'red', label: '红色' },
  { value: 'volcano', label: '火山' },
  { value: 'orange', label: '橙色' },
  { value: 'gold', label: '金色' },
  { value: 'lime', label: '石灰' },
  { value: 'green', label: '绿色' },
  { value: 'cyan', label: '蓝绿色' },
  { value: 'blue', label: '蓝色' },
  { value: 'geekblue', label: '极客蓝' },
  { value: 'purple', label: '紫色' }
])
const formRef = ref()
const formData = reactive<saveDataProp>({
  dictCode: '',
  dictLabel: '',
  dictValue: '',
  cssClass: '',
  listClass: undefined,
  dictSort: 0,
  status: '0',
  remark: ''
})
const resetForm = () => {
  formData.dictCode = ''
  formData.dictLabel = ''
  formData.dictValue = ''
  formData.cssClass = ''
  formData.listClass = undefined
  formData.dictSort = 0
  formData.remark = ''
  formData.status = '0'
}
const rulesRef = reactive({
  dictLabel: [{ required: true, message: $t('inputTips'), trigger: 'blur' }],
  dictValue: [{ required: true, message: $t('inputTips'), trigger: 'blur' }],
  dictSort: [{ required: true, message: $t('inputTips'), trigger: 'blur' }]
})
watchEffect(() => {
  if (props.show) {
    if (props.status === 'edit') {
      formData.dictCode = props.curData.dictCode
      formData.dictLabel = props.curData.dictLabel
      formData.dictValue = props.curData.dictValue
      formData.cssClass = props.curData.cssClass
      formData.listClass = props.curData.listClass
      formData.dictSort = props.curData.dictSort
      formData.remark = props.curData.remark
      formData.status = props.curData.status
    }
  }
})
const showValue = computed({
  get() {
    return props.show
  },
  set(value: boolean) {
    emit('update:show', value)
  }
})
const afterClose = () => {
  resetForm()
}
const handleOk = async () => {
  formRef.value
    .validate()
    .then(async () => {
      const params: saveDataProp = {
        dictLabel: formData.dictLabel,
        dictValue: formData.dictValue,
        dictType: _dictType.value,
        cssClass: formData.cssClass,
        listClass: formData.listClass,
        dictSort: formData.dictSort,
        remark: formData.remark,
        status: formData.status
      }
      if (props.status === 'edit') {
        params.dictCode = props?.curData?.dictCode
        const reponse = await edit(params)
        if (reponse?.code === 200) {
          showValue.value = false
          message.success($t('opeateSuccess'))
          emit('success')
        }
      } else {
        const reponse = await add(params)
        if (reponse?.code === 200) {
          showValue.value = false
          message.success($t('opeateSuccess'))
          emit('success')
        }
      }
    })
    .catch((error: any) => {
      console.log(error, 'error')
    })
}
</script>

<style lang="scss" scoped>
.select-box {
  position: relative;
  display: inline-flex;
  width: 100%;
  min-width: 0;
  padding: 4px 11px;
  color: rgba(0, 0, 0, 0.2);
  font-size: 14px;
  line-height: 1.5714285714285714;
  background-color: #ffffff;
  background-image: none;
  border-width: 1px;
  border-style: solid;
  border-color: #d9d9d9;
  border-radius: 6px;
  transition: all 0.2s;
  cursor: pointer;
}
:deep(.tree-border) {
  margin-top: 10px;
  border: 1px solid #d9d9d9;
}
</style>
