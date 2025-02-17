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
    <watermark>
      <a-form class="w100" ref="formRef" :model="formData" labelWrap :labelCol="{ style: { width: '110px' } }">
        <a-form-item :label="$t('config.columns.configName')" name="configName" :rules="rulesRef.configName">
          <a-input allowClear :placeholder="$t('inputTips')" v-model:value.trim="formData.configName" />
        </a-form-item>
        <a-form-item :label="$t('config.columns.configKey')" name="configKey" :rules="rulesRef.configKey">
          <a-input allowClear :placeholder="$t('inputTips')" v-model:value.trim="formData.configKey" />
        </a-form-item>
        <a-form-item :label="$t('config.columns.configValue')" name="configValue" :rules="rulesRef.configValue">
          <a-input allowClear :placeholder="$t('inputTips')" v-model:value.trim="formData.configValue" />
        </a-form-item>
        <a-form-item :label="$t('config.columns.configType')">
          <a-radio-group v-model:value="formData.configType" name="configTypeState">
            <a-radio v-for="dict in sysYesNo" :key="dict.value" :value="dict.value">{{ dict.label }}</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item :label="$t('config.columns.remark')">
          <a-textarea allowClear :placeholder="$t('inputTips')" v-model:value.trim="formData.remark" />
        </a-form-item>
      </a-form>
    </watermark>
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
  sysYesNo: {
    type: Array,
    default: () => []
  }
})
const formRef = ref()
const formData = reactive<saveDataProp>({
  configId: '',
  configName: '',
  configKey: '',
  configValue: '',
  configType: 'Y',
  remark: ''
})
const resetForm = () => {
  formData.configId = ''
  formData.configName = ''
  formData.configKey = ''
  formData.configValue = ''
  formData.remark = ''
  formData.configType = 'Y'
}
const rulesRef = reactive({
  configName: [{ required: true, message: $t('inputTips'), trigger: 'blur' }],
  configKey: [{ required: true, message: $t('inputTips'), trigger: 'blur' }],
  configValue: [{ required: true, message: $t('inputTips'), trigger: 'blur' }]
})
watchEffect(() => {
  if (props.show) {
    if (props.status === 'edit') {
      formData.configId = props.curData.configId
      formData.configName = props.curData.configName
      formData.configKey = props.curData.configKey
      formData.configValue = props.curData.configValue
      formData.remark = props.curData.remark
      formData.configType = props.curData.configType
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
        configName: formData.configName,
        configKey: formData.configKey,
        configValue: formData.configValue,
        configType: formData.configType,
        remark: formData.remark
      }
      if (props.status === 'edit') {
        params.configId = props?.curData?.configId
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
</style>
