<template>
  <a-modal
    destroyOnClose
    v-model:open="showValue"
    :title="status === 'add' ? $t('opts.add') : $t('opts.edit')"
    width="800px"
    :cancelText="$t('opts.cancel')"
    :okText="$t('opts.sure')"
    :afterClose="afterClose"
    @ok="handleOk"
  >
    <watermark>
      <a-form class="w100" ref="formRef" :model="formData" labelWrap :labelCol="{ style: { width: '110px' } }">
        <a-form-item :label="$t('notice.columns.noticeTitle')" name="noticeTitle" :rules="rulesRef.noticeTitle">
          <a-input allowClear :placeholder="$t('inputTips')" v-model:value.trim="formData.noticeTitle" />
        </a-form-item>
        <a-form-item :label="$t('notice.columns.noticeType')" name="noticeType" :rules="rulesRef.noticeType">
          <a-select
            show-search
            :filter-option="filterOption"
            :options="sysNoticeType"
            allowClear
            :placeholder="$t('selectTips')"
            v-model:value="formData.noticeType"
          />
        </a-form-item>
        <a-form-item :label="$t('notice.columns.state')">
          <a-radio-group v-model:value="formData.status" name="noticeState">
            <a-radio v-for="dict in sysNormalDisable" :key="dict.value" :value="dict.value">{{ dict.label }}</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item :label="$t('notice.columns.noticeContent')">
          <editor v-model="formData.noticeContent" :min-height="192" />
        </a-form-item>
      </a-form>
    </watermark>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, computed, reactive, watchEffect } from 'vue'
import userFilterOption from '@/hooks/userFilterOption'
const { filterOption } = userFilterOption()
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
  sysNoticeType: {
    type: Array,
    default: () => []
  }
})
const formRef = ref()
const formData = reactive<saveDataProp>({
  noticeId: '',
  noticeTitle: '',
  noticeType: undefined,
  status: '0',
  noticeContent: ''
})
const resetForm = () => {
  formData.noticeId = ''
  formData.noticeTitle = ''
  formData.noticeContent = ''
  formData.noticeType = undefined
  formData.status = '0'
}
const rulesRef = reactive({
  noticeTitle: [{ required: true, message: $t('inputTips'), trigger: 'blur' }],
  noticeType: [{ required: true, message: $t('inputTips'), trigger: ['blur', 'change'] }]
})
watchEffect(() => {
  if (props.show) {
    if (props.status === 'edit') {
      formData.noticeId = props.curData.noticeId
      formData.noticeTitle = props.curData.noticeTitle
      formData.noticeContent = props.curData.noticeContent
      formData.status = props.curData.status
      formData.noticeType = props.curData.noticeType
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
        noticeTitle: formData.noticeTitle,
        status: formData.status,
        noticeType: formData.noticeType,
        noticeContent: formData.noticeContent
      }
      if (props.status === 'edit') {
        params.noticeId = props?.curData?.noticeId
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
