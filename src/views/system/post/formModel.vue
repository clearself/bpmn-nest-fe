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
        <a-form-item :label="$t('post.columns.postName')" name="postName" :rules="rulesRef.postName">
          <a-input allowClear :placeholder="$t('inputTips')" v-model:value.trim="formData.postName" />
        </a-form-item>
        <a-form-item :label="$t('post.columns.postCode')" name="postCode" :rules="rulesRef.postCode">
          <a-input allowClear :placeholder="$t('inputTips')" v-model:value.trim="formData.postCode" />
        </a-form-item>
        <a-form-item :label="$t('post.columns.state')">
          <a-radio-group v-model:value="formData.status" name="postState">
            <a-radio v-for="dict in sysNormalDisable" :key="dict.value" :value="dict.value">{{ dict.label }}</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item :label="$t('post.columns.remark')">
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
  sysNormalDisable: {
    type: Array,
    default: () => []
  }
})
const formRef = ref()
const formData = reactive<saveDataProp>({
  postId: '',
  postName: '',
  postCode: '',
  status: '0',
  remark: ''
})
const resetForm = () => {
  formData.postId = ''
  formData.postName = ''
  formData.postCode = ''
  formData.remark = ''
  formData.status = '0'
}
const rulesRef = reactive({
  postName: [{ required: true, message: $t('inputTips'), trigger: 'blur' }],
  postCode: [{ required: true, message: $t('inputTips'), trigger: 'blur' }]
})
watchEffect(() => {
  if (props.show) {
    if (props.status === 'edit') {
      formData.postId = props.curData.deptId
      formData.postName = props.curData.postName
      formData.postCode = props.curData.postCode
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
        postName: formData.postName,
        postCode: formData.postCode,
        remark: formData.remark,
        status: formData.status
      }
      if (props.status === 'edit') {
        params.postId = props?.curData?.postId
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
