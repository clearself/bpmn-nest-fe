<template>
  <a-modal
    destroyOnClose
    v-model:open="showValue"
    :title="$t('opts.changePassword')"
    width="500px"
    :cancelText="$t('opts.cancel')"
    :okText="$t('opts.sure')"
    :afterClose="afterClose"
    @ok="handleOk"
  >
    <watermark>
      <a-form class="w100" ref="formRef" :model="formData" labelWrap :labelCol="{ style: { width: '100px' } }">
        <a-form-item :label="$t('user.columns.password')" name="password" :rules="rulesRef.password">
          <a-input allowClear :placeholder="$t('placeholder25')" v-model:value.trim="formData.password" />
        </a-form-item>
      </a-form>
    </watermark>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, computed, reactive, watchEffect } from 'vue'
import { message } from 'ant-design-vue'
import { $t } from '@/i18n'
import { resetUserPwd } from './server'
const emit = defineEmits(['update:show', 'success'])

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  curData: {
    type: Object,
    default: () => {}
  }
})
const formRef = ref()
const formData = reactive({
  userId: '',
  password: ''
})
const resetForm = () => {
  formData.userId = ''
  formData.password = ''
}
const rulesRef = reactive({
  password: [
    { required: true, message: $t('inputTips'), trigger: 'blur' },
    { min: 5, max: 20, message: $t('placeholder25'), trigger: 'blur' }
  ]
})
watchEffect(() => {
  if (props.show) {
    formData.userId = props.curData.userId
    formData.userName = ''
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
      const params: {
        userId: string
        password: string
      } = {
        password: formData.password,
        userId: formData.userId
      }
      const reponse = await resetUserPwd(params)
      if (reponse?.code === 200) {
        showValue.value = false
        message.success($t('opeateSuccess'))
        emit('success')
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
